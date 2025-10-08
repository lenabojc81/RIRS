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

// Get all labels for the authenticated user
router.get('/getLabels', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const labels = userData.labels || [];

        res.status(200).json(labels);
        console.log('Labels successfully fetched for user:', req.user.uid);
    } catch (err) {
        console.error('Error fetching labels:', err);
        res.status(400).json({ error: err.message });
    }
});

// Create a new label for the authenticated user
router.post('/createLabel', authenticateUser, async (req, res) => {
    try {
        const { name, color } = req.body;
        
        if (!name || !color) {
            return res.status(400).json({ success: false, error: 'Name and color are required' });
        }

        const newLabel = {
            id: generateUniqueId(),
            name: name.trim(),
            color: color
        };

        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentLabels = userData.labels || [];
        
        // Check if label name already exists
        const existingLabel = currentLabels.find(label => label.name.toLowerCase() === name.toLowerCase());
        if (existingLabel) {
            return res.status(400).json({ success: false, error: 'Label with this name already exists' });
        }
        
        // Add new label to user's labels array
        await updateDoc(userDocRef, {
            labels: [...currentLabels, newLabel],
            updatedAt: new Date()
        });

        console.log('New label saved for user:', req.user.uid);
        res.status(201).json({ success: true, label: newLabel });
    } catch(err) {
        console.error('Error creating label:', err);
        res.status(400).json({ error: err.message });
    }
});

// Delete a label by ID for the authenticated user
router.delete('/deleteLabel/:id', authenticateUser, async (req, res) => {
    try {
        const labelId = req.params.id;
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentLabels = userData.labels || [];
        const currentTasks = userData.tasks || [];
        
        // Filter out the label to delete
        const updatedLabels = currentLabels.filter(label => label.id !== labelId);
        
        if (updatedLabels.length === currentLabels.length) {
            return res.status(404).json({ success: false, error: 'Label not found' });
        }

        // Remove the deleted label from all tasks that use it
        const updatedTasks = currentTasks.map(task => {
            let taskUpdated = false;
            const updatedTask = { ...task };
            
            // Remove from labels array if it exists
            if (task.labels && Array.isArray(task.labels)) {
                const filteredLabels = task.labels.filter(id => id !== labelId);
                if (filteredLabels.length !== task.labels.length) {
                    updatedTask.labels = filteredLabels;
                    taskUpdated = true;
                }
            }
            
            // Remove from old label field if it matches (backward compatibility)
            if (task.label === labelId) {
                updatedTask.label = "";
                taskUpdated = true;
            }
            
            return updatedTask;
        });

        // Update user document with filtered labels and updated tasks
        await updateDoc(userDocRef, {
            labels: updatedLabels,
            tasks: updatedTasks,
            updatedAt: new Date()
        });

        // Count how many tasks were affected
        const affectedTasksCount = currentTasks.filter(task => 
            (task.labels && task.labels.includes(labelId)) || task.label === labelId
        ).length;

        console.log(`Label deleted for user: ${req.user.uid}, ${affectedTasksCount} tasks updated`);
        res.status(200).json({ 
            success: true, 
            affectedTasks: affectedTasksCount,
            message: affectedTasksCount > 0 
                ? `Label deleted and removed from ${affectedTasksCount} task(s)` 
                : 'Label deleted'
        });
    } catch(err) {
        console.error('Error deleting label:', err);
        res.status(400).json({ error: err.message });
    }
});

// Update a label by ID for the authenticated user
router.put('/editLabel/:id', authenticateUser, async (req, res) => {
    try {
        const labelId = req.params.id;
        const { name, color } = req.body;
        
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentLabels = userData.labels || [];
        
        // Find and update the specific label
        const labelIndex = currentLabels.findIndex(label => label.id === labelId);
        
        if (labelIndex === -1) {
            return res.status(404).json({ success: false, error: 'Label not found' });
        }

        // Check if new name conflicts with existing labels (excluding current one)
        if (name) {
            const existingLabel = currentLabels.find((label, index) => 
                label.name.toLowerCase() === name.toLowerCase() && index !== labelIndex
            );
            if (existingLabel) {
                return res.status(400).json({ success: false, error: 'Label with this name already exists' });
            }
        }

        // Update the label at the found index
        if (name) currentLabels[labelIndex].name = name.trim();
        if (color) currentLabels[labelIndex].color = color;
        
        // Update user document with modified labels
        await updateDoc(userDocRef, {
            labels: currentLabels,
            updatedAt: new Date()
        });

        console.log('Label successfully updated for user:', req.user.uid);
        res.status(200).json({ success: true, label: currentLabels[labelIndex] });
    } catch (err) {
        console.error('Error updating label:', err);
        res.status(400).json({ error: err.message });
    }
});

export default router;