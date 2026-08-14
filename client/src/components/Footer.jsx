import React from 'react'
import { Link } from 'react-router-dom'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <footer className='bg-[#171717] text-white pt-20 pb-10 border-t border-neutral-800/80 relative overflow-hidden selection:bg-[#ffdf20] selection:text-[#111111]'>
      
      {/* Background subtle glowing radial gradient at bottom */}
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-t from-[#ffdf20]/10 via-[#ffdf20]/5 to-transparent blur-3xl pointer-events-none'></div>

      <div className='max-w-7xl mx-auto px-6 lg:px-12 relative z-10'>

        {/* Top 3-Column Navigation Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-20'>
          
          {/* Column 1: Explore */}
          <div className='space-y-4'>
            <span className='font-mono text-xs text-[#ffdf20] uppercase tracking-widest font-semibold block mb-4'>
              // Explore
            </span>
            <ul className='space-y-3 font-medium text-neutral-300 text-sm'>
              <li>
                <Link to="/" className="hover:text-[#ffdf20] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-[#ffdf20] transition-colors">Start AI Interview</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#ffdf20] transition-colors">Interview History</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#ffdf20] transition-colors">Pricing & Credits</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Connect */}
          <div className='space-y-4'>
            <span className='font-mono text-xs text-[#ffdf20] uppercase tracking-widest font-semibold block mb-4'>
              // Connect
            </span>
            <ul className='space-y-3 font-medium text-neutral-300 text-sm'>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#ffdf20] transition-colors">LinkedIn</a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#ffdf20] transition-colors">X / Twitter</a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#ffdf20] transition-colors">YouTube</a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#ffdf20] transition-colors">GitHub</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className='space-y-4'>
            <span className='font-mono text-xs text-[#ffdf20] uppercase tracking-widest font-semibold block mb-4'>
              // Contact
            </span>
            <div className='space-y-4 text-neutral-300 text-sm'>
              <p className='font-semibold text-white'>Reach out</p>
              <div>
                <p className='text-neutral-400'>Global Headquarter</p>
                <p className='text-neutral-200 font-medium'>1004 Innovation Hub, Suite 400</p>
                <p className='text-neutral-200 font-medium'>San Francisco, CA, 94110, United States</p>
              </div>
              <div>
                <p className='text-neutral-400'>Email Support</p>
                <a href="mailto:support@cortex.ai" className='text-[#ffdf20] hover:underline font-mono text-xs'>
                  support@cortex.ai
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Massive Brand Watermark Logo Banner */}
        <div className='relative pt-8 pb-4 flex flex-col md:flex-row items-baseline justify-between border-t border-neutral-800/80'>
          <div className='w-full text-center md:text-left overflow-hidden'>
            <h1 className='text-[16vw] sm:text-[15vw] md:text-[150px] font-black tracking-tighter leading-none text-white opacity-95 select-none font-["Geist",sans-serif] hover:opacity-100 transition-opacity'>
              Cortex<span className='text-[#ffdf20]'>.AI</span>
            </h1>
          </div>
        </div>

        {/* Bottom Policy & Copyright Bar */}
        <div className='pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-neutral-500 gap-4'>
          <div className='flex gap-6'>
            <a href="#privacy" className='hover:text-[#ffdf20] transition-colors'>Privacy Policy</a>
            <a href="#terms" className='hover:text-[#ffdf20] transition-colors'>Terms & Conditions</a>
            <a href="#cookies" className='hover:text-[#ffdf20] transition-colors'>Cookie Settings</a>
          </div>

          <div>
            © {new Date().getFullYear()} Cortex.AI. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
