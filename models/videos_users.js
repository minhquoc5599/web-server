import mongoose from "mongoose";
import Double from "@mongoosejs/double";

const Schema = mongoose.Schema;

var videosUsersSchema = new Schema({
  video_id: { type: Schema.Types.ObjectId, ref: "video", require: true },
  user_id: { type: Schema.Types.ObjectId, ref: "user", require: true },
  current_time: { type: Double, require: true },
});
export default mongoose.model("video", videosUsersSchema);
