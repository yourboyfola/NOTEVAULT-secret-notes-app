import mongoose from "mongoose";
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const newUser = model('newUser', userSchema);
export default newUser;