import { cn } from '../../lib/utils'
import { useEffect, useRef, useState } from 'react'

export function BackgroundGradientAnimation({
  gradientBackgroundStart = 'rgb(5, 5, 6)',
  gradientBackgroundEnd = 'rgb(18, 18, 20)',
  firstColor = '255, 255, 255',
  secondColor = '160, 160, 170',
  thirdColor = '110, 110, 120',
  fourthColor = '70, 70, 78',
  fifthColor = '210, 210, 220',
  pointerColor = '255, 255, 255',
  size = '80%',
  blendingValue = 'soft-light',
  children,
  className,
  interactive = true,
  containerClassName,
}) {
  const interactiveRef = useRef(null)
  const frameRef = useRef(null)
  const [current, setCurrent] = useState({ x: 0, y: 0 })
  const [target, setTarget] = useState({ x: 0, y: 0 })
  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    document.body.style.setProperty('--gradient-background-start', gradientBackgroundStart)
    document.body.style.setProperty('--gradient-background-end', gradientBackgroundEnd)
    document.body.style.setProperty('--first-color', firstColor)
    document.body.style.setProperty('--second-color', secondColor)
    document.body.style.setProperty('--third-color', thirdColor)
    document.body.style.setProperty('--fourth-color', fourthColor)
    document.body.style.setProperty('--fifth-color', fifthColor)
    document.body.style.setProperty('--pointer-color', pointerColor)
    document.body.style.setProperty('--size', size)
    document.body.style.setProperty('--blending-value', blendingValue)
  }, [
    blendingValue,
    fifthColor,
    firstColor,
    fourthColor,
    gradientBackgroundEnd,
    gradientBackgroundStart,
    pointerColor,
    secondColor,
    size,
    thirdColor,
  ])

  useEffect(() => {
    if (!interactive) return undefined

    const animate = () => {
      setCurrent((prev) => {
        const next = {
          x: prev.x + (target.x - prev.x) / 20,
          y: prev.y + (target.y - prev.y) / 20,
        }

        if (interactiveRef.current) {
          interactiveRef.current.style.transform = `translate(${Math.round(next.x)}px, ${Math.round(next.y)}px)`
        }

        return next
      })

      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [interactive, target.x, target.y])

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  const handleMouseMove = (event) => {
    if (!interactiveRef.current) return
    const rect = interactiveRef.current.getBoundingClientRect()
    setTarget({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  return (
    <div
      className={cn(
        'relative left-0 top-0 overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]',
        containerClassName,
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className={cn('', className)}>{children}</div>

      <div
        className={cn(
          'gradients-container absolute inset-0 h-full w-full blur-lg',
          isSafari ? 'blur-2xl' : '[filter:url(#blurMe)_blur(40px)]',
        )}
      >
        <div className="absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_45%)_no-repeat] [mix-blend-mode:var(--blending-value)] left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-first opacity-70 [transform-origin:center_center]" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.7)_0,_rgba(var(--second-color),_0)_45%)_no-repeat] [mix-blend-mode:var(--blending-value)] left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-second opacity-70 [transform-origin:calc(50%-400px)]" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.55)_0,_rgba(var(--third-color),_0)_45%)_no-repeat] [mix-blend-mode:var(--blending-value)] left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-third opacity-60 [transform-origin:calc(50%+400px)]" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.45)_0,_rgba(var(--fourth-color),_0)_45%)_no-repeat] [mix-blend-mode:var(--blending-value)] left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-fourth opacity-50 [transform-origin:calc(50%-200px)]" />
        <div className="absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.6)_0,_rgba(var(--fifth-color),_0)_45%)_no-repeat] [mix-blend-mode:var(--blending-value)] left-[calc(50%-var(--size)/2)] top-[calc(50%-var(--size)/2)] h-[var(--size)] w-[var(--size)] animate-fifth opacity-55 [transform-origin:calc(50%-800px)_calc(50%+800px)]" />

        {interactive ? (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className="absolute -left-1/2 -top-1/2 h-full w-full bg-[radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.18)_0,_rgba(var(--pointer-color),_0)_40%)_no-repeat] opacity-50 [mix-blend-mode:var(--blending-value)]"
          />
        ) : null}
      </div>
    </div>
  )
}
