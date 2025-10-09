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

// Get all tasks for the authenticated user
router.get('/getTasks', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        let tasks = userData.tasks || [];
        
        // Migration: Ensure all tasks have IDs
        let needsUpdate = false;
        tasks = tasks.map(task => {
            if (!task.id) {
                needsUpdate = true;
                return { ...task, id: generateUniqueId() };
            }
            return task;
        });
        
        // If tasks were updated with IDs, save them back to the database
        if (needsUpdate) {
            await updateDoc(userDocRef, {
                tasks: tasks,
                updatedAt: new Date()
            });
            console.log(`Added IDs to tasks for user: ${req.user.uid}`);
        }
        
        // Sort tasks by date_start descending (newest first)
        tasks.sort((a, b) => {
            const dateA = new Date(a.date_start.toDate ? a.date_start.toDate() : a.date_start);
            const dateB = new Date(b.date_start.toDate ? b.date_start.toDate() : b.date_start);
            return dateB.getTime() - dateA.getTime();
        });

        res.status(200).json(tasks);
        console.log('Tasks successfully fetched for user:', req.user.uid);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(400).json({ error: err.message });
    }
});

// Generate a unique ID
const generateUniqueId = () => {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
};

// Create a new task for the authenticated user
router.post('/createTask', authenticateUser, async (req, res) => {
    try {
        const newTask = {
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
        const currentTasks = userData.tasks || [];
        
        // Add new task to user's tasks array
        await updateDoc(userDocRef, {
            tasks: [...currentTasks, newTask],
            updatedAt: new Date()
        });

        console.log('New task saved for user:', req.user.uid);
        res.status(201).json({ success: true, task: newTask });
    } catch(err) {
        console.error('Error creating task:', err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// Delete a task by ID for the authenticated user
router.delete('/deleteTask/:id', authenticateUser, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentTasks = userData.tasks || [];
        
        // Filter out the task to delete
        const updatedTasks = currentTasks.filter(task => task.id !== taskId);
        
        if (updatedTasks.length === currentTasks.length) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Update user document with filtered tasks
        await updateDoc(userDocRef, {
            tasks: updatedTasks,
            updatedAt: new Date()
        });

        console.log('Task deleted for user:', req.user.uid);
        res.status(200).json({ success: true });
    } catch(err) {
        console.error('Error deleting task:', err);
        res.status(400).json({ error: err.message });
    }
});

// Update a task by ID for the authenticated user
router.put('/editTask/:id', authenticateUser, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentTasks = userData.tasks || [];
        
        // Find and update the specific task
        const taskIndex = currentTasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Update the task at the found index
        currentTasks[taskIndex] = { ...currentTasks[taskIndex], ...req.body };
        
        // Update user document with modified tasks
        await updateDoc(userDocRef, {
            tasks: currentTasks,
            updatedAt: new Date()
        });

        console.log('Task successfully updated for user:', req.user.uid);
        res.status(200).json({ success: true, task: currentTasks[taskIndex] });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(400).json({ error: err.message });
    }
});

// Get all completed tasks for the authenticated user
router.get('/getCompletedTasks', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        let tasks = userData.tasks || [];
        
        // Migration: Ensure all tasks have IDs
        let needsUpdate = false;
        tasks = tasks.map(task => {
            if (!task.id) {
                needsUpdate = true;
                return { ...task, id: generateUniqueId() };
            }
            return task;
        });
        
        // If tasks were updated with IDs, save them back to the database
        if (needsUpdate) {
            await updateDoc(userDocRef, {
                tasks: tasks,
                updatedAt: new Date()
            });
            console.log(`Added IDs to tasks for user: ${req.user.uid}`);
        }
        
        // Filter only completed tasks
        tasks = tasks.filter(task => task.date_done !== null && task.date_done !== undefined);
        
        // Sort tasks by completion date descending (most recently completed first)
        tasks.sort((a, b) => {
            const dateA = new Date(a.date_done.toDate ? a.date_done.toDate() : a.date_done);
            const dateB = new Date(b.date_done.toDate ? b.date_done.toDate() : b.date_done);
            return dateB.getTime() - dateA.getTime();
        });

        res.status(200).json(tasks);
        console.log(`Tasks successfully fetched for user: ${req.user.uid} (${tasks.length} completed tasks)`);
    } catch (err) {
        console.error('Error fetching completed tasks:', err);
        res.status(400).json({ error: err.message });
    }
});

// Delete multiple tasks by IDs for the authenticated user
router.delete('/deleteTasks', authenticateUser, async (req, res) => {
    try {
        const { taskIds } = req.body;
        
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ success: false, error: 'Task IDs array is required' });
        }

        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentTasks = userData.tasks || [];
        
        // Filter out the tasks to delete
        const updatedTasks = currentTasks.filter(task => !taskIds.includes(task.id));
        
        const deletedCount = currentTasks.length - updatedTasks.length;
        
        if (deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'No tasks found to delete' });
        }

        // Update user document with filtered tasks
        await updateDoc(userDocRef, {
            tasks: updatedTasks,
            updatedAt: new Date()
        });

        console.log(`${deletedCount} tasks deleted for user: ${req.user.uid}`);
        res.status(200).json({ 
            success: true, 
            deletedCount: deletedCount,
            message: `Successfully deleted ${deletedCount} task(s)`
        });
    } catch(err) {
        console.error('Error deleting tasks:', err);
        res.status(400).json({ error: err.message });
    }
});

// Clean up expired daily tracker tasks (move them back to main list)
router.post('/cleanupDailyTracker', authenticateUser, async (req, res) => {
    try {
        const userDocRef = doc(database, 'users', req.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = userDoc.data();
        const currentTasks = userData.tasks || [];
        
        // Get today's date string
        const today = new Date().toISOString().split('T')[0];
        
        // Find tasks that are in daily tracker but not for today and not completed
        let cleanedCount = 0;
        const updatedTasks = currentTasks.map(task => {
            if (task.daily_tracker_date && task.daily_tracker_date !== today && !task.date_done) {
                cleanedCount++;
                return { ...task, daily_tracker_date: null };
            }
            return task;
        });

        if (cleanedCount > 0) {
            // Update user document with cleaned tasks
            await updateDoc(userDocRef, {
                tasks: updatedTasks,
                updatedAt: new Date()
            });
            
            console.log(`Cleaned up ${cleanedCount} expired daily tracker tasks for user: ${req.user.uid}`);
        }

        res.status(200).json({ 
            success: true, 
            cleanedCount: cleanedCount,
            message: `Cleaned up ${cleanedCount} expired daily tracker task(s)`
        });
    } catch(err) {
        console.error('Error cleaning up daily tracker:', err);
        res.status(400).json({ error: err.message });
    }
});

// Automatic cleanup endpoint for all users (can be called by cron job)
router.post('/cleanupAllDailyTrackers', async (req, res) => {
    try {
        // This would require admin privileges or be called internally
        // For now, just return a message about manual cleanup
        res.status(200).json({ 
            success: true, 
            message: 'Use /cleanupDailyTracker endpoint for individual user cleanup' 
        });
    } catch(err) {
        console.error('Error in global cleanup:', err);
        res.status(400).json({ error: err.message });
    }
});

export default router;