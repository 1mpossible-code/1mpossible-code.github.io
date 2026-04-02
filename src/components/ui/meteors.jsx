import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

export function Meteors({ number, className }) {
  const meteors = new Array(number || 20).fill(true)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {meteors.map((_, index) => {
        const meteorCount = number || 20
        const position = index * (800 / meteorCount) - 400

        return (
          <span
            key={`meteor-${index}`}
            className={cn(
              'animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]',
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: '-40px',
              left: `${position}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.floor(Math.random() * (10 - 5) + 5)}s`,
            }}
          />
        )
      })}
    </motion.div>
  )
}
