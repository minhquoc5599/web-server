import User from '../../models/user.js'
import operatorType from '../../utils/enums/operatorType.js';

const userRepository = {
  //CREATE
  addUser(user) {
    return user.save().catch(() => {
      operatorType.FAIL.CREATE
    });
  },

  //READ
  getUsers() {
    return User.find().catch(() =>
      operatorType.FAIL.READ
    );
  },
  getUserById(id) {
    return User.findById(id).catch(() =>
      operatorType.FAIL.READ
    );
  },
  getUserByEmail(email) {
    return User.findOne({ email }).catch(() =>
      operatorType.FAIL.READ
    );
  },
  getUserByRefreshToken(refresh_token) {
    return User.findOne({ refresh_token: refresh_token }).catch(() =>
      operatorType.FAIL.READ
    );
  },

  //UPDATE
  updateUser(user) {
    return user.save().catch(() =>
      operatorType.FAIL.UPDATE
    );
  },

  //DELETE
  deleteUser(email) {
    return User.deleteOne({ email: email }).catch(() =>
      operatorType.FAIL.DELETE
    );
  }
}

export default userRepository;