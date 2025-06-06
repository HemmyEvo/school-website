import { Card } from '@/components/ui/card'
import React from 'react'
import Header from '../_component/Header'
import Footer from '@/components/shared/Footer'
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import Loading from '@/components/shared/Loading'
type Props = React.PropsWithChildren<{}>

const layout = ({children}: Props) => {
  return (
    <>
     <ClerkLoading>
        <Loading />
    </ClerkLoading>
    <ClerkLoaded>
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-grow mb-auto">
    
      {children}
   
  </main>
  <Footer />
</div>
    </ClerkLoaded>
    </>
  )
}

export default layout