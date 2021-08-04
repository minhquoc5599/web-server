import userResponseEnum from "../../utils/enums/userResponseEnum.js";

const userValidator = (email, name) => {
  if (!email) {
    return {
      code: userResponseEnum.EMAIL_IS_EMPTY
    }
  }
  if (!name) {
    return {
      code: userResponseEnum.NAME_IS_EMPTY
    }
  }
  return {
    code: userResponseEnum.VALIDATOR_IS_SUCCESS
  }
}

export default userValidator;