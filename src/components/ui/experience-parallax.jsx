import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

function ExperienceCard({ item, translate }) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -18 }}
      className="group relative h-72 w-[22rem] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)] opacity-80" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/40">{item.year}</p>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.04em] text-white">{item.company}</h3>
          <p className="mt-2 text-sm text-neutral-300">{item.role}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-neutral-400">{item.period}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/55"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ExperienceParallax({ items, title, description }) {
  const firstRow = items.slice(0, 2)
  const secondRow = items.slice(2, 4)
  const thirdRow = items.slice(4)
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 280]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -280]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [14, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.15], [0.45, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [10, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-120, 60]), springConfig)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div className="mx-auto mb-14 max-w-7xl px-6 sm:px-8 lg:px-10">
        <p className="text-sm uppercase tracking-[0.35em] text-white/45">Experience</p>
        <h2 className="mt-4 max-w-4xl text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">{description}</p> : null}
      </div>

      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="mx-auto max-w-[1400px]"
      >
        <motion.div className="mb-8 flex flex-row-reverse gap-6 px-6 sm:px-8 lg:px-10">
          {firstRow.map((item) => (
            <ExperienceCard key={item.company} item={item} translate={translateX} />
          ))}
        </motion.div>

        <motion.div className="mb-8 flex flex-row gap-6 px-6 sm:px-8 lg:px-10">
          {secondRow.map((item) => (
            <ExperienceCard key={item.company} item={item} translate={translateXReverse} />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse gap-6 px-6 sm:px-8 lg:px-10">
          {thirdRow.map((item) => (
            <ExperienceCard key={item.company} item={item} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
