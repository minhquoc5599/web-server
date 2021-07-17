import logInResponseEnum from '../../utils/enums/logInResponseEnum.js';
import emailValidator from './emailValidator.js';

const logInValidator = (email, password) => {
  if (!email) {
    return { isSuccess: false, code: logInResponseEnum.EMAIL_IS_EMPTY };
  }
  if (!emailValidator(email)) {
    return { isSuccess: false, code: logInResponseEnum.EMAIL_IS_NOT_VALID };
  }
  if (!password) {
    return { isSuccess: false, code: logInResponseEnum.PASSWORD_IS_EMPTY };
  }
  if (password.length < 6) {
    return { isSuccess: false, code: logInResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS };
  }
  return { isSuccess: true, code: logInResponseEnum.SUCCESS };
}

export default logInValidator;