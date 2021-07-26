import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import categoryService from '../../bussiness/services/category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';

const router = Router();

router.get('/categories', async(req, res) => {
  const result = await categoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.post('/add-category', async(req, res) => {
  const { name, root_category_id } = req.body;
  const result = await categoryService.addOne(name, root_category_id);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/category/:id', async(req, res) => {
  const id = req.params.id;
  const result = await categoryService.getOnebyId(id);
  if (result !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/update-category', async(req, res) => {
  const { id, name } = req.body;
  const result = await categoryService.updateOne(id, name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

export default router;