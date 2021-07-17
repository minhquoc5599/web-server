import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, require: true, max: 50 },
  name: { type: String, require: true, max: 50 },
  password: { type: String, require: true, max: 50 },
  role: { type: Schema.Types.ObjectId, ref: 'role' },
  status: { type: Boolean, require: true },
  refresh_token: { type: String, max: 500 }
});

export default mongoose.model('user', userSchema);