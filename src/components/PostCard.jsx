import React from 'react'
import firebaseService from "../firebase/service"
import {Link} from 'react-router-dom'

function PostCard({$id, tiitle, FeatureImage, UserId, title, featuredImage, userId, slug}) {
    
  // Handle both old and new data structures
  const postTitle = tiitle || title || "Untitled Post";
  const postImage = FeatureImage || featuredImage || "";
  const postUserId = UserId || userId || "";
  const postSlug = slug || "";
  
  // Function to get image source with fallback
  const getImageSource = () => {
    console.log('PostCard - FeatureImage:', postImage)
    console.log('PostCard - tiitle:', postTitle)
    console.log('PostCard - $id:', $id)
    console.log('PostCard - slug:', postSlug)
    
    if (postImage) {
      // For Firebase Storage, the image is already a URL
      if (postImage.startsWith('http')) {
        return postImage;
      }
      
      // Fallback to Firebase service
      try {
        const imageUrl = firebaseService.getFilePreview(postImage)
        console.log('PostCard - Generated image URL:', imageUrl)
        return imageUrl
      } catch (error) {
        console.error('Error getting image preview:', error)
        return null
      }
    }
    
    // For testing - show a sample image if no FeatureImage
    console.log('PostCard - No FeatureImage, using test image')
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
  }

  // Check if we have a valid image
  const hasImage = getImageSource()
    
  return (
    <Link 
      to={`/post/${postSlug}`} 
      className="group"
      onClick={() => console.log('PostCard clicked - navigating to:', `/post/${postSlug}`)}
    >
      <div className='w-full bg-white rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100 hover:border-primary-200'>
        <div className='w-full mb-4 sm:mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-neutral-200'>
          {hasImage ? (
            <img 
              src={hasImage}
              alt={tiitle || 'Blog post image'}
              className='w-full h-40 sm:h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300' 
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src)
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          
          {/* Fallback placeholder - shown when no image or image fails to load */}
          <div className={`w-full h-40 sm:h-48 flex items-center justify-center rounded-xl ${hasImage ? 'hidden' : 'block'}`}>
            <div className='text-center'>
              <svg className='w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 text-primary-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <p className='text-xs sm:text-sm text-primary-600 font-medium'>No Image</p>
            </div>
          </div>
        </div>
        <h2 className='text-lg sm:text-xl font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors duration-300 leading-tight mb-3'>
          {postTitle}
        </h2>
        <div className='mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-neutral-500'>
          <span className='inline-flex items-center'>
            <svg className='w-4 h-4 mr-2 text-primary-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
            </svg>
            Read more
          </span>
          {postUserId && (
            <Link 
              to={`/user/${postUserId}`} 
              className='inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-300 text-sm'
              onClick={(e) => e.stopPropagation()}
            >
              <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
              <span className='hidden sm:inline'>View Profile</span>
              <span className='sm:hidden'>Profile</span>
            </Link>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PostCard