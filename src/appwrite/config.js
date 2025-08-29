import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            // Ensure all required fields are present and properly formatted
            // Note: Using "tiitle", "Content", "FeatureImage", "Status", and "UserId" to match the user's Appwrite collection schema
            // Temporarily removing "slug" field as it's causing "Unknown attribute" error
            
            // Truncate content to 255 characters if it's too long (Appwrite schema limit)
            const truncatedContent = content && content.length > 255 ? content.substring(0, 252) + '...' : content;
            
            const postData = {
                tiitle: title || "", // Changed from "title" to "tiitle" to match schema
                Content: truncatedContent || "", // Changed from "content" to "Content" to match schema
                FeatureImage: featuredImage || "", // Changed from "featuredImage" to "FeatureImage" to match schema
                Status: status || "active", // Changed from "status" to "Status" to match schema
                UserId: userId || "" // Changed from "userId" to "UserId" to match schema
            };

            // Log the data being sent for debugging
            console.log("Creating post with data:", postData);
            console.log("Database ID:", conf.appwriteDatabaseId);
            console.log("Collection ID:", conf.appwriteCollectionId);
            console.log("Original content length:", content ? content.length : 0);
            console.log("Truncated content length:", truncatedContent ? truncatedContent.length : 0);

            // Use Appwrite's built-in ID.unique() method which guarantees uniqueness
            const uniqueId = ID.unique();
            
            console.log("Generated unique ID using ID.unique():", uniqueId, "Length:", uniqueId.length);
            
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                uniqueId, // Use Appwrite's guaranteed unique ID
                postData
            ).then(result => {
                console.log("✅ Post created successfully:", result);
                return result;
            }).catch(async (error) => {
                console.log("❌ Post creation failed:", error);
                // If it's an ID conflict (shouldn't happen with ID.unique()), try with a new one
                if (error.code === 409 && error.message.includes("ID already exists")) {
                    console.log("🔄 Unexpected ID conflict with ID.unique(), retrying with new ID...");
                    
                    // Try up to 3 times with new ID.unique() calls
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        try {
                            const retryId = ID.unique();
                            console.log(`🔄 Retry attempt ${attempt} with new ID.unique():`, retryId);
                            
                            const result = await this.databases.createDocument(
                                conf.appwriteDatabaseId,
                                conf.appwriteCollectionId,
                                retryId,
                                postData
                            );
                            
                            console.log("✅ Post created successfully on retry:", result);
                            return result;
                            
                        } catch (retryError) {
                            console.log(`❌ Retry attempt ${attempt} failed:`, retryError.message);
                            if (attempt === 3) {
                                console.log("❌ All retry attempts failed");
                                throw retryError;
                            }
                            // Wait a bit before next attempt
                            await new Promise(resolve => setTimeout(resolve, 50));
                        }
                    }
                }
                throw error;
            });
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            console.log("Error details:", {
                message: error.message,
                code: error.code,
                response: error.response
            });
            // Re-throw the error so the calling code can handle it
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            // Note: Using "tiitle", "Content", "FeatureImage", and "Status" to match the user's Appwrite collection schema
            
            // Truncate content to 255 characters if it's too long (Appwrite schema limit)
            const truncatedContent = content && content.length > 255 ? content.substring(0, 252) + '...' : content;
            
            const updateData = {
                tiitle: title || "", // Changed from "title" to "tiitle" to match schema
                Content: truncatedContent || "", // Changed from "content" to "Content" to match schema
                FeatureImage: featuredImage || "", // Changed from "featuredImage" to "FeatureImage" to match schema
                Status: status || "active" // Changed from "status" to "Status" to match schema
            };

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                updateData
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = []){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

    // Alternative: Get public file URL (if bucket is public)
    getPublicFileUrl(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }

    // Test function to debug image loading issues
    async testImageAccess(fileId) {
        try {
            const imageUrl = this.getFilePreview(fileId)
            console.log('Testing image access for fileId:', fileId)
            console.log('Generated URL:', imageUrl)
            
            // Test if the image is accessible
            const response = await fetch(imageUrl, { method: 'HEAD' })
            console.log('Image access test response:', response.status, response.statusText)
            
            if (response.ok) {
                console.log('✅ Image is accessible')
                return true
            } else {
                console.log('❌ Image access failed:', response.status)
                
                // Try public URL as fallback
                if (response.status === 403) {
                    console.log('🔄 Trying public file URL...')
                    const publicUrl = this.getPublicFileUrl(fileId)
                    console.log('Public URL:', publicUrl)
                    
                    try {
                        const publicResponse = await fetch(publicUrl, { method: 'HEAD' })
                        console.log('Public URL test response:', publicResponse.status)
                        if (publicResponse.ok) {
                            console.log('✅ Public URL works!')
                            return 'public'
                        }
                    } catch (publicError) {
                        console.log('❌ Public URL also failed:', publicError)
                    }
                }
                
                return false
            }
        } catch (error) {
            console.error('❌ Image access test error:', error)
            return false
        }
    }
}


const service = new Service()
export default service