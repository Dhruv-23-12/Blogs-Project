import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import firebaseService from "../../firebase/service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.tiitle || "",
            slug: post?.slug || "",
            content: post?.Content || "",
            status: post?.Status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            if (post) {
                const file = data.image[0] ? await firebaseService.uploadFile(data.image[0]) : null;

                if (file) {
                    firebaseService.deleteFile(post.FeatureImage);
                }

                const dbPost = await firebaseService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Ensure we have all required data
                if (!data.title || !data.slug || !data.content || !userData?.$id) {
                    console.error("Missing required data:", { title: data.title, slug: data.slug, content: data.content, userId: userData?.$id });
                    alert("Please fill in all required fields (title, slug, and content)");
                    return;
                }

                // Ensure slug is not empty after transformation
                let transformedSlug = slugTransform(data.slug);
                if (!transformedSlug) {
                    alert("Please provide a valid slug for your post.");
                    return;
                }

                console.log("Original slug:", data.slug);
                console.log("Transformed slug:", transformedSlug);

                // Test Firebase configuration first
                console.log("Testing Firebase configuration...");
                await firebaseService.testCollectionConfig();
                
                // Test document creation
                console.log("Testing document creation...");
                await firebaseService.testDocumentCreation();

                // Check if slug already exists (for SEO purposes)
                const slugExists = await firebaseService.checkSlugExists(transformedSlug);
                console.log("Slug exists check result:", slugExists);
                if (slugExists) {
                    // Try to make the slug unique by adding a timestamp
                    const uniqueSlug = `${transformedSlug}-${Date.now()}`;
                    console.log("Slug exists, using unique slug:", uniqueSlug);
                    transformedSlug = uniqueSlug;
                }

                const file = await firebaseService.uploadFile(data.image[0]);

                if (file) {
                    // File is now converted to base64 and stored in Firestore
                    const imageData = file.$url || file;
                    
                    // Debug: Check userData and userId
                    console.log("Debug - userData:", userData);
                    console.log("Debug - userData.$id:", userData?.$id);
                    console.log("Debug - Image size:", file.size, "bytes");
                    
                    // Warn about large images (base64 increases size by ~33%)
                    if (file.size > 5 * 1024 * 1024) { // 5MB
                        alert("Warning: Large image detected. For better performance, consider using images under 5MB.");
                    }
                    
                    if (!userData?.$id) {
                        alert("User not authenticated. Please login again.");
                        return;
                    }
                    
                    const postData = {
                        title: data.title.trim(),
                        slug: transformedSlug,
                        content: data.content,
                        featuredImage: imageData,
                        status: data.status || "active",
                        userId: userData.$id
                    };

                    console.log("Submitting post data:", postData);
                    const dbPost = await firebaseService.createPost(postData);

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    alert("Failed to upload image. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            
            // Provide more specific error messages
            if (error.message && error.message.includes("ID already exists")) {
                alert("There was a temporary issue creating your post. Please try again.");
            } else if (error.message && error.message.includes("permission")) {
                alert("You don't have permission to create posts. Please check your authentication.");
            } else if (error.message && error.message.includes("network")) {
                alert("Network error. Please check your internet connection and try again.");
            } else {
                alert("Failed to create post. Please check the console for details.");
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters except hyphens
                .replace(/\s+/g, "-") // Replace spaces with hyphens
                .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
                .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="w-full max-w-6xl mx-auto">
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
                {/* Main Content Section */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-soft border border-neutral-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6">Post Content</h2>
                    
                    <div className="space-y-4">
                        <Input
                            label="Title :"
                            placeholder="Enter your post title"
                            className="mb-4"
                            {...register("title", { required: true })}
                        />
                        <Input
                            label="Slug :"
                            placeholder="Post URL slug"
                            className="mb-4"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Content is limited to 255 characters due to database constraints. Longer content will be automatically truncated.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-soft border border-neutral-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6">Post Settings</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <Input
                                label="Featured Image :"
                                type="file"
                                className="mb-4"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", { required: !post })}
                            />
                            {post && (
                                <div className="w-full mb-4">
                                    <img
                                        src={firebaseService.getFilePreview(post.FeatureImage)}
                                        alt={post.tiitle}
                                        className="rounded-lg w-full h-48 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <Select
                                options={["active", "inactive"]}
                                label="Status"
                                className="mb-4"
                                {...register("status", { required: true })}
                            />
                        </div>
                        
                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                bgColor={post ? "bg-green-500" : undefined} 
                                className="w-full py-3 text-base font-medium"
                            >
                                {post ? "Update Post" : "Create Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
