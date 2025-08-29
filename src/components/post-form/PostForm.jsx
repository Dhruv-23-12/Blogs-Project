import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
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
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.FeatureImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
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
                    alert("Please fill in all required fields");
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    
                    // Debug: Check userData and userId
                    console.log("Debug - userData:", userData);
                    console.log("Debug - userData.$id:", userData?.$id);
                    
                    if (!userData?.$id) {
                        alert("User not authenticated. Please login again.");
                        return;
                    }
                    
                    const postData = {
                        title: data.title.trim(),
                        slug: data.slug.trim(),
                        content: data.content,
                        featuredImage: fileId,
                        status: data.status || "active",
                        userId: userData.$id
                    };

                    console.log("Submitting post data:", postData);
                    const dbPost = await appwriteService.createPost(postData);

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    alert("Failed to upload image. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Failed to create post. Please check the console for details.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

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
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                <div className="text-sm text-neutral-500 mt-2">
                    ⚠️ Note: Content is limited to 255 characters due to database constraints. Longer content will be automatically truncated.
                </div>
            </div>
            <div className="w-1/3 px-2">
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
                            src={appwriteService.getFilePreview(post.FeatureImage)}
                            alt={post.tiitle}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
