import Subscriber from "../../models/subscriber.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";
import subscriberValidator from "../../api/validators/subscriberValidator.js";

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
        subscriber: createSubscriber
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByCourseId(course_id) {
    try {
      // Validate course id
      const resultValidator = subscriberValidator.courseIdValidator(course_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      const subscribers = await subscriberRepository.getAllByCourseId(course_id);
      if (!subscribers) {
        return {
          code: subscriberResponseEnum.COURSE_ID_IS_INVALID
        };
      }
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscribers
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllRatedByCourseId(course_id) {
    try {
      // Validate course id
      const resultValidator = subscriberValidator.courseIdValidator(course_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      const subscribers = await subscriberRepository.getAllRatedByCourseId(course_id);
      if (!subscribers) {
        return {
          code: subscriberResponseEnum.COURSE_ID_IS_INVALID
        };
      }
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscribers
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }

  },

  async rating(course_id, student_id, rating, comment) {
    try {
      // Validate student id, rating
      const resultValidator = subscriberValidator.updateValidator(course_id, student_id, rating);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check subscriber available or not 
      const subscriber = await subscriberRepository.getOneByCourseIdStudentId(course_id, student_id);
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
      const resultUpdate = await subscriberRepository.updateOne(subscriber);
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscriber: resultUpdate
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default subscriberService;