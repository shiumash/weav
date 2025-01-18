'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ActiveLinkProps {
  href: string
  children: React.ReactNode
}

const ActiveLink = ({ href, children }: ActiveLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className={`block p-3 ${isActive ? 'bg-emerald-300' : 'hover:bg-emerald-300'}`}>
      {children}
    </Link>
  )
}

export default ActiveLink

