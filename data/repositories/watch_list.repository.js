import WatchList from "../../models/watch_list.js";
import operatorType from "../../utils/enums/operatorType.js";

const watchListRepository = {
  //CREATE
  addWatchList(watch_list) {
    return watch_list.save().catch(() => {
      operatorType.FAIL.CREATE
    });
  },

  //READ
  getWatchListsByStudentId(student_id) {
    return WatchList.find({ student_id: student_id }).catch(() => {
      operatorType.FAIL.READ
    });
  },
  getWatchListByCourseIdStudentId(course_id, student_id) {
    return WatchList.findOne({ course_id: course_id, student_id: student_id })
      .catch(() => {
        operatorType.FAIL.READ
      });
  },

  //DELETE
  deleteWatchList(course_id, student_id) {
    return WatchList.deleteOne({ course_id: course_id, student_id: student_id })
      .catch(() => {
        operatorType.FAIL.DELETE
      });
  }
}

export default watchListRepository;