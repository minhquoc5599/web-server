import jwt from 'jsonwebtoken';
import logInResponseEnum from '../../utils/enums/logInResponseEnum.js';

const jwtGenerator = {
  async createToken(user) {
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };
    let accessToken, refreshToken;
    await new Promise((res) => {

      jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '5m'
        },
        (err, token) => {
          if (err) {
            accessToken = {
              isSuccess: false,
              code: logInResponseEnum.SERVER_ERROR
            }
          }
          accessToken = {
            isSuccess: true,
            code: logInResponseEnum.SUCCESS,
            token: token
          };
          res('success');
        }
      )

      jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '2h'
        },
        (err, token) => {
          if (err) {
            refreshToken = {
              isSuccess: false,
              code: logInResponseEnum.SERVER_ERROR
            }
          }
          refreshToken = {
            isSuccess: true,
            code: logInResponseEnum.SUCCESS,
            token: token
          };
          res('success');
        }
      );
    });
    return { accessToken, refreshToken };
  },

  async createAccessToken(user) {

  },
}

export default jwtGenerator;