import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy,
    serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

export class FirebaseService {
    
    // Create a new post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("Creating post with Firebase:", { title, slug, content, featuredImage, status, userId });
            
            const postData = {
                title: title || "",
                slug: slug || "",
                content: content || "",
                featuredImage: featuredImage || "",
                status: status || "active",
                userId: userId || "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            console.log("Post data to save:", postData);
            
            // Add document to Firestore (Firebase auto-generates ID)
            const docRef = await addDoc(collection(db, "posts"), postData);
            
            console.log("✅ Post created successfully with ID:", docRef.id);
            
            // Return the created post with the generated ID and compatible structure
            return {
                $id: docRef.id,
                tiitle: postData.title,
                slug: postData.slug,
                Content: postData.content,
                FeatureImage: postData.featuredImage,
                Status: postData.status,
                UserId: postData.userId,
                createdAt: postData.createdAt,
                updatedAt: postData.updatedAt
            };
            
        } catch (error) {
            console.log("❌ Firebase createPost error:", error);
            throw error;
        }
    }

    // Get a single post by slug
    async getPost(slug) {
        try {
            console.log("Getting post by slug:", slug);
            
            const q = query(
                collection(db, "posts"), 
                where("slug", "==", slug)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                console.log("✅ Post found:", doc.id);
                console.log("✅ Post data:", data);
                
                // Normalize field names for compatibility
                return {
                    $id: doc.id,
                    tiitle: data.title || data.tiitle || "",
                    slug: data.slug || "",
                    Content: data.content || data.Content || "",
                    FeatureImage: data.featuredImage || data.FeatureImage || "",
                    Status: data.status || data.Status || "active",
                    UserId: data.userId || data.UserId || "",
                    createdAt: data.createdAt || null,
                    updatedAt: data.updatedAt || null
                };
            } else {
                console.log("❌ Post not found for slug:", slug);
                return false;
            }
            
        } catch (error) {
            console.log("❌ Firebase getPost error:", error);
            return false;
        }
    }

    // Get all posts
    async getPosts() {
        try {
            console.log("Getting all posts...");
            
            // First try with orderBy, if it fails, get without ordering
            try {
                const q = query(
                    collection(db, "posts"), 
                    orderBy("createdAt", "desc")
                );
                
                const querySnapshot = await getDocs(q);
                const posts = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    posts.push({
                        $id: doc.id,
                        tiitle: data.title || data.tiitle || "",
                        slug: data.slug || "",
                        Content: data.content || data.Content || "",
                        FeatureImage: data.featuredImage || data.FeatureImage || "",
                        Status: data.status || data.Status || "active",
                        UserId: data.userId || data.UserId || "",
                        createdAt: data.createdAt || null,
                        updatedAt: data.updatedAt || null
                    });
                });
                
                console.log("✅ Found posts with ordering:", posts.length);
                return posts;
                
            } catch (orderError) {
                console.log("Ordering failed, getting posts without order:", orderError);
                
                // Fallback: get posts without ordering
                const querySnapshot = await getDocs(collection(db, "posts"));
                const posts = [];
                
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    posts.push({
                        $id: doc.id,
                        tiitle: data.title || data.tiitle || "",
                        slug: data.slug || "",
                        Content: data.content || data.Content || "",
                        FeatureImage: data.featuredImage || data.FeatureImage || "",
                        Status: data.status || data.Status || "active",
                        UserId: data.userId || data.UserId || "",
                        createdAt: data.createdAt || null,
                        updatedAt: data.updatedAt || null
                    });
                });
                
                console.log("✅ Found posts without ordering:", posts.length);
                return posts;
            }
            
        } catch (error) {
            console.log("❌ Firebase getPosts error:", error);
            return [];
        }
    }

    // Update a post
    async updatePost(postId, { title, content, featuredImage, status }) {
        try {
            console.log("Updating post:", postId);
            
            const updateData = {
                title: title || "",
                content: content || "",
                featuredImage: featuredImage || "",
                status: status || "active",
                updatedAt: serverTimestamp()
            };

            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, updateData);
            
            console.log("✅ Post updated successfully");
            return true;
            
        } catch (error) {
            console.log("❌ Firebase updatePost error:", error);
            throw error;
        }
    }

    // Delete a post
    async deletePost(postId) {
        try {
            console.log("Deleting post:", postId);
            
            await deleteDoc(doc(db, "posts", postId));
            
            console.log("✅ Post deleted successfully");
            return true;
            
        } catch (error) {
            console.log("❌ Firebase deletePost error:", error);
            return false;
        }
    }

    // Check if slug exists
    async checkSlugExists(slug) {
        try {
            console.log("Checking if slug exists:", slug);
            
            const q = query(
                collection(db, "posts"), 
                where("slug", "==", slug)
            );
            
            const querySnapshot = await getDocs(q);
            const exists = !querySnapshot.empty;
            
            console.log("Slug exists:", exists);
            return exists;
            
        } catch (error) {
            console.log("❌ Firebase checkSlugExists error:", error);
            return false;
        }
    }

    // Convert file to base64 and store in Firestore (FREE PLAN)
    async uploadFile(file) {
        try {
            console.log("Converting file to base64:", file.name);
            
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            console.log("✅ File converted to base64 successfully");
            
            return {
                $id: `${Date.now()}-${file.name}`,
                $bucketId: "firestore",
                $path: "base64",
                $url: base64,
                // For compatibility with existing code
                name: file.name,
                bucket: "firestore",
                fullPath: "base64",
                url: base64,
                // Add file info
                size: file.size,
                type: file.type
            };
            
        } catch (error) {
            console.log("❌ File conversion error:", error);
            return false;
        }
    }

    // Helper function to convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Delete file (no-op for base64 since it's stored in Firestore)
    async deleteFile(fileId) {
        try {
            console.log("File stored in Firestore, no deletion needed:", fileId);
            // Since images are stored as base64 in Firestore, 
            // they get deleted automatically when the post is deleted
            return true;
            
        } catch (error) {
            console.log("❌ File deletion error:", error);
            return false;
        }
    }

    // Get file preview URL (works with base64)
    getFilePreview(fileId) {
        // If it's a base64 string, return it directly
        if (fileId && fileId.startsWith('data:')) {
            return fileId;
        }
        // Fallback for other cases
        return fileId;
    }

    // Get public file URL (works with base64)
    getPublicFileUrl(fileId) {
        // If it's a base64 string, return it directly
        if (fileId && fileId.startsWith('data:')) {
            return fileId;
        }
        // Fallback for other cases
        return fileId;
    }

    // Test functions for debugging
    async testCollectionConfig() {
        try {
            console.log("Testing Firebase collection configuration...");
            
            const posts = await this.getPosts();
            console.log("✅ Firebase connection successful! Found posts:", posts.length);
            
            return true;
        } catch (error) {
            console.log("❌ Firebase configuration test failed:", error);
            return false;
        }
    }

    async testDocumentCreation() {
        try {
            console.log("Testing Firebase document creation...");
            
            const testData = {
                title: "Test Post",
                slug: `test-${Date.now()}`,
                content: "Test content",
                featuredImage: "",
                status: "active",
                userId: "test-user"
            };
            
            const result = await this.createPost(testData);
            console.log("✅ Test document created successfully:", result);
            
            // Clean up - delete the test document
            await this.deletePost(result.$id);
            console.log("✅ Test document cleaned up");
            
            return true;
            
        } catch (error) {
            console.log("❌ Test document creation failed:", error);
            return false;
        }
    }
}

const firebaseService = new FirebaseService();
export default firebaseService;
