import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(login({userData}))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        console.log("Auth initialization error:", error)
        // If there's an error, assume user is not authenticated
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50'>
      <div className='w-full flex-1 flex flex-col'>
        <Header />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50'>
      <div className='animate-bounce-gentle'>
        <div className='w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    </div>
  )
}

export default App
