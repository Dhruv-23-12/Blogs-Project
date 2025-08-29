import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

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
          <div className='flex items-center'>
            <Link to='/' className='group'>
              <Logo width='70px' className='transition-transform duration-300 group-hover:scale-105' />
            </Link>
          </div>
          
          <ul className='flex items-center space-x-2'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-block px-6 py-3 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 rounded-xl shadow-soft transition-all duration-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 hover:shadow-medium active:scale-95'
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
        </nav>
        </Container>
    </header>
  )
}

export default Header