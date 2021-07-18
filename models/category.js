import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String, require: true, max: 50 },
  root_category_id: { type: Schema.Types.ObjectId, ref: 'root_category', require: true },
  status: { type: Boolean, require: true, default: true }
});

export default mongoose.model('category', categorySchema);