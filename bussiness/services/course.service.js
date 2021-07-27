import Course from "../../models/course.js";
import User from '../../models/user.js';
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from '../../data/repositories/entity.repository.js';

const _entityRepository = entityRepository(Course);
const userRepository = entityRepository(User);

const countryService = {
  async getAll() {
    try {
      const courses = await _entityRepository.getAll();
      const tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = await userRepository.getOneById(tmp[i].teacher_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses
      }
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
    }
  },

  async getOneById(request) {
    try {
      const course = await _entityRepository.getOneById(request.id);
      const teacher = await userRepository.getOneById(course.teacher_id);
      course['teacher_name'] = teacher.name;
      course['teacher_email'] = teacher.email;
      return {
        code: courseResponseEnum.SUCCESS,
        course
      }
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
    }
  },

  async getAllByCategoryId(request) {
    try {
      const courses = await _entityRepository.getAllByCategoryId({ category_id: request.id });
      const tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = await userRepository.getOneById(tmp[i].teacher_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses
      }
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR
      }
    }
  },

  async getAllByKeyword(request) {
    try {
      const courses = await _entityRepository.getAllByName(request.keyword);
      const tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = await userRepository.getOneById(tmp[i].teacher_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses
      }
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR
      }
    }
  },

  addOne(request) {
    // return _entityRepository.addOne(request);
  },

  updateOne(request) {
    // if (this.isCountryAvailable(country.country_id)) {
    //   return _entityRepository.updateOne(country, country.country_id);
    // }
    // else {
    //   return operatorType.NOT_AVAILABLE;
    // }
  },

  async deleteOne(request) {
    try {
      const course = await _entityRepository.deleteOne({ id: request.id });
      return {
        code: courseResponseEnum.SUCCESS,
        course: course
      }
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
    }
  },
};

export default countryService;