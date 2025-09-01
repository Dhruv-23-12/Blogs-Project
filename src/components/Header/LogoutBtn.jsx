import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../firebase/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-flex items-center px-6 py-3 text-sm font-medium text-secondary-600 bg-white border border-secondary-200 rounded-xl shadow-soft transition-all duration-300 hover:bg-secondary-50 hover:border-secondary-300 hover:text-secondary-700 hover:shadow-medium active:scale-95'
    onClick={logoutHandler}
    >
        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
        </svg>
        Logout
    </button>
  )
}

export default LogoutBtn