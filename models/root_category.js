import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var rootCategorySchema = new Schema({
  name: { type: String, require: true, max: 50 },
  status: { type: Boolean, require: true, default: true }
});

export default mongoose.model('root_category', rootCategorySchema);