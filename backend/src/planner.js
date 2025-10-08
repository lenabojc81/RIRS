import express from 'express';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { database } from '../firebase.js';

const router = express.Router();

const plannersCollection = collection(database, 'planners');

router.post('/createPlanner', async (req, res) => {
    try {
        const newPlanner = req.body;
        await addDoc(plannersCollection, newPlanner);
        console.log('new planner saved');
        res.status(201).send('new planner saved');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.delete('/deletePlanner/:id', async (req, res) => {
    try {
        const plannerId = req.params.id;
        const plannerDoc = doc(database, 'planners', plannerId);
        await deleteDoc(plannerDoc);
        console.log('planner deleted');
        res.status(200).send('planner deleted');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.put('/editPlanner/:id', async (req, res) => {
    try {
        const plannerId = req.params.id;
        const plannerDoc = doc(database, 'planners', plannerId);
        const updatedPlanner = await updateDoc(plannerDoc, req.body);

        // if (!updatedPlanner) {
        //     return res.status(404).send({ error: 'Planner not found' });
        // }

        console.log('Planner successfully updated');
        res.status(200).json(updatedPlanner);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Failed to update planner' });
    }
});

router.get('/getUndonePlanners', async (req, res) => {
    try {
        const querySnapshot = await getDocs(plannersCollection);
        let planners = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        planners = planners.filter(planner => !planner.date_done);
        
        planners.sort((a, b) => {
            const dateA = new Date(a.date_start.toDate ? a.date_start.toDate() : a.date_start);
            const dateB = new Date(b.date_start.toDate ? b.date_start.toDate() : b.date_start);
            
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB.getTime() - dateA.getTime(); // Newest first
            }
            
            return (a.title || '').localeCompare(b.title || '');
        });
        
        console.log(`Successfully fetched ${planners.length} active planners`);
        res.status(200).json(planners);
    } catch (err) {
        console.error('Error fetching planners:', err);
        res.status(500).send({ error: 'Failed to fetch planners', details: err.message });
    }
});

export default router;