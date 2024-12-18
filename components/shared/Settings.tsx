import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import {  SettingsIcon, LogOutIcon } from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'

type Props = {}

const Settings = (props: Props) => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger className='outline-none'>
    <SettingsIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent>   
        
        <DropdownMenuItem  className="space-x-2 flex cursor-pointer justify-between items-center">
        <SignOutButton>      
         <DropdownMenuItem className=" place-content-end flex items-center">
          <p>Sign out</p>
          <LogOutIcon className="h-4 w-4" />
        </DropdownMenuItem>
        </SignOutButton>
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
  )
}

export default Settings