import express from 'express';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebase.js';
import { AuthService } from './services/authService.js';

const router = express.Router();

// Middleware to verify authentication
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ success: false, error: 'No authentication token' });
        }

        const decoded = await AuthService.verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, error: 'Invalid authentication token' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, error: 'Invalid authentication token' });
    }
};

// Generate a unique ID
const generateUniqueId = () => {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create a new planner for the authenticated user
router.post('/createPlanner', authenticateUser, async (req, res) => {
    try {
        const newPlanner = {
            ...req.body,
            id: generateUniqueId(), // Generate unique ID
            date_start: new Date()
        };

        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentPlanners = userData.planners || [];
        
        // Add new planner to user's planners array
        await updateDoc(userDocRef, {
            planners: [...currentPlanners, newPlanner],
            updatedAt: new Date()
        });

        console.log('New planner saved for user:', req.user.uid);
        res.status(201).json({ success: true, planner: newPlanner });
    } catch(err) {
        console.error('Error creating planner:', err);
        res.status(400).json({ error: err.message });
    }
});

// Delete a planner by ID for the authenticated user
router.delete('/deletePlanner/:id', authenticateUser, async (req, res) => {
    try {
        const plannerId = req.params.id;
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentPlanners = userData.planners || [];
        
        // Filter out the planner to delete
        const updatedPlanners = currentPlanners.filter(planner => planner.id !== plannerId);
        
        if (updatedPlanners.length === currentPlanners.length) {
            return res.status(404).json({ success: false, error: 'Planner not found' });
        }

        // Update user document with filtered planners
        await updateDoc(userDocRef, {
            planners: updatedPlanners,
            updatedAt: new Date()
        });

        console.log('Planner deleted for user:', req.user.uid);
        res.status(200).json({ success: true });
    } catch(err) {
        console.error('Error deleting planner:', err);
        res.status(400).json({ error: err.message });
    }
});

// Update a planner by ID for the authenticated user
router.put('/editPlanner/:id', authenticateUser, async (req, res) => {
    try {
        const plannerId = req.params.id;
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentPlanners = userData.planners || [];
        
        // Find and update the specific planner
        const plannerIndex = currentPlanners.findIndex(planner => planner.id === plannerId);
        
        if (plannerIndex === -1) {
            return res.status(404).json({ success: false, error: 'Planner not found' });
        }

        // Update the planner at the found index
        currentPlanners[plannerIndex] = { ...currentPlanners[plannerIndex], ...req.body };
        
        // Update user document with modified planners
        await updateDoc(userDocRef, {
            planners: currentPlanners,
            updatedAt: new Date()
        });

        console.log('Planner successfully updated for user:', req.user.uid);
        res.status(200).json({ success: true, planner: currentPlanners[plannerIndex] });
    } catch (err) {
        console.error('Error updating planner:', err);
        res.status(400).json({ error: err.message });
    }
});

// Get all planners for the authenticated user
router.get('/getAllPlanners', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        let planners = userData.planners || [];
        
        // Migration: Ensure all planners have IDs
        let needsUpdate = false;
        planners = planners.map(planner => {
            if (!planner.id) {
                needsUpdate = true;
                return { ...planner, id: generateUniqueId() };
            }
            return planner;
        });
        
        // If planners were updated with IDs, save them back to the database
        if (needsUpdate) {
            await updateDoc(userDocRef, {
                planners: planners,
                updatedAt: new Date()
            });
            console.log(`Added IDs to planners for user: ${req.user.uid}`);
        }
        
        // Sort planners by date_start descending (newest first)
        planners.sort((a, b) => {
            const dateA = new Date(a.date_start.toDate ? a.date_start.toDate() : a.date_start);
            const dateB = new Date(b.date_start.toDate ? b.date_start.toDate() : b.date_start);
            
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime(); // Newest first
            }
            
            return (a.title || '').localeCompare(b.title || '');
        });
        
        console.log(`Successfully fetched ${planners.length} planners (all) for user:`, req.user.uid);
        res.status(200).json(planners);
    } catch (err) {
        console.error('Error fetching all planners:', err);
        res.status(500).json({ error: 'Failed to fetch planners', details: err.message });
    }
});

// Get all undone planners for the authenticated user
router.get('/getUndonePlanners', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        let planners = userData.planners || [];
        
        // Migration: Ensure all planners have IDs
        let needsUpdate = false;
        planners = planners.map(planner => {
            if (!planner.id) {
                needsUpdate = true;
                return { ...planner, id: generateUniqueId() };
            }
            return planner;
        });
        
        // If planners were updated with IDs, save them back to the database
        if (needsUpdate) {
            await updateDoc(userDocRef, {
                planners: planners,
                updatedAt: new Date()
            });
            console.log(`Added IDs to planners for user: ${req.user.uid}`);
        }
        
        // Filter out completed planners
        planners = planners.filter(planner => !planner.date_done);
        
        // Sort planners by date_start descending (newest first)
        planners.sort((a, b) => {
            const dateA = new Date(a.date_start.toDate ? a.date_start.toDate() : a.date_start);
            const dateB = new Date(b.date_start.toDate ? b.date_start.toDate() : b.date_start);
            
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime(); // Newest first
            }
            
            return (a.title || '').localeCompare(b.title || '');
        });
        
        console.log(`Successfully fetched ${planners.length} active planners for user:`, req.user.uid);
        res.status(200).json(planners);
    } catch (err) {
        console.error('Error fetching planners:', err);
        res.status(500).json({ error: 'Failed to fetch planners', details: err.message });
    }
});

export default router;