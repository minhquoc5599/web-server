import { Router } from "express";

import httpStatusCode from "../../utils/enums/httpStatusCode.js";
import subscriberService from "../../bussiness/services/subscriber.service.js";
import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.js";

const router = Router();
router.post("/subscribe", auth(["student"]), async (req, res) => {
  const { course_id } = req.body;
  const student_id = req.user.id;
  const result = await subscriberService.subscribe(course_id, student_id);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get("/subscribers/:id", auth(["student"]), async (req, res) => {
  const course_id = req.params.id;
  const result = await subscriberService.getAllByCourseId(course_id, req.user);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.get("/subscribers", auth(["student"]), async (req, res) => {
  const page = Number(req.query.page) || 1;
  const student_id = req.user.id;
  const result = await subscriberService.getAllByStudentId(student_id, page);
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put("/rating", auth(["student"]), async (req, res) => {
  const { course_id, rating, comment } = req.body;
  const student_id = req.user.id;
  const name = req.user.name;
  const result = await subscriberService.rating(
    course_id,
    student_id,
    rating,
    comment,
    name
  );
  if (result.code !== subscriberResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

export default router;
