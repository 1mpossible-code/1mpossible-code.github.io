import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function Timeline({ data, title, description }) {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [data])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className="w-full bg-transparent font-sans md:px-10" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <p className="text-sm uppercase tracking-[0.35em] text-white/45">Experience</p>
        <h2 className="mt-4 max-w-4xl text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">{description}</p> : null}
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex justify-start gap-0 pt-10 md:gap-10 md:pt-28">
            <div className="sticky top-40 z-40 flex max-w-xs self-start md:w-full md:max-w-sm md:flex-row md:items-center">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black md:left-3">
                <div className="h-4 w-4 rounded-full border border-neutral-600 bg-neutral-800 p-2" />
              </div>
              <h3 className="hidden pl-20 text-3xl font-bold text-neutral-500 md:block lg:text-5xl">{item.title}</h3>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="mb-4 block text-2xl font-bold text-neutral-500 md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-white via-neutral-300 to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  )
}
