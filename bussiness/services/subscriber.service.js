import Subscriber from "../../models/subscriber.js";
import User from "../../models/user.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";
import subscriberValidator from "../../api/validators/subscriberValidator.js";
import entityRepository from "../../data/repositories/entity.repository.js";
const userRepository = entityRepository(User);

const subscriberService = {
  async subscribe(course_id, student_id) {
    try {
      // Validate request
      const resultValidator = subscriberValidator.addValidator(course_id, student_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check subsciber available or not
      let subscriber = await subscriberRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (subscriber) {
        return {
          code: subscriberResponseEnum.COURSE_HAS_BEEN_SUBSCRIBED
        };
      }

      // Save subscriber to DB
      subscriber = new Subscriber({ course_id, student_id });
      const createSubscriber = await subscriberRepository.addOne(subscriber);
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscriber: createSubscriber,
        is_subscribed: true
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByCourseId(course_id, user) {
    try {
      // Validate course id
      const resultValidator = subscriberValidator.courseIdValidator(course_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      let subscribers = await subscriberRepository.getAllByCourseId(course_id);
      subscribers = JSON.parse(JSON.stringify(subscribers));
      if (!subscribers) {
        return {
          code: subscriberResponseEnum.COURSE_ID_IS_INVALID
        };
      }
      const students = await userRepository.getAll();
      let getStudentsById = {};
      students.forEach(element => {
        getStudentsById[element._id] = element;
      });

      const subscribers_rated = subscribers.filter(sub => sub.rating > 0);
      const tmp = subscribers_rated;
      for (var i = 0; i < tmp.length; i++) {
        const student = getStudentsById[tmp[i].student_id];
        subscribers_rated[i]['student_name'] = student.name;
      }
      let point = 0;
      if (subscribers_rated.length > 0) {
        for (var i = 0; i < subscribers_rated.length; i++) {
          point = point + subscribers_rated[i].rating;
        }
        point = point / subscribers_rated.length;
      }
      let is_subscribed = user && subscribers.find(x => x.student_id == user.id) ? true : false;
      let is_rated = user && subscribers_rated.find(x => x.student_id == user.id) ? true : false;

      return {
        code: subscriberResponseEnum.SUCCESS,
        subscribers,
        subscribers_rated,
        is_subscribed,
        is_rated,
        point
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async rating(course_id, student_id, rating, comment, name) {
    try {
      // Validate student id, rating
      const resultValidator = subscriberValidator.updateValidator(course_id, student_id, rating);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check subscriber available or not 
      let subscriber = await subscriberRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (!subscriber) {
        return {
          code: subscriberResponseEnum.COURSE_ID_AND_STUDENT_ID_ARE_INVALID
        };
      }
      if (subscriber.rating > 0) {
        return {
          code: subscriberResponseEnum.COURSE_HAS_BEEN_RATED
        };
      }

      // Update subscriber to DB
      subscriber.rating = rating;
      subscriber.comment = comment;
      await subscriberRepository.updateOne(subscriber);
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscriber: {
          student_id: subscriber.student_id,
          course_id: subscriber.course_id,
          rating: subscriber.rating,
          comment: subscriber.comment,
          student_name: name
        },
        is_rated: true
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default subscriberService;