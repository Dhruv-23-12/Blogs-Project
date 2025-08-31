import React from 'react'
import { Container, PostForm } from '../components'

function AddPost() {
  return (
    <div className='py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50 min-h-screen'>
        <Container>
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-2">Create New Post</h1>
                <p className="text-neutral-600">Share your thoughts and stories with the world</p>
            </div>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost