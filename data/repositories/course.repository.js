import Course from "../../models/course.js";

const courseRepository = {
  //CREATE

  //READ
  getAllByTeacherId(id) {
    return Course.find({ teacher_id: id, status: true });
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

  getAllByName(name) {
    return Course.find({ $text: { $search: name }, status: true });
  },
  //UPDATE

  //DELETE
};

export default courseRepository;
