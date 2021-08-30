import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../../models/user.js";
import jwtGenerator from "../../api/security/jwtGenerator.js";
import logInValidator from "../../api/validators/logInValidator.js";
import registerValidator from "../../api/validators/registerValidator.js";
import updateOneUserValidator from "../../api/validators/updateOneUserValidator.js";
import userRepository from "../../data/repositories/user.repository.js";
import roleRepository from "../../data/repositories/role.repository.js";
import entityRepository from "../../data/repositories/entity.repository.js";
import logInResponseEnum from "../../utils/enums/logInResponseEnum.js";
import registerResponseEnum from "../../utils/enums/registerResponseEnum.js";
import updateOneUserResponseEnum from "../../utils/enums/updateOneUserResponseEnum.js";
import jwtEnum from "../../utils/enums/jwtEnum.js";
import userResponseEnum from "../../utils/enums/userResponseEnum.js";
import roleResponseEnum from "../../utils/enums/roleResponseEnum.js";
import userValidator from "../../api/validators/userValidator.js";

const _entityRepository = entityRepository(User);

const userService = {
  async login(email, password) {
    // validate request
    try {
      const resultValidator = logInValidator(email, password);
      if (resultValidator.code !== logInResponseEnum.SUCCESS)
        return resultValidator;
      // Find email in DB
      const user = await userRepository.getOneByEmail(email);
      if (!user || user.status === false) {
        return {
          code: logInResponseEnum.WRONG_EMAIL,
        };
      }
      // Comparate password from DB and password from request
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          code: logInResponseEnum.WRONG_PASSWORD,
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
        refreshToken: resultJwtGenerator.refreshToken,
      };
    } catch (e) {
      return {
        code: logInResponseEnum.SERVER_ERROR,
      };
    }
  },
  async updateUser(email, password, name) {
    // validate request
    try {
      const resultValidator = logInValidator(email, password);
      console.log(password);
      if (
        resultValidator.code !== logInResponseEnum.SUCCESS &&
        resultValidator.code !== logInResponseEnum.PASSWORD_IS_EMPTY
      )
        return resultValidator;
      // Find email in DB
      const user = await userRepository.getOneByEmail(email);
      if (!user || user.status === false) {
        return {
          code: logInResponseEnum.WRONG_EMAIL,
        };
      }
      if (resultValidator.code !== logInResponseEnum.PASSWORD_IS_EMPTY) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        user.password = password;
      }
      user.name = name;
      await _entityRepository.updateOne(user);
      return {
        code: logInResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: logInResponseEnum.SERVER_ERROR,
      };
    }
  },
  async register(email, name, password, rePassword) {
    try {
      // validate request
      const resultValidator = registerValidator(
        email,
        name,
        password,
        rePassword
      );
      if (resultValidator.code !== registerResponseEnum.SUCCESS)
        return resultValidator;
      // Find email in DB
      let user = await userRepository.getOneByEmail(email);
      if (user) {
        return {
          code: registerResponseEnum.EMAIL_IS_UNAVAILABLE,
        };
      }
      if (password !== rePassword) {
        return {
          code: registerResponseEnum.PASSWORD_DOES_NOT_MATCH,
        };
      }

      // Generate Token
      const role = await roleRepository.getOneByName("student");
      const payload = {
        user: {
          email: email,
          name: name,
          role: role.id,
          password: password,
        },
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "huskarit99@gmail.com", // generated ethereal user
          pass: "Huskarit_1999", // generated ethereal password
        },
      });
      const url = `http://localhost:5000/api/user-controller/confirmation/${token}`;
      const mailOption = {
        from: "huskarit99@gmail.com",
        to: `${name} <${email}>`,
        subject: "Confirmation Email",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <h3>This confirmation email is going to be invalid in 10 minutes</h3>
        <p>Thank you for registering. Please confirm your email by clicking on the under button</p>
        <form action=${url} method="post">
          <button type="submit">Confirm</button>
          </form>
        </div>`,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });

      return {
        code: registerResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: registerResponseEnum.SERVER_ERROR,
      };
    }
  },
  async confirmEmail(token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const dateNow = Date.now();
      const exp = decoded.exp;
      if (dateNow >= exp * 1000) {
        return {
          code: jwtEnum.TOKEN_IS_EXPIRED,
        };
      } else {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(decoded.user.password, salt);
        const user = new User({
          email: decoded.user.email,
          name: decoded.user.name,
          password: password,
          role: decoded.user.role,
        });
        console.log(user);
        await _entityRepository.addOne(user);
        return {
          code: registerResponseEnum.SUCCESS,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        code: registerResponseEnum.SERVER_ERROR,
      };
    }
  },
  async getSelfInfo(id) {
    const user = await userRepository.getOneById(id);
    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  },

  async getAllByRoleName(role_name, page) {
    try {
      const role = await roleRepository.getOneByName(role_name);
      if (!role) {
        return {
          code: roleResponseEnum.ROLE_NAME_IS_UNAVAILABLE,
        };
      }
      const users = await userRepository.getAllByRoleId(role._id);

      // Pagination
      let tmp = [];
      const page_number = [];
      let _i = 0;
      for (var i = 0; i < users.length; i++) {
        if (Math.floor(_i / 5) == page - 1) {
          const data = users[_i];
          tmp.push(data);
        }
        if (_i / 5 == Math.floor(_i / 5)) {
          page_number.push(_i / 5 + 1);
        }
        _i++;
      }
      return {
        code: userResponseEnum.SUCCESS,
        users: tmp,
        page_number,
      };
    } catch (e) {
      return {
        code: userResponseEnum.SERVER_ERROR,
      };
    }
  },
  async getAllByRoleTeacher() {
    try {
      const role = await roleRepository.getOneByName("teacher");
      if (!role) {
        return {
          code: roleResponseEnum.ROLE_NAME_IS_UNAVAILABLE,
        };
      }
      const teachers = await userRepository.getAllByRoleId(role._id);
      return {
        code: userResponseEnum.SUCCESS,
        teachers: teachers,
      };
    } catch (e) {
      return {
        code: userResponseEnum.SERVER_ERROR,
      };
    }
  },

  async updateOneById(request) {
    try {
      if (request.status) {
        await _entityRepository.updateOneById(request.id, {
          status: request.status,
          refresh_token: "",
          refresh_token_expiry_time: 0,
        });
      } else {
        await _entityRepository.updateOneById(request.id, {
          status: request.status,
        });
      }
      return {
        code: userResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: userResponseEnum.SERVER_ERROR,
      };
    }
  },
  async addOne(email, name) {
    try {
      // validate request
      const resultValidator = userValidator(email, name);
      if (resultValidator.code !== userResponseEnum.VALIDATOR_IS_SUCCESS)
        return resultValidator;
      email = email.trim();
      name = name.trim();
      let user = await userRepository.getOneByEmail(email);
      if (user) {
        return {
          code: userResponseEnum.EMAIL_IS_UNAVAILABLE,
        };
      }
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("12345678", salt);
      const role = await roleRepository.getOneByName("teacher");
      user = new User({
        email: email,
        name: name,
        role: role._id,
        password: password,
      });
      await _entityRepository.addOne(user);
      return {
        code: userResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: userResponseEnum.SERVER_ERROR,
      };
    }
  },
};

export default userService;
