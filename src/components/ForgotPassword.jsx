import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Logo } from "./index"
import { useForm } from "react-hook-form"
import authService from "../firebase/auth"

function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setError("")
        setLoading(true)
        try {
            console.log("🔍 Attempting to send password reset email to:", data.email)
            console.log("🔍 Auth service:", authService)
            
            const result = await authService.sendPasswordResetEmail(data.email)
            console.log("✅ Password reset email result:", result)
            setSuccess(true)
        } catch (error) {
            console.error("❌ Password reset error:", error)
            console.error("❌ Error code:", error.code)
            console.error("❌ Error message:", error.message)
            
            // Provide more user-friendly error messages
            let errorMessage = error.message
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email address."
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address."
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many requests. Please try again later."
            }
            
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50'>
                <div className='max-w-md w-full space-y-8'>
                    <div className='text-center'>
                        <div className='mx-auto h-20 w-20 mb-6'>
                            <Logo width="100%" />
                        </div>
                        <h2 className='text-3xl font-bold text-neutral-800'>
                            Check your email
                        </h2>
                        <p className='mt-2 text-sm text-neutral-600'>
                            We've sent you a password reset link
                        </p>
                    </div>
                    
                    <div className='bg-white rounded-2xl p-8 shadow-large border border-neutral-100'>
                        <div className='text-center space-y-6'>
                            <div className='w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center'>
                                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                </svg>
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-neutral-800 mb-2'>
                                    Email sent successfully!
                                </h3>
                                <p className='text-sm text-neutral-600'>
                                    Please check your email inbox and click the reset link to create a new password.
                                </p>
                                <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                                    <p className='text-xs text-blue-700'>
                                        <strong>💡 Tip:</strong> If you don't see the email, please check your spam/junk folder. 
                                        Add our emails to your contacts to prevent future emails from going to spam.
                                    </p>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <Link
                                    to="/login"
                                    className="block w-full"
                                >
                                    <Button
                                        type="button"
                                        className="w-full"
                                        size="lg"
                                    >
                                        Back to Login
                                    </Button>
                                </Link>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-300"
                                >
                                    Try a different email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <div className='mx-auto h-20 w-20 mb-6'>
                        <Logo width="100%" />
                    </div>
                    <h2 className='text-3xl font-bold text-neutral-800'>
                        Forgot your password?
                    </h2>
                    <p className='mt-2 text-sm text-neutral-600'>
                        No worries, we'll send you reset instructions
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
                    
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send reset link"}
                        </Button>
                    </form>
                    
                    <div className='mt-6 text-center space-y-3'>
                        <p className='text-sm text-neutral-600'>
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300"
                            >
                                Sign in here
                            </Link>
                        </p>
                        <p className='text-sm text-neutral-600'>
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-300"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
