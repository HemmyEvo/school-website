
import { FacebookIcon, Github, InstagramIcon, Twitter } from 'lucide-react'

import React from 'react'

const Footer = async () => {
  const icon = [
    {
        path:'',
        icon:<FacebookIcon />
    },
    {
        path:'',
        icon:<Twitter />
    },
    {
        path:'',
        icon: <InstagramIcon />
    },
    {
        path:'',
        icon: <Github />
    },
 
]
  
  return (
    <>
    <div className="py-20">
    <div className="absolute bottom-0 left-0 right-0 glass-effect dark:dark-glass-effect ">
        <div className="mx-auto w-full   p-1">
       
          <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 " />
          <div className="md:flex space-y-6 md:space-y-0 justify-center md:px-10 items-center w-full  md:items-center md:justify-between">
              <p className="text-sm text-gray-500 text-center  dark:text-gray-400">© 2024 <a href="https://Hemmyevo.vercel.app" className="hover:underline">HemmyEvo™</a>. All Rights Reserved.
              </p>
    
              <div className="flex mt-4 justify-center space-x-5 sm:mt-0">
                {icon.map((list,i) =>  <a key={i} href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ">
                   {list.icon}
                  </a> )}
                  
              </div>
          </div>
        </div>
    </div>
    
    </div>
    </>
  )
}

export default Footer