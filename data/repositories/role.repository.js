import Role from "../../models/role.js";

const roleRepository = {
  //CREATE

  //READ
  getOneByName(name) {
    return Role.findOne({ name });
  },

  //UPDATE

  //DELETE

};

export default roleRepository;