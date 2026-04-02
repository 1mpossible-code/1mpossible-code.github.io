import { motion, useMotionValue, useSpring } from 'motion/react'
import { CardBody, CardContainer, CardItem } from './components/ui/3d-card'
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation'
import { FlipWords } from './components/ui/flip-words'
import { FloatingNav } from './components/ui/floating-navbar'
import { Meteors } from './components/ui/meteors'
import { Terminal } from './components/ui/terminal'
import { Timeline } from './components/ui/timeline'
import { TypewriterEffectSmooth } from './components/ui/typewriter-effect'
import { useEffect, useRef, useState } from 'react'

const roleWords = [
  'Backend Software Engineer',
  'Distributed Systems Engineer',
  'Systems Software Engineer',
  'Machine Learning Infrastructure Engineer',
  'Platform Engineer',
  'Site Reliability Engineer',
  'Forward Deployed Engineer',
]

const navItems = [
  { name: 'About', link: '#home' },
  { name: 'Projects', link: '#projects' },
  { name: 'Experience', link: '#experience' },
  { name: 'Skills', link: '#skills' },
  { name: 'Contact', link: '#contact' },
]

const projectCards = [
  {
    title: 'Distributed Job Queue',
    repo: 'https://github.com/1mpossible-code/distributed-job-queue',
    blurb: 'Go and Redis queueing infrastructure with reliability primitives built in.',
    command: 'go run cmd/queue --priority --retries --dead-letter',
    outputs: [
      'producer -> broker -> worker pipeline online',
      'priority scheduling, idempotency, retries, and DLQ enabled',
      'built in Go with Redis for horizontal, fault-aware job execution',
    ],
  },
  {
    title: 'Dough',
    repo: 'https://github.com/1mpossible-code/dough',
    blurb: 'AI-powered finance product focused on live data, forecasting, and usable insight.',
    command: 'pnpm dev --finance --forecast --ai-insights',
    outputs: [
      'real-time bank transaction sync initialized',
      'categorization, forecasting, and Anthropic-powered analysis active',
      'Next.js + TypeScript product focused on simple personal finance UX',
    ],
  },
  {
    title: 'TeleStore',
    repo: 'https://github.com/1mpossible-code/TeleStore',
    blurb: 'Secure file storage layered on top of the Telegram Bot API as a lightweight backend.',
    command: 'docker compose up telestore --encrypted',
    outputs: [
      'Telegram Bot API mounted as lightweight cloud storage backend',
      'encrypted file upload, retrieval, and management available',
      'full-stack build with Flask, React, Redux, and Docker',
    ],
  },
]

const skillGroups = [
  {
    title: 'Languages',
    items: ['Go', 'Rust', 'C/C++', 'Python', 'TypeScript', 'SQL'],
  },
  {
    title: 'Systems / Infra',
    items: ['Linux', 'Docker', 'Kubernetes', 'Redis', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'Backend / ML',
    items: ['Flask', 'FastAPI', 'Node.js', 'PyTorch', 'Transformers', 'Anthropic API'],
  },
]

const contactWords = [
  { text: 'GitHub' },
  { text: 'LinkedIn' },
  { text: 'or' },
  { text: 'email.', className: 'text-white/70' },
]

function ContactLink({ href, children, external = false, className = '' }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl px-5 text-sm text-white transition ${className}`}
    >
      <span className="absolute inset-0 rounded-xl border border-white/[0.08] transition group-hover:border-white/[0.18]" />
      <span className="absolute inset-0 rounded-xl bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.14)_50%,transparent_80%)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
      <span className="absolute inset-[1px] rounded-[11px] bg-black/45 transition group-hover:bg-white/[0.05]" />
      <span className="relative z-10 flex items-center gap-2 tracking-[0.01em]">
        {children}
        <ArrowUpRightIcon className="h-3.5 w-3.5 text-white/55 transition group-hover:text-white" />
      </span>
    </a>
  )
}

function EmailContactLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl px-5 text-sm text-white transition ${className}`}
    >
      <span className="absolute inset-0 rounded-xl border border-white/[0.14] transition group-hover:border-white/[0.28]" />
      <span className="absolute inset-0 rounded-xl bg-white/[0.08] transition group-hover:bg-white/[0.12]" />
      <span className="absolute inset-0 rounded-xl bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.12)_50%,transparent_80%)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
      <span className="relative z-10 flex items-center gap-2 tracking-[0.01em]">
        {children}
        <ArrowUpRightIcon className="h-3.5 w-3.5 text-white/60 transition group-hover:text-white" />
      </span>
    </a>
  )
}

