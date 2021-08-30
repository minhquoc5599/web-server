import { Router } from 'express';
import categoryService from '../../bussiness/services/category.service.js';
import chatbotService from '../../bussiness/services/chatbot.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import courseResponseEnum from '../../utils/enums/courseResponseEnum.js';
import httpStatusCode from '../../utils/enums/httpStatusCode.js';

const router = Router();

router.post('/webhook', chatbotService.postWebHook);

router.get('/webhook', chatbotService.getWebHook);

router.post('/setup-profile', chatbotService.setupProfile);

router.post('/setup-persistent-menu', chatbotService.setupPersistentMenu);

router.get('/categories', async(req, res) => {
  const result = await categoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.get('/courses/:categoryid', async(req, res) => {
  const id = req.params.categoryid;
  const result = await chatbotService.getCoursesByCategoryId({ id: id });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/search', async(req, res) => {
  const keyword = req.query.keyword;
  const result = await chatbotService.getCoursesByName({ keyword: keyword });
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/course/:id', async(req, res) => {
  const id = req.params.id || 0;
  const result = await chatbotService.getCourseById(id);
  if (result.code !== courseResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});
export default router;