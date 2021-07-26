import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";

const subscriberValidator = {
  addValidator(course_id, student_id) {
    if (!course_id) {
      return {
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    if (!student_id) {
      return {
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    return {
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    };
  },
  courseIdValidator(course_id) {
    if (!course_id) {
      return {
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    return {
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    };
  },
  studentIdValidator(student_id) {
    if (!student_id) {
      return {
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    return {
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    }
  },
  updateValidator(course_id, student_id, rating) {
    if (!course_id) {
      return {
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    if (!student_id) {
      return {
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    if (rating > 5) {
      return {
        code: subscriberResponseEnum.RATING_IS_MORE_THAN_5_STARS
      }
    }
    if (rating < 1) {
      return {
        code: subscriberResponseEnum.RATING_IS_LESS_THAN_1_STARS
      }
    }
    return {
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    }
  }
}

export default subscriberValidator;