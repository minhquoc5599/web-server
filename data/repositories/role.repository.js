import Role from '../../models/role.js';
import operatorType from '../../utils/enums/operatorType.js';

const roleRepository = {
  //READ
  getRoleById(id) {
    return Role.findById(id).catch(() => {
      operatorType.FAIL.READ
    });
  }
}

export default roleRepository;