import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    confirmPasswordReset
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

    // Send password reset email
    async sendPasswordResetEmail(email, actionCodeSettings = null) {
        try {
            console.log("🔍 Firebase Auth Service - Sending password reset email to:", email);
            console.log("🔍 Firebase Auth instance:", auth);
            console.log("🔍 Firebase Auth current user:", auth.currentUser);
            
            // Default action code settings for custom URL
            const defaultActionCodeSettings = {
                url: `${window.location.origin}/reset-password`,
                handleCodeInApp: true,
            };
            
            // For production, use the correct domain
            if (window.location.hostname !== 'localhost') {
                defaultActionCodeSettings.url = 'https://dhruvblogs.vercel.app/reset-password';
            }
            
            const settings = actionCodeSettings || defaultActionCodeSettings;
            console.log("🔍 Action code settings:", settings);
            
            await sendPasswordResetEmail(auth, email, settings);
            
            console.log("✅ Password reset email sent successfully");
            return true;
            
        } catch (error) {
            console.log("❌ Firebase sendPasswordResetEmail error:", error);
            console.log("❌ Error details:", {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    // Confirm password reset with code
    async confirmPasswordReset(code, newPassword) {
        try {
            console.log("Confirming password reset with code");
            
            await confirmPasswordReset(auth, code, newPassword);
            
            console.log("✅ Password reset confirmed successfully");
            return true;
            
        } catch (error) {
            console.log("❌ Firebase confirmPasswordReset error:", error);
            throw error;
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
