import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    error,
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full space-y-2'>
            {label && <label 
            className='block text-sm font-medium text-neutral-700' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`w-full px-4 py-3 text-neutral-900 bg-white border border-neutral-200 rounded-xl shadow-soft transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:shadow-medium hover:border-neutral-300 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
            {error && (
                <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
})

export default Input