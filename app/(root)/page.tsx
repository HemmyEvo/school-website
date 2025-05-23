'use client'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { BookUserIcon, ShoppingCart, User2, UserPlus2, UserRoundCheck, UserSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  const menuItems = [
    { icon: <BookUserIcon className="w-8 h-8" />, label: 'Course Materials', link: '/courses', color: 'bg-purple-500/20' },
    { icon: <UserPlus2 className="w-8 h-8" />, label: 'Classmates', link: '/classmate', color: 'bg-blue-500/20' },
    { icon: <UserRoundCheck className="w-8 h-8" />, label: 'My Profile', link: '/profile', color: 'bg-emerald-500/20' },
    { icon: <ShoppingCart className="w-8 h-8" />, label: 'Study Resources', link: '/shop', color: 'bg-amber-500/20' },
    { icon: <UserSquare className="w-8 h-8" />, label: 'About Portal', link: '/about', color: 'bg-rose-500/20' },
  ]

  const me = useQuery(api.user.getMe)
  const fetchedAnnouncements = useQuery(api.getting.getAnnouncements) || [];
  return (
    <div className="min-h-screen  w-full p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back, <span className="text-primary">{me?.name}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {me?.email} • Matric: {me?.username?.slice(3) || 'N/A'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-sm">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Active • Student Portal
          </span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index}>
            <div className={`group relative overflow-hidden rounded-xl p-6  border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300  hover:scale-[1.02] ${item.color}`}>
              <div className="absolute inset-0 bg-white/10 dark:bg-black/10 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to access
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-primary/50 transition-all"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Courses</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">4</p>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-full bg-blue-500 rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Assignments</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">2</p>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-full bg-amber-500 rounded-full w-1/2"></div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-5 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Class Announcements</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{fetchedAnnouncements.length}</p>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-full bg-purple-500 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page