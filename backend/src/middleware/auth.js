import { AuthService } from '../services/authService.js';

// Middleware to verify authentication token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No authentication token provided.'
            });
        }

        const verification = await AuthService.verifyToken(token);
        
        if (!verification.success) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. Invalid token.'
            });
        }

        // Add user info to request object
        req.user = {
            uid: verification.uid,
            email: verification.email
        };

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Middleware to verify authentication token but don't require it
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        
        if (token) {
            const verification = await AuthService.verifyToken(token);
            
            if (verification.success) {
                req.user = {
                    uid: verification.uid,
                    email: verification.email
                };
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        // Don't fail the request, just continue without user info
        next();
    }
};