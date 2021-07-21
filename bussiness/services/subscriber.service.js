import Subscriber from "../../models/subscriber.js";
import operatorType from "../../utils/enums/operatorType.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";
import subscriberValidator from "../../api/validators/subscriberValidator.js";

const subscriberService = {
  async addSubscriber(course_id, student_id) {
    // Validate request
    const resultValidator = subscriberValidator.addValidator(course_id, student_id);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check
    let subscriber = await subscriberRepository.getSubscriberByCourseIdStudentId(course_id, student_id);
    if (subscriber === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      };
    }
    if (subscriber) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_HAS_BEEN_SUBSCRIBED
      };
    }

    // Save subscriber to DB
    subscriber = new Subscriber({ course_id, student_id });
    const createSubscriber = await subscriberRepository.addSubscriber(subscriber);
    console.log(createSubscriber);
    if (createSubscriber === operatorType.FAIL.CREATE) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.CREATE
      };
    }
    return {
      isSuccess: true,
      createSubscriber,
      code: operatorType.SUCCESS.CREATE
    }
  },
  async getSubscribersByCourseId(course_id) {
    // Validate course id
    const resultValidator = subscriberValidator.courseIdValidator(course_id);
    if (!resultValidator.isSuccess) return resultValidator;

    const subscribers = await subscriberRepository.getSubscribersByCourseId(course_id);
    if (subscribers === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!subscribers) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_IS_INVALID
      }
    }
    return {
      isSuccess: true,
      subscribers,
      code: operatorType.SUCCESS.READ
    }
  },

  async getSubscribersRatingByCourseId(course_id) {
    // Validate course id
    const resultValidator = subscriberValidator.courseIdValidator(course_id);
    if (!resultValidator.isSuccess) return resultValidator;

    const subscribers = await subscriberRepository.getSubscribersRatingByCourseId(course_id);
    if (subscribers === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!subscribers) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_IS_INVALID
      }
    }
    return {
      isSuccess: true,
      subscribers,
      code: operatorType.SUCCESS.READ
    }
  },
  async updateSubscriber(course_id, student_id, rating, comment) {
    // Validate student id, rating
    const resultValidator = await subscriberValidator.updateValidator(course_id, student_id, rating);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check subscriber 
    const subscriber = await subscriberRepository.getSubscriberByCourseIdStudentId(course_id, student_id);
    if (subscriber === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!subscriber) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_AND_STUDENT_ID_ARE_INVALID
      }
    }
    if (subscriber.rating > 0) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_HAS_BEEN_RATED
      }
    }

    // Update subscriber to DB
    subscriber.rating = rating;
    subscriber.comment = comment;
    const resultUpdate = await subscriberRepository.updateSubscriber(subscriber);
    if (resultUpdate === operatorType.FAIL.UPDATE) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    return {
      isSuccess: true,
      resultUpdate,
      code: operatorType.SUCCESS.UPDATE
    }
  }
}

export default subscriberService;