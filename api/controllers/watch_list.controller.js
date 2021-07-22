import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import watchListService from '../../bussiness/services/watch_list.service.js';
import watchListResponseEnum from '../../utils/enums/watchListResponseEnum.js';

const router = Router();

router.post('/add-watch-list', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await watchListService.addOne(course_id, student_id);
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/watch-lists/:id', async(req, res) => {
  const student_id = req.params.id;
  const result = await watchListService.getAllByStudentId(student_id)
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.delete('/delete-watch-list', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await watchListService.deleteOne(course_id, student_id);
  if (result.code !== watchListResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
});

export default router;