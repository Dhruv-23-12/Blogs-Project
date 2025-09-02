import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, Logo } from "./index"
import { useForm } from "react-hook-form"
import authService from "../firebase/auth"

function ResetPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [oobCode, setOobCode] = useState("")

    useEffect(() => {
        const code = searchParams.get('oobCode')
        const mode = searchParams.get('mode')
        const apiKey = searchParams.get('apiKey')
        const continueUrl = searchParams.get('continueUrl')
        
        console.log("🔍 ResetPassword - URL search params:", Object.fromEntries(searchParams.entries()))
        console.log("🔍 ResetPassword - oobCode:", code)
        console.log("🔍 ResetPassword - mode:", mode)
        console.log("🔍 ResetPassword - apiKey:", apiKey)
        console.log("🔍 ResetPassword - continueUrl:", continueUrl)
        
        if (code && mode === 'resetPassword') {
            setOobCode(code)
            setError("") // Clear any previous errors
        } else if (code) {
            // Handle case where oobCode exists but mode is missing
            setOobCode(code)
            setError("") // Clear any previous errors
        } else {
            setError("Invalid or missing reset code. Please request a new password reset.")
        }
    }, [searchParams])

    const onSubmit = async (data) => {
        if (!oobCode) {
            setError("Invalid reset code")
            return
        }

        setError("")
        setLoading(true)
        try {
            await authService.confirmPasswordReset(oobCode, data.password)
            setSuccess(true)
        } catch (error) {
            setError(error.message)
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
                            Password reset successful!
                        </h2>
                        <p className='mt-2 text-sm text-neutral-600'>
                            Your password has been updated
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
                                    All set!
                                </h3>
                                <p className='text-sm text-neutral-600'>
                                    Your password has been successfully updated. You can now sign in with your new password.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="block w-full"
                            >
                                <Button
                                    type="button"
                                    className="w-full"
                                    size="lg"
                                >
                                    Sign in to your account
                                </Button>
                            </Link>
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
                        Create new password
                    </h2>
                    <p className='mt-2 text-sm text-neutral-600'>
                        Enter your new password below
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
                            label="New password"
                            type="password"
                            placeholder="Enter your new password"
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        <Input
                            label="Confirm new password"
                            type="password"
                            placeholder="Confirm your new password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value, { password }) => 
                                    value === password || "Passwords do not match"
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={loading || !oobCode}
                        >
                            {loading ? "Updating..." : "Update password"}
                        </Button>
                    </form>
                    
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-neutral-600'>
                            Remember your password?{' '}
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

export default ResetPassword
