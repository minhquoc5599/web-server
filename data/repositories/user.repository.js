import User from '../../models/user.js'

const userRepository = {
  //CREATE

  //READ
  getOneByEmail(email) {
    return User.findOne({ email });
  },
  getRefreshToken(refresh_token) {
    return User.findOne({ refresh_token: refresh_token });
  },

  getAllByRoleId(role) {
    return User.find({ role: role });
  },

  //UPDATE

  //DELETE
  deleteOne(email) {
    return User.deleteOne({ email: email });
  }
}

export default userRepository;