import { motion } from 'motion/react'
import { CardBody, CardContainer, CardItem } from './components/ui/3d-card'
import { FlipWords } from './components/ui/flip-words'
import { FloatingNav } from './components/ui/floating-navbar'
import { Terminal } from './components/ui/terminal'
import { Timeline } from './components/ui/timeline'

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
  { name: 'About', link: '#about' },
  { name: 'Projects', link: '#projects' },
  { name: 'Experience', link: '#experience' },
  { name: 'Skills', link: '#skills' },
  { name: 'Contact', link: '#contact' },
]

const projectCards = [
  {
    title: 'Distributed Job Queue System',
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
          className="absolute bottom-5 right-5 select-none text-right text-3xl font-semibold tracking-[-0.08em] text-white/12 sm:text-4xl"
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

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingNav forceVisible navItems={navItems} />

      <main id="home" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

        <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-16 px-6 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h1 className="max-w-4xl text-4xl font-medium leading-tight tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
              Maksym Yemelianenko
              <span className="block text-white/80">
                <FlipWords words={roleWords} className="px-0 text-white" duration={2600} />
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-200 md:text-lg">
              Focused on distributed systems, low-level software, and production-minded AI engineering, building high-performance and reliable systems across open source, research labs, startups, and infrastructure-heavy work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-4 text-xs uppercase tracking-[0.3em] text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/45" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                </div>
                <span>identity.ascii</span>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
                <pre className="overflow-x-auto font-mono text-[10px] leading-4 text-neutral-200 sm:text-xs sm:leading-5">
{`███╗   ███╗ █████╗ ██╗  ██╗███████╗██╗   ██╗███╗   ███╗
████╗ ████║██╔══██╗██║ ██╔╝██╔════╝╚██╗ ██╔╝████╗ ████║
██╔████╔██║███████║█████╔╝ ███████╗ ╚████╔╝ ██╔████╔██║
██║╚██╔╝██║██╔══██║██╔═██╗ ╚════██║  ╚██╔╝  ██║╚██╔╝██║
██║ ╚═╝ ██║██║  ██║██║  ██╗███████║   ██║   ██║ ╚═╝ ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝     ╚═╝`}
                </pre>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5 font-mono text-sm text-neutral-300">
                  <p>
                    <span className="text-white/40">$</span> whoami
                  </p>
                  <p className="text-white/80">maksym</p>
                  <p>
                    <span className="text-white/40">$</span> location
                  </p>
                  <p className="text-white/80">new york</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="about" className="h-px" />
        <section id="projects" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-white/45">Projects</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white md:text-5xl">
              Systems-heavy projects shown in terminal form.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
              Three selected builds across distributed infrastructure, AI product engineering, and secure storage.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-3">
            {projectCards.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium text-white">{project.title}</h3>
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
        </section>
        <section id="experience" className="mx-auto w-full max-w-7xl px-0 py-10 lg:py-16">
          <Timeline
            title="Built around systems, infra, and work that has to hold up under load."
            data={experienceItems}
          />
        </section>
        <section id="skills" className="h-px" />
        <section id="contact" className="h-px" />
      </main>
    </div>
  )
}

export default App
