import { useEffect, useMemo, useRef, useState } from 'react'

const graphNodes = [
  { id: 'systems', label: 'Distributed Systems', x: 50, y: 18, size: 'lg' },
  { id: 'backend', label: 'Backend', x: 27, y: 38, size: 'md' },
  { id: 'infra', label: 'Infrastructure', x: 72, y: 39, size: 'md' },
  { id: 'ml', label: 'ML Infra', x: 50, y: 49, size: 'md' },
  { id: 'networking', label: 'Networking', x: 15, y: 34, size: 'sm' },
  { id: 'databases', label: 'Databases', x: 86, y: 34, size: 'sm' },
  { id: 'go', label: 'Go', x: 18, y: 61, size: 'sm' },
  { id: 'rust', label: 'Rust', x: 36, y: 67, size: 'sm' },
  { id: 'python', label: 'Python', x: 62, y: 65, size: 'sm' },
  { id: 'typescript', label: 'TypeScript', x: 81, y: 59, size: 'sm' },
  { id: 'cpp', label: 'C/C++', x: 28, y: 53, size: 'sm' },
  { id: 'linux', label: 'Linux', x: 72, y: 20, size: 'sm' },
  { id: 'kubernetes', label: 'Kubernetes', x: 22, y: 82, size: 'sm' },
  { id: 'docker', label: 'Docker', x: 42, y: 85, size: 'sm' },
  { id: 'aws', label: 'AWS', x: 63, y: 83, size: 'sm' },
  { id: 'redis', label: 'Redis', x: 82, y: 78, size: 'sm' },
  { id: 'postgres', label: 'PostgreSQL', x: 90, y: 49, size: 'sm' },
  { id: 'flask', label: 'Flask', x: 56, y: 92, size: 'sm' },
  { id: 'fastapi', label: 'FastAPI', x: 68, y: 92, size: 'sm' },
  { id: 'pytorch', label: 'PyTorch', x: 44, y: 60, size: 'sm' },
  { id: 'observability', label: 'Observability', x: 12, y: 74, size: 'sm' },
]

const graphEdges = [
  ['systems', 'backend'],
  ['systems', 'infra'],
  ['systems', 'ml'],
  ['systems', 'networking'],
  ['backend', 'go'],
  ['backend', 'rust'],
  ['backend', 'python'],
  ['backend', 'typescript'],
  ['backend', 'cpp'],
  ['backend', 'databases'],
  ['infra', 'kubernetes'],
  ['infra', 'docker'],
  ['infra', 'aws'],
  ['infra', 'redis'],
  ['infra', 'linux'],
  ['infra', 'observability'],
  ['databases', 'postgres'],
  ['databases', 'redis'],
  ['networking', 'linux'],
  ['networking', 'go'],
  ['ml', 'python'],
  ['ml', 'typescript'],
  ['ml', 'docker'],
  ['ml', 'pytorch'],
  ['python', 'flask'],
  ['python', 'fastapi'],
  ['docker', 'flask'],
  ['docker', 'fastapi'],
]

const sizeClasses = {
  lg: 'px-5 py-3.5 text-base sm:text-lg',
  md: 'px-4 py-3 text-sm sm:text-base',
  sm: 'px-3 py-2 text-xs sm:text-sm',
}

const toneClasses = {
  lg: 'border-white/14 bg-white/[0.09] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_40px_rgba(0,0,0,0.36)]',
  md: 'border-white/[0.1] bg-white/[0.06] font-medium text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_34px_rgba(0,0,0,0.32)]',
  sm: 'border-white/[0.08] bg-black/55 font-normal text-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.32)]',
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function SkillsGraph() {
  const frameRef = useRef(null)
  const [nodeOffsets, setNodeOffsets] = useState(() =>
    Object.fromEntries(graphNodes.map((node) => [node.id, { x: 0, y: 0 }])),
  )
  const [hoveredNode, setHoveredNode] = useState(null)

  const nodeMap = useMemo(() => Object.fromEntries(graphNodes.map((node) => [node.id, node])), [])

  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const nextOffsets = {}

      for (const node of graphNodes) {
        const driftX = Math.sin(now / 2400 + node.x * 0.12) * 3.2
        const driftY = Math.cos(now / 2900 + node.y * 0.16) * 3.2

        nextOffsets[node.id] = {
          x: driftX,
          y: driftY,
        }
      }

      setNodeOffsets(nextOffsets)
      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const highlightedEdges = hoveredNode
    ? graphEdges.filter(([from, to]) => from === hoveredNode || to === hoveredNode).map(([from, to]) => `${from}-${to}`)
    : []

  const highlightedNodes = hoveredNode
    ? Array.from(
        new Set(
          graphEdges
            .filter(([from, to]) => from === hoveredNode || to === hoveredNode)
            .flatMap(([from, to]) => [from, to]),
        ),
      )
    : []

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-transparent px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_76%_34%,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_52%_78%,rgba(255,255,255,0.05),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />

      <div className="relative z-10 h-[32rem] sm:h-[36rem]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {graphEdges.map(([from, to]) => {
            const source = nodeMap[from]
            const target = nodeMap[to]
            const sourceOffset = nodeOffsets[from] || { x: 0, y: 0 }
            const targetOffset = nodeOffsets[to] || { x: 0, y: 0 }
            const edgeId = `${from}-${to}`
            const isHighlighted = highlightedEdges.includes(edgeId)

            return (
              <line
                key={edgeId}
                x1={source.x + sourceOffset.x}
                y1={source.y + sourceOffset.y}
                x2={target.x + targetOffset.x}
                y2={target.y + targetOffset.y}
                stroke={isHighlighted ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.16)'}
                strokeWidth={isHighlighted ? '0.26' : '0.16'}
                opacity={isHighlighted ? '1' : '0.72'}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>

        {graphNodes.map((node) => {
          const offset = nodeOffsets[node.id] || { x: 0, y: 0 }
          const isHighlighted = highlightedNodes.includes(node.id)

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
              style={{
                left: `${node.x + offset.x}%`,
                top: `${node.y + offset.y}%`,
              }}
            >
              <div
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`rounded-full backdrop-blur-xl transition-all duration-300 ${sizeClasses[node.size]} ${toneClasses[node.size]} ${
                  isHighlighted ? 'scale-[1.04] border-white/20 bg-white/[0.12] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_14px_36px_rgba(255,255,255,0.08)]' : ''
                } ${hoveredNode === node.id ? 'scale-[1.06] border-white/26 bg-white/[0.14] text-white' : ''}`}
              >
                {node.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
