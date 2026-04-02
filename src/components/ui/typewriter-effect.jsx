import { motion, stagger, useAnimate, useInView } from 'motion/react'
import { useEffect } from 'react'
import { cn } from '../../lib/utils'

export function TypewriterEffect({ words, className, cursorClassName }) {
  const wordsArray = words.map((word) => ({ ...word, text: word.text.split('') }))
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)

  useEffect(() => {
    if (isInView) {
      animate(
        'span',
        { display: 'inline-block', opacity: 1, width: 'fit-content' },
        { duration: 0.3, delay: stagger(0.1), ease: 'easeInOut' },
      )
    }
  }, [animate, isInView])

  return (
    <div className={cn('text-center text-base font-bold sm:text-xl md:text-3xl lg:text-5xl', className)}>
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => (
          <div key={`word-${idx}`} className="inline-block">
            {word.text.map((char, index) => (
              <motion.span
                key={`char-${index}`}
                className={cn('hidden text-white opacity-0', word.className)}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('inline-block h-[0.95em] w-[0.55em] rounded-[0.08em] bg-white align-middle', cursorClassName)}
      />
    </div>
  )
}

export function TypewriterEffectSmooth({ words, className, cursorClassName }) {
  const wordsArray = words.map((word) => ({ ...word, text: word.text.split('') }))

  return (
    <div className={cn('my-6 flex items-end space-x-1', className)}>
      <motion.div
        className="overflow-hidden"
        initial={{ width: '0%' }}
        whileInView={{ width: 'fit-content' }}
        transition={{ duration: 2, ease: 'linear', delay: 1 }}
      >
        <div className="text-xs font-bold leading-none sm:text-base md:text-xl xl:text-5xl" style={{ whiteSpace: 'nowrap' }}>
          <div>
            {wordsArray.map((word, idx) => (
              <div key={`word-${idx}`} className="inline-block">
                {word.text.map((char, index) => (
                  <span key={`char-${index}`} className={cn('text-white', word.className)}>
                    {char}
                  </span>
                ))}
                &nbsp;
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className={cn('mb-[0.04em] block h-[0.95em] w-[0.55em] rounded-[0.08em] bg-white', cursorClassName)}
      />
    </div>
  )
}
