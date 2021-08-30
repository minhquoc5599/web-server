import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import categoryService from '../../bussiness/services/category.service.js';
import rootCategoryService from '../../bussiness/services/root_category.service.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import auth from "../middlewares/auth.js";

const router = Router();
router.get('/categories/menu', async(req, res) => {
  const result = await rootCategoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/categories', auth(['admin']), async(req, res) => {
  const result = await categoryService.getAll();
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.get('/categories/:page', auth(['admin']), async(req, res) => {
  const page = Number(req.params.page) || 1;
  const result = await rootCategoryService.getAllByPage(page);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result);
});

router.post('/root-category', auth(['admin']), async(req, res) => {
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

router.put('/root-category/name', auth(['admin']), async(req, res) => {
  const { id, name } = req.body;
  const result = await rootCategoryService.updateEntityName(id, name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/root-category/status', auth(['admin']), async(req, res) => {
  const { id, status } = req.body;
  const result = await rootCategoryService.updateEntityStatus(id, status);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.delete('/root-category/:id', auth(['admin']), async(req, res) => {
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

router.post('/category', auth(['admin']), async(req, res) => {
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

router.put('/category/name', auth(['admin']), async(req, res) => {
  const { id, name } = req.body;
  const result = await categoryService.updateEntityName(id, name);
  if (result.code !== categoryResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

router.put('/category/status', auth(['admin']), async(req, res) => {
  const { id, status } = req.body;
  const result = await categoryService.updateEntityStatus(id, status);
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