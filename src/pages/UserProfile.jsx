import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'
import { useSelector } from 'react-redux'

function UserProfile() {
    const { userId } = useParams()
    const [userPosts, setUserPosts] = useState([])
    const [userStats, setUserStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0
    })
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userId) {
            fetchUserPosts()
        }
    }, [userId])

    const fetchUserPosts = async () => {
        try {
            setLoading(true)
            // Get all posts and filter by user
            const posts = await appwriteService.getPosts([])
            if (posts && posts.documents) {
                const userSpecificPosts = posts.documents.filter(post => post.UserId === userId)
                setUserPosts(userSpecificPosts)
                
                // Calculate user statistics
                const stats = {
                    totalPosts: userSpecificPosts.length,
                    publishedPosts: userSpecificPosts.filter(post => post.Status === 'active').length,
                    draftPosts: userSpecificPosts.filter(post => post.Status === 'draft').length,
                    totalViews: userSpecificPosts.reduce((sum, post) => sum + (post.views || 0), 0)
                }
                setUserStats(stats)
            }
        } catch (error) {
            console.error('Error fetching user posts:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-neutral-600">Loading profile...</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50">
            <Container>
                {/* User Header */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-soft border border-neutral-100 mb-6 sm:mb-8">
                    {/* User Avatar and Basic Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                        {/* User Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        
                        {/* User Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-2">
                                User Profile
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-600">
                                Member since {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                    
                    {/* User Stats - Full Width on Mobile */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="text-center p-4 sm:p-5 bg-primary-50 rounded-xl border border-primary-100">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 mb-1">{userStats.totalPosts}</div>
                            <div className="text-xs sm:text-sm text-neutral-600 font-medium">Total Posts</div>
                        </div>
                        <div className="text-center p-4 sm:p-5 bg-green-50 rounded-xl border border-green-100">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">{userStats.publishedPosts}</div>
                            <div className="text-xs sm:text-sm text-neutral-600 font-medium">Published</div>
                        </div>
                        <div className="text-center p-4 sm:p-5 bg-yellow-50 rounded-xl border border-yellow-100">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600 mb-1">{userStats.draftPosts}</div>
                            <div className="text-xs sm:text-sm text-neutral-600 font-medium">Drafts</div>
                        </div>
                        <div className="text-center p-4 sm:p-5 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">{userStats.totalViews}</div>
                            <div className="text-xs sm:text-sm text-neutral-600 font-medium">Total Views</div>
                        </div>
                    </div>
                </div>

                {/* User Posts */}
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Posts by this user</h2>
                    
                    {userPosts.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-soft border border-neutral-100">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-2">No posts yet</h3>
                            <p className="text-sm sm:text-base text-neutral-500">This user hasn't published any posts.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {userPosts.map((post) => (
                                <div key={post.$id} className="animate-fade-in">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-300 shadow-soft hover:shadow-medium"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm sm:text-base">Back to Home</span>
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default UserProfile
