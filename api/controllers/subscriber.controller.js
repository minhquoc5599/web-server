import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import subscriberService from '../../bussiness/services/subscriber.service.js';

const router = Router();
router.post('/add-subscriber', async(req, res) => {
  const { course_id, student_id } = req.body;
  const result = await subscriberService.addSubscriber(course_id, student_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
})
router.get('/subscribers-by-course-id/:id', async(req, res) => {
  const course_id = req.params.id;
  const result = await subscriberService.getSubscribersByCourseId(course_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/subscribers-rating-by-course-id/:id', async(req, res) => {
  const course_id = req.params.id;
  const result = await subscriberService.getSubscribersRatingByCourseId(course_id)
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/update-subscriber', async(req, res) => {
  const { course_id, student_id, rating, comment } = req.body;
  const result = await subscriberService.updateSubscriber(course_id, student_id, rating, comment);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
})

export default router;