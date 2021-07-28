import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import courseService from '../../bussiness/services/course.service.js';
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";

const router = Router();

router.get('/courses', async(req, res) => {
  const result = await courseService.getAll();
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/course/:id', async(req, res) => {
  const id = req.params.id || 0;
  const result = await courseService.getOneById({ id: id });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/courses/:id', async(req, res) => {
  const id = req.params.id;
  const result = await courseService.getAllByCategoryId({ id: id });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/search', async(req, res) => {
  const keyword = req.query.keyword;
  const result = await courseService.getAllByKeyword({ keyword: keyword });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/criteria', async(req, res) => {
  const result = await courseService.getAllByCriteria();
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
})

router.post('/course', async(req, res) => {
  // const course = req.body;
  // if (await courseService.addOne(course) === operatorType.FAIL.CREATE) {
  //   res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
  //     .json({
  //       message: "Creating from DB went wrong !!"
  //     })
  //     .end();
  // }
  // res.status(httpStatusCode.SUCCESS.CREATED).json(course);
})

router.put('/course', async(req, res) => {
  // const course = req.body;
  // const ret = await courseService.updateOne(course);
  // if (ret === operatorType.FAIL.UPDATE) {
  //   res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
  //     .json({
  //       message: "Updating from DB went wrong !!"
  //     })
  //     .end();
  // }
  // else if (ret === operatorType.NOT_AVAILABLE) {
  //   res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
  //     .json({
  //       message: "This course is not available !!"
  //     })
  //     .end();
  // }
  // res.status(httpStatusCode.SUCCESS.CREATED).json(course);
})

router.delete('/course/:id', async(req, res) => {
  const id = req.params.id || 0;
  const result = await courseService.deleteOne({ id: id });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
})

export default router;