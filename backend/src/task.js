import express from 'express';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebase.js';

const router = express.Router();

const tasksCollection = collection(database, 'tasks');

router.get('/getTasks', async (req, res) => {
    try {
        const querySnapshot = await getDocs(tasksCollection);
        const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tasks);
        console.log('tasks successfully fetched');
    } catch (err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.post('/newTask', async (req, res) => {
    try {
        const newTask = req.body;
        await addDoc(collection(database, 'tasks'), newTask);
        console.log('new task saved');
        res.status(200).send('new task saved');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.delete('/deleteTask/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskDoc = doc(database, 'tasks', taskId);
        await deleteDoc(taskDoc);
        console.log('task deleted');
        res.status(200).send('task deleted');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.put('/editTask/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskDoc = doc(database, 'tasks', taskId);
        await updateDoc(taskDoc, req.body);

        if (!updatedTask) {
            return res.status(404).send({ error: 'Task not found' });
        }

        console.log('Task successfully updated');
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Failed to update task' });
    }
});


export default router;