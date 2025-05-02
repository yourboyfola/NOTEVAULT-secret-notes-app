import mongoose from "mongoose";
const {Schema, model} = mongoose;

const mainNotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});

const Note = model('Note', mainNotesSchema);
export default Note;