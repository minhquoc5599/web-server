import Role from "../../models/role.js";

const roleRepository = {
  //CREATE

  //READ
  getOneById(id) {
    return Role.findOne({ _id: id });
  },
  getOneByName(name) {
    return Role.findOne({ name });
  },

  //UPDATE

  //DELETE

};

export default roleRepository;