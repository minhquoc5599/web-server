import registerResponseEnum from '../../utils/enums/registerResponseEnum.js';
import emailValidator from './emailValidator.js';

const registerValidator = (email, name, password) => {
  if (!name) {
    return { isSuccess: false, code: registerResponseEnum.NAME_IS_EMPTY };
  }
  if (!email) {
    return { isSuccess: false, code: registerResponseEnum.EMAIL_IS_EMPTY };
  }
  if (!emailValidator(email)) {
    return { isSuccess: false, code: registerResponseEnum.EMAIL_IS_NOT_VALID };
  }
  if (!password) {
    return { isSuccess: false, code: registerResponseEnum.PASSWORD_IS_EMPTY };
  }
  if (password.length < 6) {
    return { isSuccess: false, code: registerResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS }
  }
  return { isSuccess: true, code: registerResponseEnum.SUCCESS };
}

export default registerValidator;