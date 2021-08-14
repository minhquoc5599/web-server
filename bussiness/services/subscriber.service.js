import Subscriber from "../../models/subscriber.js";
import User from "../../models/user.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import subscriberResponseEnum from "../../utils/enums/subscriberResponseEnum.js";
import subscriberValidator from "../../api/validators/subscriberValidator.js";
import entityRepository from "../../data/repositories/entity.repository.js";
import courseRepository from "../../data/repositories/course.repository.js";
import categoryRepository from "../../data/repositories/category.repository.js";
const userRepository = entityRepository(User);

const subscriberService = {
  async subscribe(course_id, student_id) {
    try {
      // Validate request
      const resultValidator = subscriberValidator.add(course_id, student_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check subsciber available or not
      let subscriber = await subscriberRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (subscriber) {
        return {
          code: subscriberResponseEnum.COURSE_HAS_BEEN_SUBSCRIBED
        };
      }

      // Save subscriber to DB
      subscriber = new Subscriber({ course_id, student_id });
      const createSubscriber = await subscriberRepository.addOne(subscriber);
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscriber: createSubscriber,
        is_subscribed: true
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByCourseId(course_id, user) {
    try {
      // Validate course id
      const resultValidator = subscriberValidator.courseId(course_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      let subscribers = await subscriberRepository.getAllByCourseId(course_id);
      subscribers = JSON.parse(JSON.stringify(subscribers));
      if (!subscribers) {
        return {
          code: subscriberResponseEnum.COURSE_ID_IS_INVALID
        };
      }
      const students = await userRepository.getAll();
      let getStudentsById = {};
      students.forEach(element => {
        getStudentsById[element._id] = element;
      });

      const subscribers_rated = subscribers.filter(sub => sub.rating > 0);
      const tmp = subscribers_rated;
      for (var i = 0; i < tmp.length; i++) {
        const student = getStudentsById[tmp[i].student_id];
        subscribers_rated[i]['student_name'] = student.name;
      }
      let point = 0;
      if (subscribers_rated.length > 0) {
        for (var i = 0; i < subscribers_rated.length; i++) {
          point = point + subscribers_rated[i].rating;
        }
        point = point / subscribers_rated.length;
      }
      let is_subscribed = user && subscribers.find(x => x.student_id == user.id) ? true : false;
      let is_rated = user && subscribers_rated.find(x => x.student_id == user.id) ? true : false;

      return {
        code: subscriberResponseEnum.SUCCESS,
        subscribers,
        subscribers_rated,
        is_subscribed,
        is_rated,
        point
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByStudentId(student_id, page) {
    try {
      // Validate course id
      const resultValidator = subscriberValidator.studentId(student_id);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      const subscribersByStudentId = await subscriberRepository.getAllByStudentId(student_id);
      if (!subscribersByStudentId) {
        return {
          code: subscriberResponseEnum.STUDENT_ID_IS_INVALID
        };
      }
      if (subscribersByStudentId.length === 0) {
        return {
          code: subscriberResponseEnum.SUBSCRIBER_LIST_IS_EMPTY
        }
      }
      let courses = await courseRepository.getAll();
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getSubscribersByStudentIdByCourseId = {},
        getUserById = {},
        getCategoryById = {},
        getSubscribersByCourseId = {},
        getPoint = {};

      subscribersByStudentId.forEach(element => {
        getSubscribersByStudentIdByCourseId[element.course_id] = element;
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
      let subscribedcourseList = [];
      for (var i = 0; i < tmp.length; i++) {
        if (getSubscribersByStudentIdByCourseId[tmp[i]._id]) {
          courses[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(courses[i].price);
          const teacher = getUserById[tmp[i].teacher_id];
          const category = getCategoryById[tmp[i].category_id];
          courses[i]['teacher_name'] = teacher.name;
          courses[i]['teacher_email'] = teacher.email;
          courses[i]['category_name'] = category.name;
          courses[i]['number_of_subscribers'] = getSubscribersByCourseId[tmp[i]._id] ? getSubscribersByCourseId[tmp[i]._id] : 0;
          courses[i]['point'] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
          subscribedcourseList.push(courses[i]);
        }
      }

      if (subscribedcourseList.length === 0) {
        return {
          code: subscriberResponseEnum.SUBSCRIBER_LIST_IS_EMPTY
        }
      }
      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0
      for (var i = 0; i < subscribedcourseList.length; i++) {
        if (Math.floor(_i / 8) == page - 1) {
          const data = subscribedcourseList[_i];
          tmp.push(data);
        }
        if (_i / 8 == Math.floor(_i / 8)) {
          page_number.push((_i / 8) + 1);
        }
        _i++;
      }
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscribed_courses: tmp,
        page_number
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  },

  async rating(course_id, student_id, rating, comment, name) {
    try {
      // Validate student id, rating
      const resultValidator = subscriberValidator.update(course_id, student_id, rating);
      if (resultValidator.code !== subscriberResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check subscriber available or not 
      let subscriber = await subscriberRepository.getOneByCourseIdStudentId(course_id, student_id);
      if (!subscriber) {
        return {
          code: subscriberResponseEnum.COURSE_ID_AND_STUDENT_ID_ARE_INVALID
        };
      }
      if (subscriber.rating > 0) {
        return {
          code: subscriberResponseEnum.COURSE_HAS_BEEN_RATED
        };
      }

      // Update subscriber to DB
      subscriber.rating = rating;
      subscriber.comment = comment;
      await subscriberRepository.updateOne(subscriber);
      return {
        code: subscriberResponseEnum.SUCCESS,
        subscriber: {
          student_id: subscriber.student_id,
          course_id: subscriber.course_id,
          rating: subscriber.rating,
          comment: subscriber.comment,
          student_name: name
        },
        is_rated: true
      };
    } catch (e) {
      return {
        code: subscriberResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default subscriberService;