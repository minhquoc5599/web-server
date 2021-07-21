import Subscriber from "../../models/subscriber.js";
import operatorType from "../../utils/enums/operatorType.js";

const subscriberRepository = {
  //CREATE
  addSubscriber(subscriber) {
    return subscriber.save().catch(() => {
      operatorType.FAIL.CREATE
    });
  },

  //READ
  getSubscribersByCourseId(course_id) {
    return Subscriber.find({ course_id: course_id }).catch(() => {
      operatorType.FAIL.READ
    });
  },
  getSubscribersByStudentId(student_id) {
    return Subscriber.find({ student_id: student_id }).catch(() => {
      operatorType.FAIL.READ
    });
  },
  getSubscribersRatingByCourseId(course_id) {
    return Subscriber.find({ course_id: course_id, rating: { $gte: 1 } })
      .catch(() => {
        operatorType.FAIL.READ
      })
  },
  getSubscriberByCourseIdStudentId(course_id, student_id) {
    return Subscriber.findOne({ course_id: course_id, student_id: student_id })
      .catch(() => {
        operatorType.FAIL.READ
      })
  },

  //UPDATE
  updateSubscriber(subscriber) {
    return subscriber.save().catch(() => {
      operatorType.FAIL.UPDATE
    });
  }
  //DELETE
}

export default subscriberRepository;