function ExperienceEntry({ company, role, period, tags, mark, href }) {
  return (
    <CardContainer className="w-full" containerClassName="justify-start py-0">
      <CardBody className="group/card relative min-h-[16.5rem] w-full rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm dark:hover:shadow-2xl dark:hover:shadow-white/[0.08]">
        <CardItem
          as="a"
          href={href}
          target="_blank"
          rel="noreferrer"
          translateZ={70}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 hover:border-white/25 hover:text-white"
          aria-label={`Open ${company}`}
        >
          <ArrowUpRightIcon className="h-4 w-4" />
        </CardItem>
        <CardItem translateZ={40} className="select-text text-xs uppercase tracking-[0.35em] text-white/40">
          {period}
        </CardItem>
        <CardItem
          as="a"
          href={href}
          target="_blank"
          rel="noreferrer"
          translateZ={180}
          className="mt-3 block max-w-[17rem] select-text text-[1.45rem] font-semibold tracking-[-0.05em] text-white hover:text-white/80"
        >
          {company}
        </CardItem>
        <CardItem translateZ={130} className="mt-2 select-text text-sm text-neutral-300">
          {role}
        </CardItem>
        <CardItem translateZ={90} className="mt-5 inline-flex select-text rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-neutral-300">
          {tags.join(' / ')}
        </CardItem>
        <CardItem
          translateZ={150}
          className="absolute bottom-5 right-5 text-right text-3xl font-semibold tracking-[-0.08em] text-white/12 sm:text-4xl"
        >
          {mark}
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

const experienceItems = [
  {
    title: '2025',
    content: (
      <div className="space-y-2">
        <ExperienceEntry
          company="Google Summer of Code @ VideoLAN"
          role="Open Source Contributor"
          period="Jun 2025 - Aug 2025"
          tags={['open source', 'systems']}
          mark="VLC"
          href="https://gist.github.com/1mpossible-code/91030d44f294b14c0c21cc5adfc3959f"
        />
        <ExperienceEntry
          company="NYU High Speed Research Network"
          role="Undergraduate Research Assistant"
          period="Jan 2025 - May 2025"
          tags={['distributed', 'real-time']}
          mark="HSRN"
          href="https://vip.hsrn.nyu.edu/"
        />
      </div>
    ),
  },
  {
    title: '2024',
    content: (
      <div className="space-y-2">
        <ExperienceEntry
          company="NYU AI4CE Lab"
          role="Undergraduate Research Assistant"
          period="Apr 2024 - Jul 2024"
          tags={['ml systems', 'research']}
          mark="AI4CE"
          href="https://ai4ce.github.io/"
        />
        <ExperienceEntry
          company="Pomu"
          role="Software Engineer"
          period="Aug 2023 - Jul 2024"
          tags={['backend', 'ai product']}
          mark="PM"
          href="https://pomu.io/"
        />
      </div>
    ),
  },
  {
    title: '2023',
    content: (
      <ExperienceEntry
        company="Borderless"
        role="Software Engineering Intern"
        period="Jun 2023 - Aug 2023"
        tags={['data', 'backend']}
        mark="BD"
        href="https://borderless.so/"
      />
    ),
  },
]

function ArrowUpRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

function ArrowUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  )
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

function MobileMenu({ navItems }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-start justify-end px-4 pt-4 md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white shadow-lg shadow-black/20 backdrop-blur-md"
      >
        {open ? <CloseIcon className="h-4.5 w-4.5" /> : <MenuIcon className="h-4.5 w-4.5" />}
      </button>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute inset-0 h-screen bg-black/55 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <motion.div
        initial={false}
        animate={{ x: open ? 0 : 24, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="absolute right-4 top-16 z-[55] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/75 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.05] hover:text-white"
            >
              <span>{item.name}</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5 text-white/40" />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function CursorFollower() {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const scrollTimerRef = useRef(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 760, damping: 34, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 760, damping: 34, mass: 0.2 })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const smallViewport = window.innerWidth < 768
    setEnabled(finePointer && !coarsePointer && !smallViewport)

    if (!finePointer || coarsePointer || smallViewport) {
      return undefined
    }

    const handleMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
    }

    const handleLeave = (event) => {
      if (event.relatedTarget == null) {
        setVisible(false)
      }
    }
    const updateActive = (event) => {
      const interactive = event.target instanceof Element
        ? event.target.closest('a, button, [role="button"], input, textarea, select, summary')
        : null
      setActive(Boolean(interactive))
    }
    const handleMouseDown = (event) => {
      if (event.button !== 0) {
        return
      }

      setPressed(true)
    }
    const handleMouseUp = () => setPressed(false)
    const handleWheel = (event) => {
      setVisible(true)
      setScrollDirection(event.deltaY > 0 ? 'down' : 'up')

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current)
      }

      scrollTimerRef.current = window.setTimeout(() => {
        setScrollDirection(null)
        scrollTimerRef.current = null
      }, 220)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseout', handleLeave)
    window.addEventListener('mouseover', updateActive)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseout', handleLeave)
      window.removeEventListener('mouseover', updateActive)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('wheel', handleWheel)

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = null
      }
    }
  }, [x, y])

  if (!enabled) {
    return null
  }

  const innerCursorAnimation = scrollDirection
    ? {
        scale: 0,
        backgroundColor: 'rgb(255,255,255)',
        boxShadow: '0 0 24px rgba(255,255,255,0.45)',
      }
    : active
      ? {
          scale: [1, 1.35, 1],
          backgroundColor: 'rgb(255,255,255)',
          boxShadow: '0 0 16px rgba(255,255,255,0.28)',
        }
      : {
          scale: 1,
          backgroundColor: 'rgb(255,255,255)',
          boxShadow: '0 0 24px rgba(255,255,255,0.45)',
        }

  const innerCursorTransition = scrollDirection
    ? { duration: 0.12, ease: 'easeOut' }
    : active
      ? { duration: 0.9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
      : { duration: 0.45, ease: 'easeOut' }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-white/12 bg-white/[0.02] backdrop-blur-sm"
        animate={
          scrollDirection
            ? {
                borderColor: 'rgba(255,255,255,0)',
                backgroundColor: 'rgba(255,255,255,0)',
              }
            : {
                borderColor: 'rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(255,255,255,0.02)',
              }
        }
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          scale: pressed ? 1.08 : 1,
          width: 28,
          height: 28,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.45)]"
        animate={innerCursorAnimation}
        transition={innerCursorTransition}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
          scale: pressed ? 1.18 : undefined,
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: scrollDirection && visible ? 1 : 0,
          scale: scrollDirection ? 1 : 0.7,
          rotate: scrollDirection === 'down' ? 180 : 0,
        }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="pointer-events-none fixed left-0 top-0 z-[102] text-white"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <ArrowUpIcon className="h-4 w-4" />
      </motion.div>
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CursorFollower />
      <FloatingNav forceVisible navItems={navItems} />
      <MobileMenu navItems={navItems} />

      <main id="home" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

        <section className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 lg:px-10 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-10 flex justify-center sm:mb-12 lg:mb-14"
          >
            <div className="relative flex w-full max-w-6xl items-center justify-center px-2 py-4 sm:px-8 sm:py-10 lg:px-12">
              <h1 className="hero-signature relative z-10 text-center text-[2.9rem] font-normal leading-[0.94] text-white sm:text-[5.4rem] lg:text-[6.7rem]">
                <span className="hero-signature-underline relative inline-block">Maksym Yemelianenko</span>
              </h1>
            </div>
          </motion.div>

          <div className="grid items-start gap-10 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative z-10 text-center lg:text-left"
            >
              <h2 className="mx-auto max-w-4xl text-[2.3rem] font-medium leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl">
                <span className="block text-white/80">
                  <FlipWords words={roleWords} className="px-0 text-white" duration={2600} />
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-200 sm:text-base sm:leading-8 md:text-lg lg:mx-0 lg:max-w-2xl">
                Focused on distributed systems, low-level software, and production-minded AI engineering, building high-performance and reliable systems across open source, research labs, startups, and infrastructure-heavy work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10"
            >
              <div className="overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/[0.08] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:rounded-[2rem] sm:p-4">
                <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-3 text-[10px] uppercase tracking-[0.24em] text-neutral-300 sm:mb-4 sm:pb-4 sm:text-xs sm:tracking-[0.3em]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  </div>
                  <span>identity.ascii</span>
                </div>

                <div className="rounded-[1.2rem] border border-white/10 bg-black/30 p-4 sm:rounded-[1.5rem] sm:p-6">
                  <pre className="overflow-x-auto font-mono text-[8px] leading-[1.15] text-neutral-200 sm:text-xs sm:leading-5">
{`███╗   ███╗ █████╗ ██╗  ██╗███████╗██╗   ██╗███╗   ███╗
████╗ ████║██╔══██╗██║ ██╔╝██╔════╝╚██╗ ██╔╝████╗ ████║
██╔████╔██║███████║█████╔╝ ███████╗ ╚████╔╝ ██╔████╔██║
██║╚██╔╝██║██╔══██║██╔═██╗ ╚════██║  ╚██╔╝  ██║╚██╔╝██║
██║ ╚═╝ ██║██║  ██║██║  ██╗███████║   ██║   ██║ ╚═╝ ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝     ╚═╝`}
                  </pre>
                  <div className="mt-4 space-y-2 border-t border-white/10 pt-4 font-mono text-xs text-neutral-300 sm:mt-6 sm:space-y-3 sm:pt-5 sm:text-sm">
                    <p>
                      <span className="text-white/40">$</span> quote
                    </p>
                    <p className="text-white/80 leading-6 sm:leading-7">
                      A man is not defined by what he endures,
                      <br />
                      but by what he refuses to become.
                    </p>
                    <p>
                      <span className="text-white/40">$</span> author
                    </p>
                    <p className="text-white/80">Friedrich Nietzsche, 1844-1900</p>
                    <p>
                      <span className="text-white/40">$</span> note
                    </p>
                    <p className="text-white/80">philosophy, self-overcoming, character under pressure</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="h-px" />
        <section id="projects" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-transparent px-6 py-10 sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute inset-0">
              <Meteors number={18} />
            </div>

            <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-white/45">Projects</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
              Systems-heavy projects shown in terminal form.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
              Three selected builds across distributed infrastructure, AI product engineering, and secure storage.
            </p>
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-3">
              {projectCards.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="space-y-4"
                >
                  <div className="flex min-h-[8.5rem] items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">{project.title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">{project.blurb}</p>
                    </div>
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title} repository`}
                      className="relative z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:border-white/30 hover:bg-white/15 hover:text-white"
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </a>
                  </div>

                  <Terminal
                    username="maksym"
                    commands={[project.command]}
                    outputs={{ 0: project.outputs }}
                    typingSpeed={26}
                    delayBetweenCommands={600}
                    initialDelay={250}
                    className="max-w-none px-0"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section id="experience" className="mx-auto w-full max-w-7xl px-0 py-10 lg:py-16">
          <Timeline
            title="Built around systems, infra, and work that has to hold up under load."
            data={experienceItems}
          />
        </section>
        <section id="skills" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <BackgroundGradientAnimation
            interactive
            containerClassName="rounded-[2rem] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-40 before:bg-gradient-to-b before:from-[#020202] before:via-[#020202]/80 before:to-transparent after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-40 after:bg-gradient-to-t after:from-[#020202] after:via-[#020202]/80 after:to-transparent"
            className="relative z-10"
            gradientBackgroundStart="rgb(2, 2, 2)"
            gradientBackgroundEnd="rgb(6, 6, 7)"
            firstColor="150, 150, 155"
            secondColor="90, 90, 96"
            thirdColor="58, 58, 64"
            fourthColor="36, 36, 40"
            fifthColor="120, 120, 126"
            pointerColor="180, 180, 188"
            size="82%"
            blendingValue="soft-light"
          >
            <div className="relative z-10 px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
              <div className="mb-12 max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-white/45">Skills</p>
                <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
                  Tooling for backend depth, systems work, and production reality.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
                  Most of the stack here supports the same pattern: build reliable software, keep it fast, and make it hold up outside toy environments.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {skillGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-[1.5rem] border border-white/[0.06] bg-black/18 p-5 backdrop-blur-xl"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">{group.title}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BackgroundGradientAnimation>
        </section>
        <section id="contact" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="rounded-[2rem] bg-white/[0.015] px-6 py-12 sm:px-8 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex max-w-4xl flex-col"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-white/45">Contact</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-medium tracking-[-0.05em] text-white md:text-6xl">
                Reach out if the work is worth shipping.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
                Best way in is through direct links. I am most interested in backend, distributed systems, platform, and ML infrastructure work.
              </p>
            </motion.div>

            <div className="mt-8 flex flex-col items-start">
              <TypewriterEffectSmooth
                words={contactWords}
                className="justify-start"
                cursorClassName="bg-white"
              />

              <div className="mt-4 flex flex-col items-start gap-3 md:flex-row md:flex-wrap">
                <ContactLink href="https://github.com/1mpossible-code" external className="w-44">
                  GitHub
                </ContactLink>
                <ContactLink href="https://www.linkedin.com/in/maksym-yemelianenko/" external className="w-44">
                  LinkedIn
                </ContactLink>
                <EmailContactLink href="mailto:max.yemelianenko@gmail.com" className="w-72 px-6">
                  max.yemelianenko@gmail.com
                </EmailContactLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
