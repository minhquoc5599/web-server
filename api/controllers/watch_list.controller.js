import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import watchListService from '../../bussiness/services/watch_list.service.js';
import watchListResponseEnum from '../../utils/enums/watchListResponseEnum.js';
import jwt from 'jsonwebtoken'
import auth from '../middlewares/auth.js';
const router = Router();

router.get('/watch-lists', auth(['student']), async(req, res) => {
  const page = Number(req.query.page) || 1;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };
  const student_id = user.id;
  const result = await watchListService.getAllByStudentId(student_id, page)
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.get('/watch-list', auth(), async(req, res) => {
  const course_id = req.query.courseid;
  const accessToken = req.cookies['access_token'];
  let user = null;
  if (accessToken) {
    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    user = decoded.user;
  };

  if (user) {
    const student_id = user.id;
    const result = await watchListService.getOneByCourseIdStudentId(course_id, student_id);
    if (result.code !== watchListResponseEnum.SUCCESS) {
      return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
    }
    res.status(httpStatusCode.SUCCESS.OK).json(result).end();
  }
  return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).end();

});

router.delete('/delete-watch-list/:id', auth(['student']), async(req, res) => {
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

router.post('/add-watch-list', auth(['student']), async(req, res) => {
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