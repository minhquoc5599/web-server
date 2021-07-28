import Course from "../../models/course.js";
import User from '../../models/user.js';
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from '../../data/repositories/entity.repository.js';
import categoryRepository from "../../data/repositories/category.repository.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";

const _entityRepository = entityRepository(Course);
const userRepository = entityRepository(User);

const countryService = {
  async getAll() {
    try {
      const courses = await _entityRepository.getAll();
      const tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = await userRepository.getOneById(tmp[i].teacher_id);
        const category = await categoryRepository.getOneById(tmp[i].category_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
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
        const category = await categoryRepository.getOneById(tmp[i].category_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
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
        const category = await categoryRepository.getOneById(tmp[i].category_id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
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

  async getAllByCriteria() {
    try {
      const courses = await _entityRepository.getAll();
      const tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = await userRepository.getOneById(tmp[i].teacher_id);
        const category = await categoryRepository.getOneById(tmp[i].category_id);
        const subscribers = await subscriberRepository.getAllByCourseId(tmp[i]._id);
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = subscribers.length;
      }

      let most_viewed_courses = [];
      let latest_courses = [];
      let featured_courses = [];

      // 10 most_viewed_courses
      for (var i = 0; i < courses.length - 1; i++) {
        for (var j = i + 1; j < courses.length; j++) {
          if (courses[i].views < courses[j].views) {
            const a = courses[i];
            courses[i] = courses[j];
            courses[j] = a;
          }
        }
      }

      for (var i = 0; i < 9; i++) {
        most_viewed_courses.push(courses[i]);
      }

      // 10 latest courses
      for (var i = 0; i < courses.length - 1; i++) {
        for (var j = i + 1; j < courses.length; j++) {
          if (courses[i].createdAt < courses[j].createdAt) {
            const a = courses[i];
            courses[i] = courses[j];
            courses[j] = a;
          }
        }
      }

      for (var i = 0; i < 9; i++) {
        latest_courses.push(courses[i]);
      }

      // 4 featured courses
      for (var i = 0; i < courses.length - 1; i++) {
        for (var j = i + 1; j < courses.length; j++) {
          if (courses[i].number_of_subscribers < courses[j].number_of_subscribers) {
            const a = courses[i];
            courses[i] = courses[j];
            courses[j] = a;
          }
        }
      }

      for (var i = 0; i < 3; i++) {
        featured_courses.push(courses[i]);
      }

      return {
        code: courseResponseEnum.SUCCESS,
        most_viewed_courses,
        latest_courses,
        featured_courses
      }
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
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