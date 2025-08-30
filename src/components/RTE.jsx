import React from 'react'
import {Controller } from 'react-hook-form';

export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange, value}}) => (
        <textarea
        value={value || defaultValue}
        onChange={onChange}
        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        placeholder="Write your content here..."
        />
    )}
    />
     </div>
  )
}

