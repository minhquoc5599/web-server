import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import Role from "../../models/role.js";
import jwtEnum from "../../utils/enums/jwtEnum.js";
import entityRepository from "../../data/repositories/entity.repository.js";

const _entityRepository = entityRepository(Role);

const jwtGenerator = {
  async createToken(user) {
    const role = await _entityRepository.getOneById(user.role);
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: role.name,
        exp: Math.floor(Date.now() / 1000) + 30,
        iat: Math.floor(Date.now()),
      },
    };
    let result;
    await new Promise((res, rej) => {
      jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
        if (err) {
          result = {
            isSuccess: false,
            code: jwtEnum.SERVER_ERROR,
          };
        }
        result = {
          isSuccess: true,
          code: jwtEnum.SUCCESS,
          accessToken: token,
          refreshToken: uuidv4(),
        };
        res("success");
      });
    });
    return result;
  },
};

export default jwtGenerator;
