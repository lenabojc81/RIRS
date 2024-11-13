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

router.delete('/deleteTransaction/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        console.log('transaction deleted');
        res.status(200).send('transaction deleted');
    } catch(err) {
        console.error(err);
        res.status(400).send({error: err });
    }
});

router.put('/editTransaction/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).send({ error: 'Transaction not found' });
        }

        console.log('Transaction successfully updated');
        res.status(200).json(updatedTransaction);
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Failed to update transaction' });
    }
});


export default router;