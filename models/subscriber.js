import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var subscriberSchema = new Schema({
  course_id: { type: Schema.Types.ObjectId, ref: 'course', require: true },
  student_id: { type: Schema.Types.ObjectId, ref: 'user', require: true },
  rating: { type: Number, max: 5, min: 0, default: 0 },
  comment: { type: String, max: 100, default: '' }
});

export default mongoose.model('subscriber', subscriberSchema);