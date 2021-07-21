import User from '../../models/user.js'
import operatorType from '../../utils/enums/operatorType.js';

const userRepository = {
  //CREATE

  //READ
  getOneByEmail(email) {
    return User.findOne({ email });
  },
  getRefreshToken(refresh_token) {
    return User.findOne({ refresh_token: refresh_token });
  },

  //UPDATE

  //DELETE
  deleteOne(email) {
    return User.deleteOne({ email: email });
  }
}

export default userRepository;