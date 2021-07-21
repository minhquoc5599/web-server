import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import categoryService from '../../bussiness/services/category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';

const router = Router();

router.get('/categories', async(req, res) => {
  const result = await categoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/add-category', async(req, res) => {
  const { name, root_category_id } = req.body;
  const result = await categoryService.addCategory(name, root_category_id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .send(result);
});

router.get('/category-by-id/:id', async(req, res) => {
  const id = req.params.id;
  const result = await categoryService.getCategorybyId(id);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .json(result);
});

router.put('/update-category', async(req, res) => {
  const { id, name } = req.body;
  const result = await categoryService.updateCategory(id, name);
  if (!result.isSuccess) {
    res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
      .json(result)
      .end();
    return;
  }
  res.status(httpStatusCode.SUCCESS.OK)
    .json(result);
});

export default router;