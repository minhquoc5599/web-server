import WatchList from "../../models/watch_list.js";

const watchListRepository = {
  //CREATE
  addOne(watch_list) {
    return watch_list.save();
  },

  //READ
  getAllByStudentId(student_id) {
    return WatchList.find({ student_id: student_id });
  },
  getOneByCourseIdStudentId(course_id, student_id) {
    return WatchList.findOne({ course_id: course_id, student_id: student_id });
  },

  //DELETE
  deleteOne(course_id, student_id) {
    return WatchList.deleteOne({ course_id: course_id, student_id: student_id });
  }
}

export default watchListRepository;