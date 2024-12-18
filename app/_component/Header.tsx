'use client'
import Settings from '@/components/shared/Settings'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { useQuery } from 'convex/react'
import { AlertCircle, Home, Megaphone, MenuIcon, MessageCircle, NotebookPen, NotepadText, SettingsIcon, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const Header = (props: Props) => {
    const [toggle, setToggle] = useState(false)
    const pathname = usePathname()
    
    const me = useQuery(api.user.getMe)
    const Links = [
        {icon:<Home/>, path:'/', label:'Home' },
        {icon:<NotepadText/>, path:'/assignment', label:'Assignments' },
        {icon:<AlertCircle/>, path:'/announcement', label:'Announcements' },
        {icon:<NotebookPen/>, path:'/note', label:'Notes' },
        {icon:<ShoppingBasket/>, path:'/shop', label:'Shops' },
     
    ]
 
  return (
    <div className='w-full h-14 bg-[#996c47] flex relative  px-4 items-center justify-between shadow-2xl rounded-br-2xl rounded-bl-2xl '>
        <div className="logo">
            <div className=" text-xl font-semibold cursor-pointer"><Link href="/"> Class&apos;27 portal</Link></div>
        </div>
        <div className="setting flex items-center justify-center h-7 space-x-4 pr-5">
            <div className="avatar cursor-pointer">
            <Avatar className="w-8 h-8">
                <AvatarImage src={me?.image}  className="object-cover h-8 w-8 rounded-full" />
                <AvatarFallback className="text-sm text-black dark:text-white">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="setting-icon cursor-pointer"><Settings /></div>
            <div className="nav cursor-pointer" onClick={() => setToggle(prev => !prev)}><MenuIcon /></div>
        </div>
        {
      
                <div className={`nav-bar  absolute z-40 overflow-hidden ${toggle ? 'flex' :'hidden'}  space-y-2 grid right-0 top-16`}>
                    {Links.map((link,i) => (
                        <Link 
                        href={link.path} 
                        key={i}
                        onClick={() => setToggle(prev => !prev)} style={{ transitionDelay: `${i * 100}ms` }} className={`flex duration-700 ease-in-out outline-none text-[#312923] hover:scale-75 ${pathname === link.path ? 'scale-95 bg-[#aa5f21]':''}  ${toggle ? 'translate-x-0' : 'translate-x-full'} px-3 py-1 rounded-l-md bg-[#996c47] space-x-3 items-center`}
                        >
                          <li className={`flex duration-700 ease-in-out outline-none text-[#312923] hover:scale-75 ${pathname === link.path ? 'scale-95 bg-[#aa5f21]':''}  ${toggle ? 'translate-x-0' : 'translate-x-full'} px-3 py-1 rounded-l-md bg-[#996c47] space-x-3 items-center`}>
                            <p>{link.icon}</p> 
                            <p>{link.label}</p>
                          </li>
                          </Link>
                    ))}
                </div>
          
        }
    </div>
  )
}

export default Header