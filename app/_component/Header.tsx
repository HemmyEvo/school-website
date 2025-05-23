'use client'

import Settings from '@/components/shared/Settings'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useQuery } from 'convex/react'
import { AlertCircle, Home, MenuIcon, NotebookPen, NotepadText, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const navLinks = [
  { icon: <Home size={18} />, path: '/', label: 'Home' },
  { icon: <NotepadText size={18} />, path: '/assignment', label: 'Assignments' },
  { icon: <AlertCircle size={18} />, path: '/announcement', label: 'Announcements' },
  { icon: <NotebookPen size={18} />, path: '/note', label: 'Notes' },
  { icon: <ShoppingBasket size={18} />, path: '/shop', label: 'Shops' },
]

const Header = () => {
  const [toggle, setToggle] = useState(false)
  const pathname = usePathname()
  const me = useQuery(api.user.getMe)

  const renderNavLink = (link: (typeof navLinks)[0]) => (
    <Link
      href={link.path}
      key={link.path}
      onClick={() => setToggle(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
        pathname === link.path
          ? 'bg-black/30 text-amber-100 shadow-md'
          : 'text-white hover:bg-black/20 hover:shadow-sm'
      }`}
    >
      {link.icon}
      <span className="text-sm font-medium">{link.label}</span>
    </Link>
  )

  return (
    <header className="relative flex items-center justify-between px-6 h-16 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      <div className="z-10 text-xl font-semibold text-white cursor-pointer">
        <Link href="/">
          Class&apos;<span className="text-amber-200">27</span> Portal
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 z-10">
        {navLinks.map(renderNavLink)}
      </nav>

      {/* Right controls */}
      <div className="z-10 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-8 h-8 relative">
          <Avatar className="w-full h-full">
            {me?.image ? (
              <AvatarImage
                src={me.image}
                alt="profile"
                className="object-cover rounded-full border border-white/30"
              />
            ) : (
              <AvatarFallback>
                <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Settings */}
        <div className="cursor-pointer text-white hover:text-amber-100 transition-colors">
          <Settings />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white hover:text-amber-100 transition-colors"
          onClick={() => setToggle((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 right-0 w-64 z-50 transition-all duration-300 ease-in-out ${
          toggle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="mt-2 mr-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden">
          {navLinks.map(renderNavLink)}
        </div>
      </div>
    </header>
  )
}

export default Header
