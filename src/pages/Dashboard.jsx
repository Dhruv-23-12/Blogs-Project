import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'
import { useSelector } from 'react-redux'

function Dashboard() {
    const [userPosts, setUserPosts] = useState([])
    const [userStats, setUserStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        recentPosts: []
    })
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (authStatus) {
            fetchUserData()
        }
    }, [authStatus])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            // Get all posts and filter by current user
            const posts = await appwriteService.getPosts([])
            if (posts && posts.documents) {
                const currentUserPosts = posts.documents.filter(post => post.UserId === userData?.$id)
                setUserPosts(currentUserPosts)
                
                // Calculate user statistics
                const stats = {
                    totalPosts: currentUserPosts.length,
                    publishedPosts: currentUserPosts.filter(post => post.Status === 'active').length,
                    draftPosts: currentUserPosts.filter(post => post.Status === 'draft').length,
                    totalViews: currentUserPosts.reduce((sum, post) => sum + (post.views || 0), 0),
                    recentPosts: currentUserPosts.slice(0, 3) // Get 3 most recent posts
                }
                setUserStats(stats)
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!authStatus) {
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-800 mb-4">Access Denied</h1>
                        <p className="text-neutral-600 mb-6">You need to be logged in to access your dashboard.</p>
                        <Link 
                            to="/login" 
                            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-300"
                        >
                            Login Now
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-neutral-600">Loading dashboard...</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8 sm:py-16 bg-gradient-to-br from-white to-primary-50">
            <Container>
                {/* Dashboard Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">Your Dashboard</h1>
                    <p className="text-sm sm:text-base text-neutral-600">Welcome back! Here's an overview of your blog activity.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft border border-neutral-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="text-center sm:text-left">
                                <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Total Posts</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600">{userStats.totalPosts}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft border border-neutral-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="text-center sm:text-left">
                                <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Published</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{userStats.publishedPosts}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft border border-neutral-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="text-center sm:text-left">
                                <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Drafts</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{userStats.draftPosts}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-soft border border-neutral-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <div className="text-center sm:text-left">
                                <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">Total Views</p>
                                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{userStats.totalViews}</p>
                            </div>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-100 mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">Quick Actions</h2>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Link 
                            to="/add-post" 
                            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-300 shadow-soft hover:shadow-medium"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm sm:text-base">Create New Post</span>
                        </Link>
                        <Link 
                            to="/all-posts" 
                            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-white text-primary-600 border border-primary-200 rounded-xl font-medium hover:bg-primary-50 transition-colors duration-300"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm sm:text-base">View All Posts</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Your Recent Posts</h2>
                        <Link 
                            to="/all-posts" 
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base"
                        >
                            View All →
                        </Link>
                    </div>
                    
                    {userStats.recentPosts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-neutral-100">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No posts yet</h3>
                            <p className="text-neutral-500 mb-4">Start your blogging journey by creating your first post!</p>
                            <Link 
                                to="/add-post" 
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-300"
                            >
                                Create Your First Post
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {userStats.recentPosts.map((post) => (
                                <div key={post.$id} className="animate-fade-in">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All User Posts */}
                {userPosts.length > 3 && (
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">All Your Posts</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {userPosts.map((post) => (
                                <div key={post.$id} className="animate-fade-in">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Dashboard
