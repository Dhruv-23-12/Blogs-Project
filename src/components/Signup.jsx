import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50'>
        <div className='max-w-md w-full space-y-8'>
            <div className='text-center'>
                <div className='mx-auto h-20 w-20 mb-6'>
                    <Logo width="100%" />
                </div>
                <h2 className='text-3xl font-bold text-neutral-800'>
                    Create your account
                </h2>
                <p className='mt-2 text-sm text-neutral-600'>
                    Join our community and start sharing your stories
                </p>
            </div>
            
            <div className='bg-white rounded-2xl p-8 shadow-large border border-neutral-100'>
                {error && (
                    <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-xl'>
                        <p className='text-sm text-red-600 flex items-center'>
                            <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(create)} className='space-y-6'>
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.name?.message}
                        {...register("name", {
                            required: "Full name is required",
                        })}
                    />
                    <Input
                        label="Email address"
                        placeholder="Enter your email"
                        type="email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Please enter a valid email address"
                            }
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                    />
                    <Button 
                        type="submit" 
                        className="w-full"
                        size="lg"
                    >
                        Create Account
                    </Button>
                </form>
                
                <div className='mt-6 text-center'>
                    <p className='text-sm text-neutral-600'>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Signup