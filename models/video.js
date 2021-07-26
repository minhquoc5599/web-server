import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var videoSchema = new Schema({
  course_id: { type: Schema.Types.ObjectId, ref: 'course', require: true },
  title: { type: String, max: 100, require: true },
  video: { type: String, require: true },
  is_previewed: { type: Boolean, require: true, default: false }
});
export default mongoose.model('video', videoSchema);