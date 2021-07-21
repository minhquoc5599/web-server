import { Router } from 'express';

import auth from "../middlewares/auth.js";
import userService from '../../bussiness/services/user.service.js';
import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import logInResponseEnum from '../../utils/enums/logInResponseEnum.js';
import registerResponseEnum from '../../utils/enums/registerResponseEnum.js';

const router = Router();

router.post('/auth/user', async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  if (result.code !== logInResponseEnum.SUCCESS) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
    return;
  }
  // 2 months = 5259600000 miliseconds
  res.cookie('refresh_token', result.refreshToken, { maxAge: 5259600000, path: "/", httpOnly: true });
  res.cookie('access_token', result.accessToken, { maxAge: 5259600000, path: "/", httpOnly: true });
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).end();
})

router.post('/user', async (req, res) => {
  const { email, name, password, rePassword } = req.body;
  const result = await userService.register(email, name, password, rePassword);
  if (result.code !== registerResponseEnum.SUCCESS) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
    return;
  }
  // 2 months = 5259600000 miliseconds
  res.cookie('refresh_token', result.refreshToken, { maxAge: 5259600000, path: "/", httpOnly: true });
  res.cookie('access_token', result.accessToken, { maxAge: 5259600000, path: "/", httpOnly: true });
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).end();
})

router.delete("/refresh-token", auth, async (req, res) => {
  res.clearCookie("refresh_token");
  res.clearCookie("access_token");
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).end();
})

router.get("/user", auth, async (req, res) => {
  res.status(httpStatusCode.SUCCESS.OK).end();
})

router.post('/auth/token', auth, async (req, res) => {
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).end();
})
export default router;