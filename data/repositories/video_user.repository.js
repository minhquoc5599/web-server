import VideoUser from "../../models/video_user.js";

const videoUserRepository = {
  //CREATE
  addOne(video) {
    return videoUser.save();
  },

  //READ
  getAll() {
    return VideoUser.find({});
  },

  getOneById(id) {
    return VideoUser.findById(id);
  },
  getOneByTitle(title) {
    return VideoUser.findOne({ title: title });
  },

  //UPDATE
  updateOne(videoUser) {
    return videoUser.save();
  },

  //DELETE
  deleteOne(id) {
    return VideoUser.deleteOne({ _id: id });
  },
};

export default videoUserRepository;
