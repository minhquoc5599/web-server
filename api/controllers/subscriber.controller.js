import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import subscriberService from '../../bussiness/services/subscriber.service.js';
import subscriberResponseEnum from '../../utils/enums/subscriberResponseEnum.js';

const router = Router();
router.post('/subscribe', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await subscriberService.subscribe(course_id, student_id)
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/subscribers/:id', async(req, res) => {
  const course_id = req.params.id;
  const result = await subscriberService.getAllByCourseId(course_id);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/rating', async(req, res) => {
  const { course_id, student_id, rating, comment } = req.body;
  const result = await subscriberService.rating(course_id, student_id, rating, comment);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

export default router;