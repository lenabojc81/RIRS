import express from 'express';
import Transaction from './models/transaction.js';

const router = express.Router();

router.get('/getTransactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
        console.log('transactions succesfully fetched');
    } catch (err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.post('/newTransaction', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        console.log('new transaction saved');
        res.status(200).send('new transaction saved');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

export default router;