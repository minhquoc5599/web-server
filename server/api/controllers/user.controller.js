import { Router } from 'express';

import userService from '../../bussiness/services/user.service.js';
import httpStatusCode from '../../utils/enums/httpStatusCode.js';

const router = Router();

router.post('/auth-user', async(req, res) => {
  const { email, password } = req.body;
  const loginResult = await userService.login(email, password);
  if (!loginResult.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(loginResult)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .send(loginResult)
})

router.post('/token-user', async(req, res) => {
  const refresh_token = req.body;
  const getTokenResult = await userService.token(refresh_token);
  if (!getTokenResult.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(getTokenResult)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .send(getTokenResult)
})
export default router;