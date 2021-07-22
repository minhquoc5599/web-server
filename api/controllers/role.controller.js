import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import roleService from '../../bussiness/services/role.service.js';
import roleResponseEnum from '../../utils/enums/roleResponseEnum.js';

const router = Router();

router.get('/role/:id', async(req, res) => {
  const id = req.params.id;
  const result = await roleService.getOneById(id);
  if (result.code !== roleResponseEnum.SUCCESS) {
    return res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST).send(result).end();
  }
  res.status(httpStatusCode.SUCCESS.OK).json(result).end();
});

export default router;