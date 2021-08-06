import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var courseSchema = new Schema({
  name: { type: String, require: true, max: 50 },
  image: { type: String, require: true, max: 100 },
  description: { type: String, require: true, max: 200 },
  detail: { type: String, require: true, max: 10000 },
  price: { type: Number, require: true },
  discount: { type: Number, require: true },
  teacher_id: { type: Schema.Types.ObjectId, ref: 'user' },
  root_category_id: { type: Schema.Types.ObjectId, ref: 'root_category' },
  category_id: { type: Schema.Types.ObjectId, ref: 'category' },
  status: { type: Boolean, require: true },
  is_completed: { type: Boolean, require: true },
  views: { type: Number, require: true }
}, {
  timestamps: true
});

courseSchema.index({ name: 'text' });

export default mongoose.model('course', courseSchema);