"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div  className="wrap h-5 w-5 relative flex justify-center items-center rounded-full glass-effect dark:bg-[black] dark:text-white dark:shadow-[0px_0px_10px_white] shadow-xl" >
          <SunIcon className="w-4 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)] transition-all duration-300 absolute z-10 dark:rotate-[360deg] dark:scale-0" onClick={() => setTheme("light")}/>
          <MoonIcon className="absolute h-[.9rem] w-[.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 " onClick={() => setTheme("dark")}/>
          <span className="sr-only">Toggle theme</span>
        </div>
        
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
