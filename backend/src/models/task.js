import mongoose, {Schema, Document} from "mongoose";

const taskSchema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    expense: { type: Boolean, required: true },
    date: { type: Date, required: true },
});

export default mongoose.model('Task', taskSchema);