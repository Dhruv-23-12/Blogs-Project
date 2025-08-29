import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
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

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    // Function to get image with fallback
    const getImageWithFallback = async (featureImage) => {
        if (!featureImage) return null;
        
        try {
            // First try preview URL
            const previewUrl = appwriteService.getFilePreview(featureImage);
            console.log('Post - Trying preview URL:', previewUrl);
            
            // Test if preview URL works
            const testResult = await appwriteService.testImageAccess(featureImage);
            
            if (testResult === true) {
                console.log('Post - Preview URL works');
                return previewUrl;
            } else if (testResult === 'public') {
                console.log('Post - Using public URL as fallback');
                return appwriteService.getPublicFileUrl(featureImage);
            } else {
                console.log('Post - Both URLs failed, showing placeholder');
                return null;
            }
        } catch (error) {
            console.error('Post - Error getting image:', error);
            return null;
        }
    };

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
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
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.FeatureImage);
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
                                        Check Appwrite settings
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
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
                    {parse(post.Content)}
                </div>
            </Container>
        </div>
    ) : null;
}
