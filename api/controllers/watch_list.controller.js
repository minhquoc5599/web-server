import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import watchListService from '../../bussiness/services/watch_list.service.js';

const router = Router();

router.post('/add-watch-list', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await watchListService.addWatchList(course_id, student_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/watch-lists-by-student-id', async(req, res) => {
  const { student_id } = req.body;
  const result = await watchListService.getWatchListsByStudentId(student_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.delete('/delete-watch-list', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await watchListService.deleteWatchList(course_id, student_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

export default router;