import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import watchListService from '../../bussiness/services/watch_list.service.js';
import watchListResponseEnum from '../../utils/enums/watchListResponseEnum.js';
import jwt from 'jsonwebtoken'
const router = Router();

router.get('/watch-lists/:id', async(req, res) => {
  const student_id = req.params.id;
  const result = await watchListService.getAllByStudentId(student_id)
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/watch-list', async(req, res) => {
  const course_id = req.query.courseid;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const result = await watchListService.getOneByCourseIdStudentId(course_id, student_id);
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.delete('/delete-watch-list/:id', async(req, res) => {
  const course_id = req.params.id;
  console.log(course_id);
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const result = await watchListService.deleteOne(course_id, student_id);
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
});

router.post('/add-watch-list', async(req, res) => {
  const { course_id } = req.body;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const result = await watchListService.addOne(course_id, student_id);
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

export default router;