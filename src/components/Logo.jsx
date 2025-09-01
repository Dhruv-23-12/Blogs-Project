import React from 'react'
import logoImage from '../assets/logo.png'

function Logo({width = '100px', className = ''}) {
  return (
    <img 
      src={logoImage} 
      alt="DHRUVBlogs Logo" 
      width={width}
      className={`h-auto ${className}`}
    />
  )
}

export default Logo