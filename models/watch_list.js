import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var watchListSchema = new Schema({
  course_id: { type: Schema.Types.ObjectId, ref: 'course', require: true },
  student_id: { type: Schema.Types.ObjectId, ref: 'user', require: true },
});

export default mongoose.model('watch_list', watchListSchema);