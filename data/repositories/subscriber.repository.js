import Subscriber from "../../models/subscriber.js";

const subscriberRepository = {
  //CREATE
  addOne(subscriber) {
    return subscriber.save();
  },

  //READ
  getAllByCourseId(course_id) {
    return Subscriber.find({ course_id: course_id });
  },
  getAllByStudentId(student_id) {
    return Subscriber.find({ student_id: student_id });
  },
  getAllRatedByCourseId(course_id) {
    return Subscriber.find({ course_id: course_id, rating: { $gte: 1 } });
  },
  getOneByCourseIdStudentId(course_id, student_id) {
    return Subscriber.findOne({ course_id: course_id, student_id: student_id });
  },

  //UPDATE
  updateOne(subscriber) {
    return subscriber.save();
  }

  //DELETE
}

export default subscriberRepository;