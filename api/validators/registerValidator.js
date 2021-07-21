import registerResponseEnum from '../../utils/enums/registerResponseEnum.js';
import emailValidator from './emailValidator.js';

const registerValidator = (email, name, password, rePassword) => {
  if (!name) {
    return { code: registerResponseEnum.NAME_IS_EMPTY };
  }
  if (!email) {
    return { code: registerResponseEnum.EMAIL_IS_EMPTY };
  }
  if (!emailValidator(email)) {
    return { code: registerResponseEnum.EMAIL_IS_NOT_VALID };
  }
  if (!password) {
    return { code: registerResponseEnum.PASSWORD_IS_EMPTY };
  }
  if (password.length < 6) {
    return { code: registerResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS }
  }
  if (password !== rePassword) {
    return { code: registerResponseEnum.PASSWORD_DOES_NOT_MATCH }
  }

  return { code: registerResponseEnum.SUCCESS };
}

export default registerValidator;