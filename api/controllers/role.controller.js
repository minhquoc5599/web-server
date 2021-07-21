import { Router } from 'express';

import httpStatusCode from '../../utils/enums/httpStatusCode.js';
import roleService from '../../bussiness/services/role.service.js';

const router = Router();

router.get('/role-by-id/:id', async(req, res) => {
  const id = req.params.id;
  const result = await roleService.getRoleById(id);
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