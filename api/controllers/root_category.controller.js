import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import rootCategoryService from '../../bussiness/services/root_category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const router = Router();

router.get('/root-categories', async(req, res) => {
  const result = await rootCategoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/add-root-category', async(req, res) => {
  const { name } = req.body;
  const result = await rootCategoryService.addOne(name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

router.get('/root-category/:id', async(req, res) => {
  const id = req.params.id
  const result = await rootCategoryService.getOneById(id);
  if (result !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/update-root-category', async(req, res) => {
  const { id, name } = req.body;
  const result = await rootCategoryService.updateOne(id, name)
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.delete('/delete-root-category', async(req, res) => {
  const { id } = req.body;
  const result = await rootCategoryService.deleteOne(id);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
})

export default router;