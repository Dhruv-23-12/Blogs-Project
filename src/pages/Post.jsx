import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import firebaseService from "../firebase/service";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imageError, setImageError] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? (post.userId === userData.$id || post.UserId === userData.$id) : false;

    // Function to get image with fallback
    const getImageWithFallback = async (featureImage) => {
        if (!featureImage) return null;
        
        try {
            // For base64 images, return directly
            if (featureImage.startsWith('data:')) {
                console.log('Post - Using base64 image data');
                return featureImage;
            }
            
            // For Firebase Storage URLs, return directly
            if (featureImage.startsWith('http')) {
                console.log('Post - Using Firebase Storage URL:', featureImage);
                return featureImage;
            }
            
            // Fallback to Firebase service
            const previewUrl = firebaseService.getFilePreview(featureImage);
            console.log('Post - Using Firebase preview URL:', previewUrl);
            return previewUrl;
            
        } catch (error) {
            console.error('Post - Error getting image:', error);
            return null;
        }
    };

    useEffect(() => {
        if (slug) {
            firebaseService.getPost(slug).then((post) => {
                if (post) {
                    console.log('Post - Received post data:', post);
                    console.log('Post - Content field:', post.Content);
                    console.log('Post - Content type:', typeof post.Content);
                    setPost(post);
                    // Get image with fallback
                    if (post.FeatureImage) {
                        getImageWithFallback(post.FeatureImage).then(url => {
                            setImageUrl(url);
                        });
                    }
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        firebaseService.deletePost(post.$id).then((status) => {
            if (status) {
                firebaseService.deleteFile(post.FeatureImage);
                navigate("/");
            }
        });
    };

    const handleImageError = () => {
        console.error('Post - Image failed to load, showing placeholder');
        setImageError(true);
    };

    return post ? (
        <div className="py-8">
            <Container>
                {/* Back Button */}
                <div className="mb-6">
                    <Link 
                        to="/all-posts" 
                        className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Posts
                    </Link>
                </div>

                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 bg-gradient-to-br from-primary-50 to-accent-50">
                    {imageUrl && !imageError ? (
                        <img
                            src={imageUrl}
                            alt={post.tiitle || 'Blog post image'}
                            className="rounded-xl max-w-full h-auto"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="w-full h-64 flex items-center justify-center rounded-xl">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-primary-600 font-medium">
                                    {imageError ? 'Image failed to load' : 'No Image'}
                                </p>
                                {imageError && (
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Image loading failed
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.slug}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.tiitle}</h1>
                </div>
                <div className="browser-css">
                    {post.Content ? parse(post.Content) : <p>No content available</p>}
                </div>
            </Container>
        </div>
    ) : null;
}
