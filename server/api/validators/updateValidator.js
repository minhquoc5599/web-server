import updateResponseEnum from "../../utils/enums/updateResponseEnum.js"

const updateValidator = (name, password) => {
  if (!name || name === '') {
    return { isSuccess: false, code: updateResponseEnum.NAME_IS_EMPTY };
  }
  if (password && password !== '' && password.length < 6) {
    return { isSuccess: false, code: updateResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS };
  }
  return { isSuccess: true, code: updateResponseEnum.PASSWORD_IS_EMPTY };
}

export default updateValidator;