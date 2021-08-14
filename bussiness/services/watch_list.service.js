import watchListValidator from "../../api/validators/watchListValidator.js";
import watchListRepository from "../../data/repositories/watch_list.repository.js";
import WatchList from "../../models/watch_list.js";
import watchListResponseEnum from "../../utils/enums/watchListResponseEnum.js";
import User from '../../models/user.js';
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from '../../data/repositories/entity.repository.js';
import categoryRepository from "../../data/repositories/category.repository.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import categoryResponseEnum from "../../utils/enums/categoryResponseEnum.js";
import courseRepository from "../../data/repositories/course.repository.js";

const userRepository = entityRepository(User);

const watchListService = {
  async addOne(course_id, student_id) {
    try {
      // Validate request
      const resultValidator = watchListValidator.addValidator(course_id, student_id);
      if (resultValidator.code !== watchListResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check watch list available or not
      let watch_list = await watchListRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (watch_list) {
        return {
          code: watchListResponseEnum.COURSE_HAS_BEEN_ADDED_TO_WATCHLIST
        };
      }

      // Save watch list to DB
      watch_list = new WatchList({ course_id, student_id });
      await watchListRepository.addOne(watch_list)
      return {
        code: watchListResponseEnum.SUCCESS,
        watch_list
      };
    } catch (e) {
      return {
        code: watchListResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByStudentId(student_id, page) {
    try {
      // Validate student id
      const resultValidator = watchListValidator.studentIdValidator(student_id);
      if (resultValidator.code !== watchListResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      const watch_lists = await watchListRepository.getAllByStudentId(student_id);
      if (!watch_lists) {
        return {
          code: watchListResponseEnum.STUDENT_ID_IS_INVALID
        }
      }
      if (watch_lists.length === 0) {
        return {
          code: watchListResponseEnum.WATCH_LIST_IS_EMPTY
        }
      }

      let courses = await courseRepository.getAll();
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getWatchListByCourseId = {},
        getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      watch_lists.forEach(element => {
        getWatchListByCourseId[element.course_id] = element;
      });
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
      let courseWatchList = [];
      for (var i = 0; i < tmp.length; i++) {
        if (getWatchListByCourseId[tmp[i]._id]) {
          courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
          const teacher = getUserById[tmp[i].teacher_id];
          const category = getCategoryById[tmp[i].category_id];
          courses[i]['teacher_name'] = teacher.name;
          courses[i]['teacher_email'] = teacher.email;
          courses[i]['category_name'] = category.name;
          courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
          courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
          courseWatchList.push(courses[i]);
        }
      }

      if (courseWatchList.length === 0) {
        return {
          code: watchListResponseEnum.WATCH_LIST_IS_EMPTY
        }
      }

      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0
      for (var i = 0; i < courseWatchList.length; i++) {
        if (Math.floor(_i / 8) == page - 1) {
          const data = courseWatchList[_i];
          tmp.push(data);
        }
        if (_i / 8 == Math.floor(_i / 8)) {
          page_number.push((_i / 8) + 1);
        }
        _i++;
      }
      return {
        code: watchListResponseEnum.SUCCESS,
        watch_lists: tmp,
        page_number
      }
    } catch (e) {
      return {
        code: watchListResponseEnum.SERVER_ERROR
      };
    }
  },

  async getOneByCourseIdStudentId(course_id, student_id) {
    try {
      // Validate request
      const resultValidator = watchListValidator.addValidator(course_id, student_id);
      if (resultValidator.code !== watchListResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check watch list available or not
      const watch_list = await watchListRepository.getOneByCourseIdStudentId(course_id, student_id);
      return {
        code: watchListResponseEnum.SUCCESS,
        is_liked: watch_list ? true : false
      }
    } catch (e) {
      return {
        code: watchListResponseEnum.SERVER_ERROR
      };
    }
  },

  async deleteOne(course_id, student_id) {
    try {
      // Validate request
      const resultValidator = watchListValidator.addValidator(course_id, student_id);
      if (resultValidator.code !== watchListResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check watch list available or not
      let watch_list = await watchListRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (!watch_list) {
        return {
          code: watchListResponseEnum.COURSE_ID_AND_STUDENT_ID_ARE_INVALID
        };
      }

      // Delete
      await watchListRepository.deleteOne(course_id, student_id);
      return {
        code: watchListResponseEnum.SUCCESS
      };
    } catch (e) {
      return {
        code: watchListResponseEnum.SERVER_ERROR
      };
    }
  },
}

export default watchListService;