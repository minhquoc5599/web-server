import { Router } from "express";

import auth from "../middlewares/auth.js";
import httpStatusCode from "../../utils/enums/httpStatusCode.js";
import videoService from "../../bussiness/services/video.service.js";
import videoResponseEnum from "../../utils/enums/videoResponseEnum.js";

const router = Router();

router.post("/video", auth(["teacher"]), async (req, res) => {
  const { course_id, title, video, is_previewed } = req.body;
  const result = await videoService.addOne(
    course_id,
    title,
    video,
    is_previewed
  );
  if (result.code !== videoResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get("/videos/:id", async (req, res) => {
  const course_id = req.params.id;
  const result = await videoService.getAllByCourseId(course_id);
  if (result.code !== videoResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.delete("/video/:id", auth(["teacher"]), async (req, res) => {
  const id = req.params.id;
  const result = await videoService.deleteOne(id);
  if (result.code !== videoResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
});

export default router;
