import React from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { Navbar } from '../components/Navbar'
import  Projectile2D  from '../components/projectile2D'



export const Home = () => {
  return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

            
            <ThemeToggle />
            <Navbar/>
            {/* Main Content */}
            <main>
                <Projectile2D />
            </main>
        </div>
    )
}


