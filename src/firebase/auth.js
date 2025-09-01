import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth } from "./config";

export class FirebaseAuthService {
    
    // Create a new user account
    async createAccount({ email, password, name }) {
        try {
            console.log("Creating Firebase account for:", email);
            
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update profile with display name
            await updateProfile(user, {
                displayName: name
            });
            
            console.log("✅ Account created successfully:", user.uid);
            
            // Return user data
            return {
                $id: user.uid,
                email: user.email,
                name: user.displayName
            };
            
        } catch (error) {
            console.log("❌ Firebase createAccount error:", error);
            throw error;
        }
    }

    // Sign in user
    async login({ email, password }) {
        try {
            console.log("Signing in user:", email);
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("✅ User signed in successfully:", user.uid);
            
            return {
                $id: user.uid,
                email: user.email,
                name: user.displayName
            };
            
        } catch (error) {
            console.log("❌ Firebase login error:", error);
            throw error;
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            return new Promise((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    unsubscribe();
                    
                    if (user) {
                        console.log("✅ Current user found:", user.uid);
                        resolve({
                            $id: user.uid,
                            email: user.email,
                            name: user.displayName
                        });
                    } else {
                        console.log("❌ No current user");
                        resolve(null);
                    }
                });
            });
        } catch (error) {
            console.log("❌ Firebase getCurrentUser error:", error);
            return null;
        }
    }

    // Sign out user
    async logout() {
        try {
            console.log("Signing out user...");
            
            await signOut(auth);
            
            console.log("✅ User signed out successfully");
            return true;
            
        } catch (error) {
            console.log("❌ Firebase logout error:", error);
            return false;
        }
    }

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                callback({
                    $id: user.uid,
                    email: user.email,
                    name: user.displayName
                });
            } else {
                callback(null);
            }
        });
    }
}

const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
