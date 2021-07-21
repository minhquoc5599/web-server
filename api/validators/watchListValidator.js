import watchListResponseEnum from "../../utils/enums/watchListResponseEnum.js";

const watchListValidator = {
  addValidator(course_id, student_id) {
    if (!course_id) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    if (!student_id) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.STUDENT_ID_IS_EMPTY
      }
    }
    return {
      isSuccess: true,
      code: watchListResponseEnum.VALIDATOR_IS_SUCCESS
    };
  },
  studentIdValidator(student_id) {
    if (!student_id) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.COURSE_ID_IS_EMPTY
      }
    }
    return {
      isSuccess: true,
      code: watchListResponseEnum.VALIDATOR_IS_SUCCESS
    };
  }
}

export default watchListValidator;