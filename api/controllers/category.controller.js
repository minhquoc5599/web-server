import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import categoryService from '../../bussiness/services/category.service.js';
import rootCategoryService from '../../bussiness/services/root_category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import auth from "../middlewares/auth.js";

const router = Router();
router.get('/category/menu', async(req, res) => {
  const result = await rootCategoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/category/category', async(req, res) => {
  const page = Number(req.query.page) || 1;
  const result = await rootCategoryService.getAllByPage(page);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/category/add/root-category', auth(), async(req, res) => {
  const { name } = req.body;
  const result = await rootCategoryService.addOne(name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

// router.get('/root-category/:id', async(req, res) => {
//   const id = req.params.id
//   const result = await rootCategoryService.getOneById(id);
//   if (result.code !== categoryResponseEnum.SUCCESS) {
//     return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
//   }
//   res.status(httpStatusCode.SUCCESS.OK).json(result).end();
// });

router.put('/category/update/root-category', auth(), async(req, res) => {
  const { id, name } = req.body;
  const result = await rootCategoryService.updateOne(id, name)
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.delete('/category/delete/root-category/:id', auth(), async(req, res) => {
  const id = req.params.id;
  const result = await rootCategoryService.deleteOne(id);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
})

// router.get('/categories', async(req, res) => {
//   const result = await categoryService.getAll();
//   if (result.code !== categoryResponseEnum.SUCCESS) {
//     return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
//   }
//   res.status(httpStatusCode.SUCCESS.OK).json(result).end();
// });

router.post('/category/add/category', auth(), async(req, res) => {
  const { name, root_category_id } = req.body;
  const result = await categoryService.addOne(name, root_category_id);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.CREATED).json(result).end();
});

// router.get('/category/:id', async(req, res) => {
//   const id = req.params.id;
//   const result = await categoryService.getOnebyId(id);
//   if (result !== categoryResponseEnum.SUCCESS) {
//     return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
//   }
//   res.status(httpStatusCode.SUCCESS.OK).json(result).end();
// });

router.put('/category/update/category', auth(), async(req, res) => {
  const { id, name } = req.body;
  const result = await categoryService.updateOne(id, name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.delete('/category/delete/category/:id', auth(), async(req, res) => {
  const id = req.params.id;
  const result = await categoryService.deleteOne(id);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.NO_CONTENT).send(result).end();
})

export default router;