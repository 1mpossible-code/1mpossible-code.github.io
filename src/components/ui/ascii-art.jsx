import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '../../lib/utils'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const ASCII_CHARSETS = {
  standard: ' .,:;i1tfLCG08@',
  blocks: ' ░▒▓█',
  binary: ' 01',
  dots: ' ·•●',
  minimal: ' .:░▒',
  dense: ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  arrows: ' ←↑→↓↔↕↖↗↘↙',
  stars: ' ·✦✧★',
  hash: ' -=#',
  pipes: ' |/─\\│',
  braille: ' ⠁⠃⠇⠏⠟⠿⡿⣿',
  circles: ' ○◔◑◕●',
  squares: ' ▢▣▤▥▦▧▨▩',
  hearts: ' ♡♥',
  math: ' +-×÷=≠≈∞',
}

const MATRIX_CHARSET = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'

const resolveCharset = (charset) => ASCII_CHARSETS[charset] || charset

const resolveCssColor = (color, element) => {
  if (!color) return color

  if (color.startsWith('var(')) {
    if (!element) return '#ffffff'

    const tempDiv = document.createElement('div')
    tempDiv.style.color = color
    element.appendChild(tempDiv)
    const computedColor = getComputedStyle(tempDiv).color
    element.removeChild(tempDiv)
    return computedColor || '#ffffff'
  }

  return color
}

