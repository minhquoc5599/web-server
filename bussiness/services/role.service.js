import roleRepository from '../../data/repositories/role.repository.js';
import roleResponseEnum from '../../utils/enums/roleResponseEnum.js';

const roleService = {
  async getOneById(id) {
    try {
      const role = await roleRepository.getOneById(id);

      // Check role is available or not
      if (!role) {
        return {
          code: roleResponseEnum.ID_IS_INVALID
        }
      }
      return {
        code: roleResponseEnum.SUCCESS,
        role
      }
    } catch (e) {
      return {
        code: roleResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default roleService;