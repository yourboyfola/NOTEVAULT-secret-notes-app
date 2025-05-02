import mongoose from "mongoose";

const {Schema, model} = mongoose;

const secretNotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    // secretKey: {
    //     type: String,
    //     required: true
    // },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

const secretNote = model('secretNote', secretNotesSchema);
export default secretNote;