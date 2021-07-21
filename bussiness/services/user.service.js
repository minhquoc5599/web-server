import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../../models/user.js';
import operatorType from '../../utils/enums/operatorType.js'
import jwtGenerator from '../../api/security/jwtGenerator.js';
import logInValidator from '../../api/validators/logInValidator.js';
import registerValidator from '../../api/validators/registerValidator.js';
import updateValidator from '../../api/validators/updateValidator.js';
import userRepository from '../../data/repositories/user.repository.js';
import roleRepository from '../../data/repositories/role.repository.js';
import entityRepository from '../../data/repositories/entity.repository.js';
import logInResponseEnum from '../../utils/enums/logInResponseEnum.js';
import registerResponseEnum from '../../utils/enums/registerResponseEnum.js';
import updateResponseEnum from '../../utils/enums/updateResponseEnum.js';
import role from '../../models/role.js';

const _entityRepository = entityRepository(User);

const userService = {
  async login(email, password) {
    // validate request
    try {
      const resultValidator = logInValidator(email, password);
      if (resultValidator !== registerResponseEnum.SUCCESS) return resultValidator;
      // Find email in DB
      const user = await userRepository.getOneByEmail(email);
      if (!user) {
        return {
          code: logInResponseEnum.WRONG_EMAIL
        };
      }
      // Comparate password from DB and password from request
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          code: logInResponseEnum.WRONG_PASSWORD
        };
      }
      // Generate Token
      const resultJwtGenerator = await jwtGenerator.createToken(user);
      if (!resultJwtGenerator.isSuccess) resultJwtGenerator;
      // Save refresh token in DB
      const dateNow = Date.now() + 5259600000;
      user.refresh_token = resultJwtGenerator.refreshToken;
      user.refresh_token_expiry_time = dateNow;
      await _entityRepository.updateOne(user);
      return {
        email: user.email,
        code: logInResponseEnum.SUCCESS,
        accessToken: resultJwtGenerator.accessToken,
        refreshToken: resultJwtGenerator.refreshToken
      };
    }
    catch (e) {
      return {
        code: logInResponseEnum.SERVER_ERROR
      }
    }
  },
  async register(email, name, password, rePassword) {
    try {
      // validate request
      const resultValidator = registerValidator(email, name, password, rePassword);
      if (resultValidator.code !== registerResponseEnum.SUCCESS) return resultValidator;
      // Find email in DB
      let user = await userRepository.getOneByEmail(email);
      if (user) {
        return {
          code: registerResponseEnum.EMAIL_IS_UNAVAILABLE
        };
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const role = await roleRepository.getOneByName("student");
      user = new User({ email, name, password, role: role.id });
      // Generate Token
      const resultJwtGenerator = await jwtGenerator.createToken(user);
      if (!resultJwtGenerator.isSuccess) resultJwtGenerator;
      // Save refresh token in DB
      const dateNow = Date.now() + 5259600000;
      user.refresh_token = resultJwtGenerator.refreshToken;
      user.refresh_token_expiry_time = dateNow;
      await _entityRepository.addOne(user);
      return {
        code: registerResponseEnum.SUCCESS,
        accessToken: resultJwtGenerator.accessToken,
        refreshToken: resultJwtGenerator.refreshToken
      };
    }
    catch (e) {
      return {
        code: registerResponseEnum.SERVER_ERROR
      }
    }
  },
  async getSelfInfo(id) {
    const user = await _entityRepository.getOneById(id);
    return {
      user
    }
  }
}

export default userService;