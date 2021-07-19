import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var roleSchema = new Schema({
  name: { type: String, require: true, max: 50 }
});

export default mongoose.model('role', roleSchema);