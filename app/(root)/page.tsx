'use client'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import {  BookUserIcon, Settings2, ShoppingCart, UserRoundCheck, UserSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  const lists = [
    {icon:<BookUserIcon className='w-full h-full'/>,label:'List of course', link:'/courses'},
    {icon:<UserRoundCheck className='w-full h-full'/>,label:'My Profile', link:'/profile'},
    {icon:<ShoppingCart className='w-full h-full'/>,label:'Buy manual', link:'/shop'},
    {icon:<UserSquare className='w-full h-full'/>,label:'About Hemmyevo', link:'/about'},
  ]
  const me = useQuery(api.user.getMe)
  return (
    <div className=" h-full flex flex-col p-3 w-full">
      <div className='flex justify-between items-center flex-col sm:flex-row'>
        <p>Welcome back, {me?.name}</p>
        <p>Matric No: {me?.username.slice(3)}</p>
      </div>
    <div className='bg-[#996c4796] mt-5 rounded-lg'>
    <main className='grid md:grid-cols-2 rounded-md p-2 glass-effect dark:dark-glass-effect gap-2 mx-auto sm:grid-cols-1 lg:grid-cols-3 '>
      {lists.map((list, i) => (
        <Link href={list.link} key={i}>
         <div className="timetable flex items-center justify-center flex-col gap-4 cursor-pointer w-full h-40 glass-effect dark:dark-glass-effect">
         <p className='w-11 h-11'>{list.icon}</p>
         <p>{list.label}</p>
       </div>
        </Link>
      ))}
        
      </main>
    </div>
 
    </div>
  )
}

export default page