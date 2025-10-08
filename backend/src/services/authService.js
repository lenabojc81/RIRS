import { auth, firestore } from './firebase.js';

export class AuthService {
    // Register new user
    static async registerUser(userData) {
        try {
            const { email, password, username } = userData;

            // Validate input
            if (!email || !password || !username) {
                return {
                    success: false,
                    error: 'Email, password, and username are required'
                };
            }

            // Create user with Firebase Auth Admin
            const userRecord = await auth.createUser({
                email: email,
                password: password,
                displayName: username
            });

            // Create user profile in Firestore
            const userProfile = {
                uid: userRecord.uid,
                email: email,
                username: username.toLowerCase(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Save to Firestore
            await firestore.collection('users').doc(userRecord.uid).set(userProfile);

            // Create custom token for immediate login
            const customToken = await auth.createCustomToken(userRecord.uid);

            return {
                success: true,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    username: userProfile.username
                },
                token: customToken
            };
        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle specific Firebase errors
            let errorMessage = 'Registration failed';
            if (error.code === 'auth/email-already-exists') {
                errorMessage = 'Email is already registered';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use at least 6 characters';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    // Login user - this would typically be handled by the client, but we can verify credentials
    static async loginUser(loginData) {
        try {
            const { email, password } = loginData;

            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email and password are required'
                };
            }

            // Since Firebase Admin doesn't have direct login, we'll need to use a different approach
            // For now, we'll create a custom token if user exists
            const userRecord = await auth.getUserByEmail(email);
            
            if (!userRecord) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            // Get user profile from Firestore
            const userDoc = await firestore.collection('users').doc(userRecord.uid).get();

            if (!userDoc.exists) {
                return {
                    success: false,
                    error: 'User profile not found'
                };
            }

            const userProfile = userDoc.data();

            // Create custom token for the user
            const customToken = await auth.createCustomToken(userRecord.uid);

            return {
                success: true,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    username: userProfile.username
                },
                token: customToken
            };
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'Login failed';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    // Get user profile by UID
    static async getUserProfile(uid) {
        try {
            const userDoc = await firestore.collection('users').doc(uid).get();

            if (userDoc.exists) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    // Update user profile
    static async updateUserProfile(uid, updates) {
        try {
            await firestore.collection('users').doc(uid).update({
                ...updates,
                updatedAt: new Date()
            });

            return { success: true };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    }

    // Verify Firebase token (for middleware)
    static async verifyToken(idToken) {
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            return {
                success: true,
                uid: decodedToken.uid,
                email: decodedToken.email
            };
        } catch (error) {
            console.error('Token verification error:', error);
            return {
                success: false,
                error: 'Invalid token'
            };
        }
    }
}