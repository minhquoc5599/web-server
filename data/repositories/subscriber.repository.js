import Subscriber from "../../models/subscriber.js";

const subscriberRepository = {
  //CREATE
  addOne(subscriber) {
    return subscriber.save();
  },

  //READ
  getAll() {
    return Subscriber.find();
  },
  getAllByCourseId(course_id) {
    return Subscriber.find({ course_id: course_id });
  },
  getAllByStudentId(student_id) {
    return Subscriber.find({ student_id: student_id });
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