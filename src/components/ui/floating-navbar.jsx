import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { cn } from '../../lib/utils'

export function FloatingNav({ navItems, cta, className, forceVisible = false }) {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(forceVisible)

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (forceVisible || typeof current !== 'number') {
      return
    }

    const previous = scrollYProgress.getPrevious() ?? 0
    const direction = current - previous

    if (scrollYProgress.get() < 0.05) {
      setVisible(false)
    } else if (direction < 0) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn('fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center', className)}
      >
        <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/55 px-2 py-1.5 shadow-lg shadow-black/20 backdrop-blur-md">
          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                target={navItem.external ? '_blank' : undefined}
                rel={navItem.external ? 'noreferrer' : undefined}
                className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          {cta ? <div className="h-5 w-px bg-white/10" /> : null}

          {cta ? (
            <a
              href={cta.link}
              target={cta.external ? '_blank' : undefined}
              rel={cta.external ? 'noreferrer' : undefined}
              className="relative rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:bg-neutral-100"
            >
              <span>{cta.label}</span>
            </a>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
