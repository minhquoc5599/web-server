import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import rootCategoryService from '../../bussiness/services/root_category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const router = Router();

router.get('/root-categories', async(req, res) => {
  const result = await rootCategoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/add-root-category', async(req, res) => {
  const name = req.body;
  const result = await rootCategoryService.addRootCategory(name);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .send(result);
});

router.get('/root-category-by-id/:id', async(req, res) => {
  const id = req.params.id
  const result = await rootCategoryService.getRootCategoriesById(id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .json(result);
})
export default router;