export function AsciiArt({
  src,
  resolution = 80,
  charset = 'standard',
  color = '#ffffff',
  backgroundColor = 'transparent',
  inverted = false,
  colored = false,
  animated = true,
  animationStyle = 'fade',
  animationDuration = 1,
  fontFamily = 'monospace',
  className,
  animateOnView = true,
  objectFit = 'cover',
}) {
  const uniqueId = useId()
  const [asciiData, setAsciiData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  const shouldStartAnimation = animated && animateOnView ? isInView : animated
  const shouldShowStatic = !animated || animationStyle === 'none'
  const resolvedCharset = resolveCharset(charset)
  const effectiveCharset = inverted ? resolvedCharset.split('').reverse().join('') : resolvedCharset
  const textColor = color || (inverted ? '#ffffff' : '#000000')

  useEffect(() => {
    let isCancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      if (isCancelled) return

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setError('Canvas context not available')
        return
      }

      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      const imgAspect = imgWidth / imgHeight
      const charAspectRatio = 0.55
      const cols = resolution
      const rows = Math.floor(cols * charAspectRatio)

      canvas.width = cols
      canvas.height = rows

      const visualAspect = 1
      let sx = 0
      let sy = 0
      let sw = imgWidth
      let sh = imgHeight

      if (objectFit === 'cover') {
        if (imgAspect > visualAspect) {
          sw = imgHeight * visualAspect
          sx = (imgWidth - sw) / 2
        } else {
          sh = imgWidth / visualAspect
          sy = (imgHeight - sh) / 2
        }
      } else if (objectFit === 'contain') {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, cols, rows)

        let dw
        let dh
        let dx
        let dy
        if (imgAspect > visualAspect) {
          dw = cols
          dh = (cols / imgAspect) * charAspectRatio
          dx = 0
          dy = (rows - dh) / 2
        } else {
          dh = rows
          dw = (rows * imgAspect) / charAspectRatio
          dx = (cols - dw) / 2
          dy = 0
        }
        ctx.drawImage(img, dx, dy, dw, dh)
      }

      if (objectFit !== 'contain') {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
      }

      let imageData
      try {
        imageData = ctx.getImageData(0, 0, cols, rows)
      } catch {
        setError('Unable to read image data (CORS issue)')
        return
      }

      const data = imageData.data
      const result = []

      for (let y = 0; y < rows; y += 1) {
        const row = []
        for (let x = 0; x < cols; x += 1) {
          const idx = (y * cols + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]
          const a = data[idx + 3]
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
          const adjustedBrightness = a === 0 ? 0 : brightness
          const charIndex = Math.floor(adjustedBrightness * (effectiveCharset.length - 1))
          const char = effectiveCharset[charIndex] || ' '
          row.push({ char, r, g, b })
        }
        result.push(row)
      }

      setAsciiData(result)
      setIsLoaded(true)
    }

    img.onerror = () => {
      if (!isCancelled) setError('Failed to load image')
    }

    return () => {
      isCancelled = true
    }
  }, [src, resolution, effectiveCharset, objectFit])

  const drawCanvas = useCallback(
    (progress = 1, matrixProgress) => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container || asciiData.length === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      if (containerWidth === 0 || containerHeight === 0) return

      canvas.width = containerWidth * dpr
      canvas.height = containerHeight * dpr
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`
      ctx.scale(dpr, dpr)

      const resolvedBgColor = resolveCssColor(backgroundColor, container)
      const resolvedTextColor = resolveCssColor(textColor, container)

      if (resolvedBgColor !== 'transparent') {
        ctx.fillStyle = resolvedBgColor
        ctx.fillRect(0, 0, containerWidth, containerHeight)
      } else {
        ctx.clearRect(0, 0, containerWidth, containerHeight)
      }

      const rows = asciiData.length
      const cols = asciiData[0]?.length || 0
      if (cols === 0) return

      const charWidth = containerWidth / cols
      const charHeight = containerHeight / rows
      const fontSize = Math.min(charWidth * 1.8, charHeight * 1.2)
      ctx.font = `${fontSize}px ${fontFamily}`
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      const totalChars = rows * cols
      const revealedChars = Math.floor(progress * totalChars)
      let charIndex = 0

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const pixel = asciiData[y][x]
          const cx = x * charWidth + charWidth / 2
          const cy = y * charHeight

          if (animationStyle === 'typewriter' && charIndex >= revealedChars) {
            charIndex += 1
            continue
          }

          let displayChar = pixel.char
          let displayColor = colored ? `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` : resolvedTextColor

          if (animationStyle === 'matrix' && matrixProgress !== undefined) {
            const charProgress = (x * 0.02 + y * 0.01) / 2
            if (matrixProgress < charProgress) {
              charIndex += 1
              continue
            }

            if (matrixProgress < charProgress + 0.15) {
              displayChar = MATRIX_CHARSET[Math.floor(Math.random() * MATRIX_CHARSET.length)]
              displayColor = '#00ff00'
              ctx.shadowColor = '#00ff00'
              ctx.shadowBlur = 5
            } else {
              ctx.shadowBlur = 0
            }
          }

          ctx.fillStyle = displayColor
          ctx.globalAlpha = animationStyle === 'fade' ? progress : 1
          ctx.fillText(displayChar, cx, cy)
          charIndex += 1
        }
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    },
    [asciiData, backgroundColor, colored, textColor, fontFamily, animationStyle],
  )

  useEffect(() => {
    if (!isLoaded || asciiData.length === 0) return

    const draw = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) {
        requestAnimationFrame(draw)
        return
      }

      if (shouldShowStatic || hasAnimated || !shouldStartAnimation) {
        drawCanvas(1)
        return
      }

      const startTime = performance.now()
      const duration =
        animationStyle === 'fade'
          ? animationDuration * 1000
          : animationStyle === 'typewriter'
            ? asciiData.length * (asciiData[0]?.length || 0) * 2
            : animationStyle === 'matrix'
              ? 3000
              : 1000

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        if (animationStyle === 'matrix') {
          drawCanvas(1, progress)
        } else {
          drawCanvas(progress)
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setHasAnimated(true)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [
    animationDuration,
    animationStyle,
    asciiData,
    drawCanvas,
    hasAnimated,
    isLoaded,
    shouldShowStatic,
    shouldStartAnimation,
  ])

  useIsomorphicLayoutEffect(() => {
    if (isLoaded && asciiData.length > 0) {
      drawCanvas(1)
    }
  }, [asciiData, drawCanvas, isLoaded])

  useEffect(() => {
    if (!isLoaded || asciiData.length === 0 || !containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      drawCanvas(1)
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [asciiData, drawCanvas, isLoaded])

  if (error) {
    return <div className={cn('flex items-center justify-center font-mono text-sm text-red-500', className)}>Error: {error}</div>
  }

  if (!isLoaded) {
    return (
      <div
        className={cn('flex animate-pulse items-center justify-center font-mono text-sm text-neutral-500', className)}
        style={{ backgroundColor }}
      >
        Loading...
      </div>
    )
  }

  const canvasElement = (
    <canvas
      key={uniqueId}
      id={`ascii-canvas-${uniqueId}`}
      ref={canvasRef}
      className="block h-full w-full"
      aria-label="ASCII art rendering of image"
      role="img"
    />
  )

  if (animationStyle === 'fade' && animated && !hasAnimated) {
    return (
      <motion.div
        ref={containerRef}
        className={cn('overflow-hidden', className)}
        style={{ backgroundColor }}
        initial={{ opacity: 0 }}
        animate={shouldStartAnimation ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: animationDuration * 0.3 }}
      >
        {canvasElement}
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className={cn('overflow-hidden', className)} style={{ backgroundColor }}>
      {canvasElement}
    </div>
  )
}
