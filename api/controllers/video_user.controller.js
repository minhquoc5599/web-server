import { Router } from "express";

import auth from "../middlewares/auth.js";
import httpStatusCode from "../../utils/enums/httpStatusCode.js";
import videoUserService from "../../bussiness/services/video_user.service.js";

const router = Router();

router.get("/videos-users", auth(), async (req, res) => {
  const result = await videoUserService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res
      .status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .send(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).send(result).end();
});

export default router;
