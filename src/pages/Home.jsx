import React, {useEffect, useState} from 'react'
import firebaseService from "../firebase/service";
import {Container, PostCard} from '../components'

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        firebaseService.getPosts().then((posts) => {
            if (posts) {
                console.log('Home - All posts data:', posts)
                setPosts(posts)
            }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-20">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-neutral-800 mb-4">
                                Welcome to MegaBlog
                            </h1>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Login to discover amazing stories and share your own thoughts with the world.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-100">
                            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                                Ready to get started?
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                Join our community of writers and readers today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-300 shadow-soft hover:shadow-medium">
                                    Sign Up Now
                                </button>
                                <button className="px-8 py-3 bg-white text-primary-600 border border-primary-200 rounded-xl font-medium hover:bg-primary-50 transition-colors duration-300">
                                    Learn More
                                </button>
                                </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    
    return (
        <div className='w-full py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50'>
            <Container>
                <div className='text-center mb-8 sm:mb-16'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-800 mb-4 sm:mb-6'>
                        Latest Stories
                    </h1>
                    <p className='text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed px-4'>
                        Discover the latest insights, stories, and perspectives from our community of writers.
                    </p>
                </div>
                
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
                    {posts.map((post) => {
                        console.log('Home - Rendering post:', post)
                        return (
                            <div key={post.$id} className='animate-fade-in'>
                                <PostCard {...post} />
                            </div>
                        )
                    })}
                </div>
            </Container>
        </div>
    )
}

export default Home