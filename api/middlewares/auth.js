
import jwt from 'jsonwebtoken';

import User from "../../models/user.js";
import jwtEnum from '../../utils/enums/jwtEnum.js';
import entityRepository from "../../data/repositories/entity.repository.js";
import httpStatusCode from '../../utils/enums/httpStatusCode.js';

const _entityRepository = entityRepository(User);

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return async (req, res, next) => {
    // Get token from cookie
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    const dateNow = Date.now();
    // Check if not token
    if (!accessToken) {
      return res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
        .json({
          isSuccess: false,
          code: jwtEnum.NO_TOKEN
        });
    }
    // Token whether is valid or not
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (roles.length && !roles.includes(decoded.user.role)) {
        // user's role is not authorized
        return res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
          .json({ code: jwtEnum.UNAUTHORIZED })
          .end();
      }
      const exp = decoded.exp;
      if (dateNow >= exp * 1000) {
        const user = await _entityRepository.getOneById(decoded.user.id);
        const refreshTokenExpiryTime = user.refresh_token_expiry_time;
        if (refreshToken !== user.refresh_token || dateNow >= refreshTokenExpiryTime) {
          return res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
            .json({
              code: jwtEnum.TOKEN_IS_EXPIRED
            })
            .end();
        }
      }
      req.user = decoded.user;
      next();
    }
    catch (err) {
      return res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
        .json({
          code: jwtEnum.TOKEN_INVALID
        }).end();
    }
  };
}

export default auth;