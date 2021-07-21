import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, require: true, max: 50 },
});

export default mongoose.model('role', userSchema);