import Course from "../../models/course.js";

const courseRepository = {
  //CREATE

  //READ
  getAllByTeacherId(query) {
    return Course.find(query);
  },

  getOneById(id) {
    return Course.findOne({ _id: id, status: true });
  },

  getAllByCategoryId(query) {
    return Course.find(query);
  },

  getAll() {
    return Course.find({ status: true });
  },

  getOneById(id) {
    return Course.findOne({ _id: id, status: true });
  },

  getAllByName(name) {
    return Course.find({ $text: { $search: name }, status: true });
  },
  //UPDATE

  //DELETE
};

export default courseRepository;