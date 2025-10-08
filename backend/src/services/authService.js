import { auth, firestore } from './firebase.js';
import jwt from 'jsonwebtoken';

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

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
                updatedAt: new Date(),
                tasks: [],
                planners: []
            };

            // Save to Firestore
            await firestore.collection('users').doc(userRecord.uid).set(userProfile);

            // Create JWT token for immediate login
            const jwtToken = jwt.sign(
                { 
                    uid: userRecord.uid, 
                    email: userRecord.email,
                    username: userProfile.username
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                success: true,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    username: userProfile.username
                },
                token: jwtToken
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

    // Login user - simplified version since we can't verify passwords with Firebase Admin
    static async loginUser(loginData) {
        try {
            const { email, password } = loginData;

            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email and password are required'
                };
            }

            // Check if user exists in Firebase Auth
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

            // Note: In a real application, you would verify the password here
            // For this demo, we're assuming the password is correct if the user exists
            // TODO: Implement proper password verification or use Firebase client SDK

            // Create JWT token for the user
            const jwtToken = jwt.sign(
                { 
                    uid: userRecord.uid, 
                    email: userRecord.email,
                    username: userProfile.username
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                success: true,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    username: userProfile.username
                },
                token: jwtToken
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
                const userData = userDoc.data();
                
                // Migration: Ensure tasks and planners arrays exist
                if (!userData.tasks || !userData.planners) {
                    const updatedData = {
                        ...userData,
                        tasks: userData.tasks || [],
                        planners: userData.planners || [],
                        updatedAt: new Date()
                    };
                    
                    // Update the user document with the new fields
                    await firestore.collection('users').doc(uid).update({
                        tasks: updatedData.tasks,
                        planners: updatedData.planners,
                        updatedAt: updatedData.updatedAt
                    });
                    
                    console.log(`Migrated user ${uid} to include tasks and planners arrays`);
                    return updatedData;
                }
                
                return userData;
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

    // Verify JWT token (for middleware)
    static async verifyToken(token) {
        try {
            // Check if token looks like a JWT (has 3 parts separated by dots)
            if (!token || typeof token !== 'string') {
                return {
                    success: false,
                    error: 'No token provided'
                };
            }

            // Check if it's a JWT format (3 parts separated by dots)
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                console.log('Token is not in JWT format, might be an old Firebase custom token');
                return {
                    success: false,
                    error: 'Invalid token format - please log in again'
                };
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            return {
                success: true,
                uid: decoded.uid,
                email: decoded.email,
                username: decoded.username
            };
        } catch (error) {
            console.error('Token verification error:', error.message);
            
            // Handle specific JWT errors more gracefully
            let errorMessage = 'Invalid token';
            if (error.name === 'JsonWebTokenError') {
                if (error.message.includes('invalid algorithm')) {
                    errorMessage = 'Invalid token format - please log in again';
                } else if (error.message.includes('invalid signature')) {
                    errorMessage = 'Invalid token signature - please log in again';
                } else if (error.message.includes('malformed')) {
                    errorMessage = 'Malformed token - please log in again';
                }
            } else if (error.name === 'TokenExpiredError') {
                errorMessage = 'Token expired - please log in again';
            }
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}