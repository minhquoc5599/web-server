import operatorType from '../../utils/enums/operatorType.js';
import roleRepository from '../../data/repositories/role.repository.js';
import roleResponseEnum from '../../utils/enums/roleResponseEnum.js';

const roleService = {
  async getRoleById(id) {
    const role = await roleRepository.getRoleById(id);
    if (role === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      };
    }

    // Check role is available or not
    if (!role) {
      return {
        isSuccess: false,
        code: roleResponseEnum.ID_IS_INVALID
      }
    }

    return {
      isSuccess: true,
      role,
      code: operatorType.SUCCESS.READ
    }
  }
}

export default roleService;