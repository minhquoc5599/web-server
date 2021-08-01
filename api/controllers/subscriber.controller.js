import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import subscriberService from '../../bussiness/services/subscriber.service.js';
import subscriberResponseEnum from '../../utils/enums/subscriberResponseEnum.js';
import jwt from 'jsonwebtoken'
const router = Router();
router.post('/subscribe', async(req, res) => {
  const { course_id } = req.body;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const result = await subscriberService.subscribe(course_id, student_id)
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/subscribers/:id', async(req, res) => {
  const course_id = req.params.id;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const result = await subscriberService.getAllByCourseId(course_id, user);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/rating', async(req, res) => {
  const { course_id, rating, comment } = req.body;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const name = user.name;
  const result = await subscriberService.rating(course_id, student_id, rating, comment, name);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

export default router;