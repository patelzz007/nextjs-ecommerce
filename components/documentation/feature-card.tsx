import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, href, icon: Icon }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-emerald-900/50 bg-gradient-to-br from-emerald-950/50 to-zinc-950/50 p-6 transition-all hover:border-emerald-700/50 hover:shadow-lg hover:shadow-emerald-500/10"
    >
      <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3">
        <Icon className="h-8 w-8 text-emerald-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-zinc-400 group-hover:text-zinc-300">{description}</p>
    </Link>
  )
}
