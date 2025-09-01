import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import firebaseService from "../firebase/service";
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            firebaseService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50 min-h-screen'>
        <Container>
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-2">Edit Post</h1>
                <p className="text-neutral-600">Update your post content and settings</p>
            </div>
            <PostForm post={post} />
        </Container>
    </div>
  ) : (
    <div className='py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50 min-h-screen'>
        <Container>
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading post...</p>
            </div>
        </Container>
    </div>
  )
}

export default EditPost