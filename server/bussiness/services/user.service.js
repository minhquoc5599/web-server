import bcrypt from 'bcryptjs'

import User from '../../models/user.js';
import operatorType from '../../utils/enums/operatorType.js'
import jwtGenerator from '../../api/security/jwtGenerator.js';
import logInValidator from '../../api/validators/logInValidator.js';
import registerValidator from '../../api/validators/registerValidator.js';
import updateValidator from '../../api/validators/updateValidator.js';
import userRepository from '../../data/repositories/user.repository.js';
import logInResponseEnum from '../../utils/enums/logInResponseEnum.js';
import registerResponseEnum from '../../utils/enums/registerResponseEnum.js';
import updateResponseEnum from '../../utils/enums/updateResponseEnum.js';

const userService = {
  async login(email, password) {
    // validate request
    const resultLoginValidator = logInValidator(email, password);
    if (!resultLoginValidator.isSuccess) return resultLoginValidator;

    // Find email in DB
    const user = await userRepository.getUserByEmail(email);
    if (user === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: logInResponseEnum.SERVER_ERROR
      };
    }
    if (!user) {
      return {
        isSuccess: false,
        code: logInResponseEnum.WRONG_EMAIL
      };
    }
    // Comparate password from DB and password from request
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        isSuccess: false,
        code: logInResponseEnum.WRONG_PASSWORD
      };
    }
    // Generate Token
    const { accessToken, refreshToken } = await jwtGenerator.createToken(user);
    if (!accessToken.isSuccess) return accessToken
    if (!refreshToken.isSuccess) return refreshToken

    // Save refresh token in DB
    user.refresh_token = refreshToken.token;
    const addRefreshToken = await userRepository.updateUser(user);
    if (addRefreshToken === operatorType.FAIL.UPDATE) {
      return {
        isSuccess: false,
        code: logInResponseEnum.SERVER_ERROR
      }
    }
    return {
      isSuccess: true,
      email: user.email,
      code: accessToken.code,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token
    };
  },

  async token(refresh_token) {

  }
}

export default userService;