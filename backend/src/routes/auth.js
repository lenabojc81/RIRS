import express from 'express';
import { AuthService } from '../services/authService.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and username are required'
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Basic username validation
        if (username.length < 3 || username.length > 30) {
            return res.status(400).json({
                success: false,
                error: 'Username must be between 3 and 30 characters'
            });
        }

        const result = await AuthService.registerUser({
            email,
            password,
            username
        });

        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Registration endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await AuthService.loginUser({ email, password });

        if (result.success) {
            // Set token as httpOnly cookie for security
            res.cookie('authToken', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Send user data without token
            res.status(200).json({
                success: true,
                user: result.user
            });
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error('Login endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No authentication token provided'
            });
        }

        const verification = await AuthService.verifyToken(token);
        
        if (!verification.success) {
            return res.status(401).json({
                success: false,
                error: 'Invalid authentication token'
            });
        }

        const userProfile = await AuthService.getUserProfile(verification.uid);
        
        if (!userProfile) {
            return res.status(404).json({
                success: false,
                error: 'User profile not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                uid: userProfile.uid,
                email: userProfile.email,
                username: userProfile.username
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Update profile endpoint
router.put('/profile', async (req, res) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No authentication token provided'
            });
        }

        const verification = await AuthService.verifyToken(token);
        
        if (!verification.success) {
            return res.status(401).json({
                success: false,
                error: 'Invalid authentication token'
            });
        }

        const { username } = req.body;
        const updates = {};
        
        if (username) {
            updates.username = username.toLowerCase();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid updates provided'
            });
        }

        const result = await AuthService.updateUserProfile(verification.uid, updates);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router;