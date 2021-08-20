import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";

const courseValidator = {
  addOne(name) {
    if (name === "" || name === undefined || name === null) {
      return {
        isSuccess: false,
        code: courseResponseEnum.NAME_IS_EMPTY,
      };
    }
    return {
      isSuccess: true,
      code: courseResponseEnum.SUCCESS,
    };
  },
};

export default courseValidator;
