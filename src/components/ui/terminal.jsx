import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

function useInView(ref, once = true) {
  const [inView, setInView] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || (once && triggered.current)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          setInView(true)
          if (once) {
            triggered.current = true
            observer.disconnect()
          }
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, ref])

  return inView
}

function tokenizeBash(text) {
  const tokens = []
  const words = text.split(/(\s+)/)
  let isFirstWord = true

  for (const word of words) {
    if (/^\s+$/.test(word)) {
      tokens.push({ type: 'default', value: word })
      continue
    }

    if (word.startsWith('#')) {
      tokens.push({ type: 'comment', value: word })
      continue
    }

    if (word.startsWith('$')) {
      tokens.push({ type: 'variable', value: word })
      isFirstWord = false
      continue
    }

    if (word.startsWith('--') || word.startsWith('-')) {
      tokens.push({ type: 'flag', value: word })
      isFirstWord = false
      continue
    }

    if (/^["'].*["']$/.test(word)) {
      tokens.push({ type: 'string', value: word })
      isFirstWord = false
      continue
    }

    if (/^\d+$/.test(word)) {
      tokens.push({ type: 'number', value: word })
      isFirstWord = false
      continue
    }

    if (/^[|>&<]+$/.test(word)) {
      tokens.push({ type: 'operator', value: word })
      isFirstWord = true
      continue
    }

    if (word.includes('/') || word.startsWith('.') || word.startsWith('~')) {
      tokens.push({ type: 'path', value: word })
      isFirstWord = false
      continue
    }

    if (isFirstWord) {
      tokens.push({ type: 'command', value: word })
      isFirstWord = false
      continue
    }

    tokens.push({ type: 'default', value: word })
  }

  return tokens
}

const tokenColors = {
  command: 'text-emerald-400',
  flag: 'text-sky-400',
  string: 'text-amber-300',
  number: 'text-purple-400',
  operator: 'text-red-400',
  path: 'text-cyan-300',
  variable: 'text-pink-400',
  comment: 'text-neutral-500',
  default: 'text-neutral-300',
}

function SyntaxHighlightedText({ text }) {
  const tokens = tokenizeBash(text)

  return (
    <>
      {tokens.map((token, index) => (
        <span key={`${token.value}-${index}`} className={tokenColors[token.type]}>
          {token.value}
        </span>
      ))}
    </>
  )
}

export function Terminal({
  commands = ['npx shadcn@latest init'],
  outputs = {},
  username = 'maksym',
  className,
  typingSpeed = 40,
  delayBetweenCommands = 800,
  initialDelay = 350,
}) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const inView = useInView(containerRef)

  const [lines, setLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [commandIdx, setCommandIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [outputIdx, setOutputIdx] = useState(-1)
  const [phase, setPhase] = useState('idle')
  const [cursorVisible, setCursorVisible] = useState(true)

  const currentCommand = commands[commandIdx] || ''
  const currentOutputs = useMemo(() => outputs[commandIdx] || [], [outputs, commandIdx])
  const isLastCommand = commandIdx === commands.length - 1

  useEffect(() => {
    if (!inView || phase !== 'idle') return
    const timer = window.setTimeout(() => setPhase('typing'), initialDelay)
    return () => window.clearTimeout(timer)
  }, [inView, initialDelay, phase])

  useEffect(() => {
    if (phase !== 'typing') return

    if (charIdx < currentCommand.length) {
      const timer = window.setTimeout(() => {
        setCurrentText(currentCommand.slice(0, charIdx + 1))
        setCharIdx((value) => value + 1)
      }, typingSpeed + Math.random() * 30)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => setPhase('executing'), 80)
    return () => window.clearTimeout(timer)
  }, [charIdx, currentCommand, phase, typingSpeed])

  useEffect(() => {
    if (phase !== 'executing') return

    setLines((previous) => [...previous, { type: 'command', content: currentCommand }])
    setCurrentText('')

    if (currentOutputs.length > 0) {
      setOutputIdx(0)
      setPhase('outputting')
    } else if (isLastCommand) {
      setPhase('done')
    } else {
      setPhase('pausing')
    }
  }, [currentCommand, currentOutputs.length, isLastCommand, phase])

  useEffect(() => {
    if (phase !== 'outputting') return

    if (outputIdx >= 0 && outputIdx < currentOutputs.length) {
      const timer = window.setTimeout(() => {
        setLines((previous) => [...previous, { type: 'output', content: currentOutputs[outputIdx] }])
        setOutputIdx((value) => value + 1)
      }, 150)
      return () => window.clearTimeout(timer)
    }

    if (outputIdx >= currentOutputs.length) {
      const timer = window.setTimeout(() => {
        setPhase(isLastCommand ? 'done' : 'pausing')
      }, 300)
      return () => window.clearTimeout(timer)
    }
  }, [currentOutputs, isLastCommand, outputIdx, phase])

  useEffect(() => {
    if (phase !== 'pausing') return

    const timer = window.setTimeout(() => {
      setCharIdx(0)
      setOutputIdx(-1)
      setCommandIdx((value) => value + 1)
      setPhase('typing')
    }, delayBetweenCommands)

    return () => window.clearTimeout(timer)
  }, [delayBetweenCommands, phase])

  useEffect(() => {
    const interval = window.setInterval(() => setCursorVisible((value) => !value), 530)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [lines, phase])

  const prompt = (
    <span className="text-neutral-500">
      <span className="text-sky-500">{username}</span>
      <span className="text-emerald-600">:</span>
      <span className="text-sky-400">~</span>
      <span className="text-neutral-500">$</span>{' '}
    </span>
  )

  return (
    <div ref={containerRef} className={cn('mx-auto w-full px-4 font-mono text-xs', className)}>
      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="truncate text-xs text-neutral-400">{username} - bash</span>
          </div>
          <div className="w-[52px]" />
        </div>

        <div ref={contentRef} className="h-80 overflow-y-auto p-4 font-mono">
          {lines.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap leading-relaxed">
              {line.type === 'command' ? (
                <span>
                  {prompt}
                  <SyntaxHighlightedText text={line.content} />
                </span>
              ) : (
                <span className="text-neutral-400">{line.content}</span>
              )}
            </div>
          ))}

          {phase === 'typing' ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {prompt}
              <SyntaxHighlightedText text={currentText} />
              <span className="ml-0.5 inline-block h-4 w-2 bg-neutral-300 align-middle" />
            </div>
          ) : null}

          {phase === 'done' || phase === 'pausing' || phase === 'outputting' ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {prompt}
              <span
                className={cn(
                  'inline-block h-4 w-2 bg-neutral-300 align-middle transition-opacity duration-100',
                  !cursorVisible && 'opacity-0',
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
