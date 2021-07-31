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
      const page = request.page;
      const courses = await _entityRepository.getAllByCategoryId({ category_id: request.id });
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      users.forEach(element => {
        getUserById[element._id] = element;
      });

      categories.forEach(element => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach(element => {
        if (getSubscribersByCourseId && getSubscribersByCourseId[element.course_id])
          getSubscribersByCourseId[element.course_id] += 1;
        else
          getSubscribersByCourseId[element.course_id] = 1;
      });

      let num = {};
      subscribers.forEach(element => {
        if (getPoint && getPoint[element.course_id]) {
          if (element.rating > 0) {
            getPoint[element.course_id] += element.rating;
            num[element.course_id]++;
          }
        } else {
          if (element.rating > 0) {
            getPoint[element.course_id] = element.rating;
            num[element.course_id] = 1;
          } else {
            getPoint[element.course_id] = 0;
          }
        }
      })
      const ids = Object.keys(getPoint);
      ids.forEach(element => {
        getPoint[element] /= num[element];
      })

      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
        courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }
      tmp = [];
      const page_number = [];
      let _i = 0
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 4) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 4 == Math.floor(_i / 4)) {
          page_number.push((_i / 4) + 1);
        }
        _i++;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number
      }
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR
      }
    }
  },

  async getAllBySearch(request) {
    try {
      const sort = request.sort;
      const page = request.page;
      const courses = await _entityRepository.getAllByName(request.keyword);
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      users.forEach(element => {
        getUserById[element._id] = element;
      });

      categories.forEach(element => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach(element => {
        if (getSubscribersByCourseId && getSubscribersByCourseId[element.course_id])
          getSubscribersByCourseId[element.course_id] += 1;
        else
          getSubscribersByCourseId[element.course_id] = 1;
      });

      let num = {};
      subscribers.forEach(element => {
        if (getPoint && getPoint[element.course_id]) {
          if (element.rating > 0) {
            getPoint[element.course_id] += element.rating;
            num[element.course_id]++;
          }
        } else {
          if (element.rating > 0) {
            getPoint[element.course_id] = element.rating;
            num[element.course_id] = 1;
          } else {
            getPoint[element.course_id] = 0;
          }
        }
      })
      const ids = Object.keys(getPoint);
      ids.forEach(element => {
        getPoint[element] /= num[element];
      })

      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
        courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }
      if (sort !== 'none') {
        switch (sort) {
          case 'priceasc':
            courses.sort((a, b) => a.price > b.price && 1 || -1);
            break;
          case 'pricedesc':
            courses.sort((a, b) => a.price < b.price && 1 || -1);
            break;
          case 'pointasc':
            courses.sort((a, b) => a.point > b.point && 1 || -1);
            break;
          case 'pointdesc':
            courses.sort((a, b) => a.point < b.point && 1 || -1);
            break;
        }
      }

      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
      }

      tmp = [];
      const page_number = [];
      let _i = 0
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 4) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 4 == Math.floor(_i / 4)) {
          page_number.push((_i / 4) + 1);
        }
        _i++;
      }
      console.log(page_number);
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number
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
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      const subscribers = await subscriberRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};
      users.forEach(element => {
        getUserById[element._id] = element;
      });
      categories.forEach(element => {
        getCategoryById[element._id] = element;
      });
      subscribers.forEach(element => {
        if (getSubscribersByCourseId && getSubscribersByCourseId[element.course_id])
          getSubscribersByCourseId[element.course_id] += 1;
        else
          getSubscribersByCourseId[element.course_id] = 1;
      });
      let num = {};
      subscribers.forEach(element => {
        if (getPoint && getPoint[element.course_id]) {
          if (element.rating > 0) {
            getPoint[element.course_id] += element.rating;
            num[element.course_id]++;
          }
        } else {
          if (element.rating > 0) {
            getPoint[element.course_id] = element.rating;
            num[element.course_id] = 1;
          } else {
            getPoint[element.course_id] = 0;
          }
        }
      })
      const ids = Object.keys(getPoint);
      ids.forEach(element => {
        getPoint[element] /= num[element];
      })
      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]['teacher_name'] = teacher.name;
        courses[i]['teacher_email'] = teacher.email;
        courses[i]['category_name'] = category.name;
        courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
        courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }

      let most_viewed_courses = [];
      let latest_courses = [];
      let featured_courses = [];
      let most_subscribed_categories = [];

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

      for (var i = 0; i <= 9; i++) {
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

      for (var i = 0; i <= 9; i++) {
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

      for (var i = 0; i <= 3; i++) {
        featured_courses.push(courses[i]);
      }

      // 4 most number of subscribers category
      tmp = categories;
      num = 0;
      for (var i = 0; i < tmp.length; i++) {
        for (var j = 0; j < courses.length; j++) {
          if (categories[i]._id.equals(courses[j].category_id)) {
            num += courses[j].number_of_subscribers
          }
        }
        categories[i]['number_of_subscribers'] = num;
        num = 0;
      }

      for (var i = 0; i < categories.length - 1; i++) {
        for (var j = i + 1; j < categories.length; j++) {
          if (categories[i].number_of_subscribers < categories[j].number_of_subscribers) {
            const a = categories[i];
            categories[i] = categories[j];
            categories[j] = a;
          }
        }
      }


      for (var i = 0; i <= 3; i++) {
        most_subscribed_categories.push(categories[i]);
      }


      return {
        code: courseResponseEnum.SUCCESS,
        most_viewed_courses,
        latest_courses,
        featured_courses,
        most_subscribed_categories
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