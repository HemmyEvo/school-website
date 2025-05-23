import { FacebookIcon, Github, InstagramIcon, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      path: 'https://www.facebook.com/profile.php?id=100084631813516',
      icon: <FacebookIcon size={18} />
    },
    {
      name: 'Twitter',
      path: 'https://x.com/Hemmyevo?t=mMX6xoH_0SJs6pL8bLYblQ&s=09',
      icon: <Twitter size={18} />
    },
    {
      name: 'Instagram',
      path: 'https://www.instagram.com/hemmy_evo?igsh=M2Q1eTNra2x4c3o4',
      icon: <InstagramIcon size={18} />
    },
    {
      name: 'LinkedIn',
      path: 'https://www.linkedin.com/in/atilola-emmanuel-99964b324?utm_source=sare&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      icon: <Linkedin size={18} />
    },
  ]

  return (
    <footer className="relative mt-20 w-full">
      {/* Darkened overlay for better text contrast */}
      <div className="bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright section with brighter text */}
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-white/90">
                © {new Date().getFullYear()}{' '}
                <Link 
                  href="https://Hemmyevo.vercel.app" 
                  className="font-medium text-white hover:text-amber-200 transition-colors"
                >
                  HemmyEvo™
                </Link>. All Rights Reserved.
              </p>
            </div>

            {/* Social links with better contrast */}
            <div className="flex space-x-6">
              {socialLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-colors p-2 rounded-full"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional text with improved visibility */}
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs text-white/70">
              Designed and built with passion by Atilola Emmanuel
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer