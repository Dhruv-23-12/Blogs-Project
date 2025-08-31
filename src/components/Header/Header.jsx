import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "Dashboard",
      slug: "/dashboard",
      active: authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
    <header className='sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-neutral-200/50 shadow-soft'>
      <Container>
        <nav className='flex items-center justify-between py-4'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='group'>
              <Logo width='70px' className='transition-transform duration-300 group-hover:scale-105' />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <ul className='hidden md:flex items-center space-x-2'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-block px-4 lg:px-6 py-2 lg:py-3 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl shadow-soft transition-all duration-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 hover:shadow-medium active:scale-95'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li className='ml-2'>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors duration-300'
            aria-label="Toggle mobile menu"
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {isMobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur-md'>
            <div className='py-4 space-y-2'>
              {navItems.map((item) => 
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug)
                    setIsMobileMenuOpen(false)
                  }}
                  className='block w-full text-left px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-300 rounded-lg'
                >
                  {item.name}
                </button>
              ) : null
              )}
              {authStatus && (
                <div className='px-4 py-2'>
                  <LogoutBtn />
                </div>
              )}
            </div>
          </div>
        )}
        </Container>
    </header>
  )
}

export default Header