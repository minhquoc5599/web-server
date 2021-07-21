import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";

const subscriberValidator = {
  addValidator(course_id, student_id) {
    if (!course_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    if (!student_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    return {
      isSuccess: true,
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    };
  },
  courseIdValidator(course_id) {
    if (!course_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    return {
      isSuccess: true,
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    };
  },
  studentIdValidator(student_id) {
    if (!student_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    return {
      isSuccess: true,
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    }
  },
  updateValidator(course_id, student_id, rating) {
    if (!course_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    if (!student_id) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    if (rating > 5) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.RATING_IS_MORE_THAN_5_STARS
      }
    }
    if (rating < 1) {
      return {
        isSuccess: false,
        code: subscriberResponseEnum.RATING_IS_LESS_THAN_1_STARS
      }
    }
    return {
      isSuccess: true,
      code: subscriberResponseEnum.VALIDATOR_IS_SUCCESS
    }
  }
}

export default subscriberValidator;