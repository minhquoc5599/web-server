import Video from '../../models/video.js';

const videoRepository = {
  //CREATE
  addOne(video) {
    return video.save();
  },

  //READ
  getAllByCourseId(course_id) {
    return Video.find({ course_id: course_id });
  },
  getOneById(id) {
    return Video.findById(id);
  },
  getOneByTitle(title) {
    return Video.findOne({ title: title });
  },

  //UPDATE
  updateOne(video) {
    return video.save();
  },

  //DELETE
  deleteOne(id) {
    return Video.deleteOne({ _id: id });
  }
}

export default videoRepository;