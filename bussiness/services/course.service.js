import cloudinary from "cloudinary";

import Course from "../../models/course.js";
import User from "../../models/user.js";
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from "../../data/repositories/entity.repository.js";
import categoryRepository from "../../data/repositories/category.repository.js";
import subscriberRepository from "../../data/repositories/subscriber.repository.js";
import categoryResponseEnum from "../../utils/enums/categoryResponseEnum.js";
import courseRepository from "../../data/repositories/course.repository.js";
const _entityRepository = entityRepository(Course);
const userRepository = entityRepository(User);

cloudinary.config({
  cloud_name: "drzosgsbu",
  api_key: "652466433314754",
  api_secret: "pxaRemIMIXJB78MHcN0ylwh5At4",
});

const courseService = {
  async addOne(request) {
    try {
      const result = await cloudinary.v2.uploader.upload(request.image, {
        resource_type: "video",
      });
      console.log(result.secure_url);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async getAll(page, category_id, teacher_id) {
    try {
      let courses;
      if (category_id !== 'none') {
        courses = await courseRepository.getAllByCategoryId({ category_id: category_id });
      } else if (teacher_id !== 'none') {
        courses = await courseRepository.getAllByTeacherId({ teacher_id: teacher_id });
      } else if (category_id === 'none' && teacher_id === 'none') {
        courses = await _entityRepository.getAll();
      }
      courses = JSON.parse(JSON.stringify(courses));
      const users = await userRepository.getAll();
      let getUserById = {};

      users.forEach((element) => {
        getUserById[element._id] = element;
      });
      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        const teacher = getUserById[tmp[i].teacher_id];
        courses[i]["teacher_name"] = teacher.name;
      }

      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0;
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 5) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 5 == Math.floor(_i / 5)) {
          page_number.push(_i / 5 + 1);
        }
        _i++;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number,
      };
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  async getAllByTeacherId(page, id) {
    try {
      const courses = await courseRepository.getAllByTeacherId({ teacher_id: id, status: true });
      // Pagination
      const tmp = [];
      const page_number = [];
      let _i = 0;
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 5) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 5 == Math.floor(_i / 5)) {
          page_number.push(_i / 5 + 1);
        }
        _i++;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number,
      };
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  async getOneById(request) {
    try {
      let course = await _entityRepository.getOneById(request.id);
      if (!course) {
        return {
          code: courseResponseEnum.ID_IS_INVALID,
        };
      }
      if (!course.status) {
        return {
          code: courseResponseEnum.COURSE_HAS_BEEN_DELETED,
        };
      }
      const teacher = await userRepository.getOneById(course.teacher_id);
      course = JSON.parse(JSON.stringify(course));
      course.price = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(course.price);
      course["teacher_name"] = teacher.name;
      course["teacher_email"] = teacher.email;
      return {
        code: courseResponseEnum.SUCCESS,
        course,
      };
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  async getAllByCategoryId(request) {
    try {
      const page = request.page;
      const category = await categoryRepository.getOneById(request.id);
      if (!category) {
        return {
          code: categoryResponseEnum.CATEGORY_ID_IS_INVALID,
        };
      }
      if (!category.status) {
        return {
          code: categoryResponseEnum.CATEGORY_HAS_BEEN_DELETED,
        };
      }
      let courses = await courseRepository.getAllByCategoryId({
        category_id: request.id,
        status: true,
      });
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getPoint = {},
        num = {};
      users.forEach((element) => {
        getUserById[element._id] = element;
      });

      categories.forEach((element) => {
        getCategoryById[element._id] = element;
      });
      subscribers.forEach((element) => {
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
      });
      const ids = Object.keys(getPoint);
      ids.forEach((element) => {
        getPoint[element] /= num[element];
      });

      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]["teacher_name"] = teacher.name;
        courses[i]["teacher_email"] = teacher.email;
        courses[i]["category_name"] = category.name;
        courses[i]["number_of_subscribers"] = num[tmp[i]._id] ? num[tmp[i]._id] : 0;
        courses[i]["point"] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }

      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0;
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 8) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 8 == Math.floor(_i / 8)) {
          page_number.push(_i / 8 + 1);
        }
        _i++;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number,
      };
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR,
      };
    }
  },

  async getAllBySearch(request) {
    try {
      const sort = request.sort;
      const page = request.page;
      let courses = await courseRepository.getAllByName(request.keyword);
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getPoint = {},
        num = {};
      users.forEach((element) => {
        getUserById[element._id] = element;
      });

      categories.forEach((element) => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach((element) => {
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
      });
      const ids = Object.keys(getPoint);
      ids.forEach((element) => {
        getPoint[element] /= num[element];
      });

      let tmp = courses;
      const date = new Date();
      for (var i = 0; i < tmp.length; i++) {
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]["teacher_name"] = teacher.name;
        courses[i]["teacher_email"] = teacher.email;
        courses[i]["category_name"] = category.name;
        courses[i]["number_of_subscribers"] = num[tmp[i]._id] ? num[tmp[i]._id] : 0;
        courses[i]["point"] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
        const createdAt = new Date(courses[i].createdAt);
        const diffDate = Math.abs(date - createdAt);
        const days = diffDate / (1000 * 3600 * 24);
        if (days <= 7) {
          courses[i]["newest"] = true;
        }
      }
      courses.sort(
        (a, b) => (a.number_of_subscribers < b.number_of_subscribers && 1) || -1
      );
      if (courses.length < 4) {
        tmp = courses.length;
        for (var i = 0; i < tmp; i++) {
          if (courses[i].number_of_subscribers >= 1 && !courses[i].newest) {
            courses[i]["best_seller"] = true;
          }
        }
      } else {
        for (var i = 0; i < 4; i++) {
          if (courses[i].number_of_subscribers >= 1 && !courses[i].newest) {
            courses[i]["best_seller"] = true;
          }
        }
      }

      if (sort !== "none") {
        switch (sort) {
          case "priceasc":
            courses.sort((a, b) => (a.price > b.price && 1) || -1);
            break;
          case "pricedesc":
            courses.sort((a, b) => (a.price < b.price && 1) || -1);
            break;
          case "pointasc":
            courses.sort((a, b) => (a.point > b.point && 1) || -1);
            break;
          case "pointdesc":
            courses.sort((a, b) => (a.point < b.point && 1) || -1);
            break;
        }
      }

      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(courses[i].price);
      }

      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0;
      for (var i = 0; i < courses.length; i++) {
        if (Math.floor(_i / 8) == page - 1) {
          const data = courses[_i];
          tmp.push(data);
        }
        if (_i / 8 == Math.floor(_i / 8)) {
          page_number.push(_i / 8 + 1);
        }
        _i++;
      }
      return {
        code: courseResponseEnum.SUCCESS,
        courses: tmp,
        page_number,
      };
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR,
      };
    }
  },

  async getAllByCriteria() {
    try {
      let courses = await courseRepository.getAll();
      courses = JSON.parse(JSON.stringify(courses));
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      const subscribers = await subscriberRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getPoint = {},
        num = {};
      users.forEach((element) => {
        getUserById[element._id] = element;
      });
      categories.forEach((element) => {
        getCategoryById[element._id] = element;
      });
      subscribers.forEach((element) => {
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
      });
      const ids = Object.keys(getPoint);
      ids.forEach((element) => {
        getPoint[element] /= num[element];
      });
      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]["teacher_name"] = teacher.name;
        courses[i]["teacher_email"] = teacher.email;
        courses[i]["category_name"] = category.name;
        courses[i]["number_of_subscribers"] = num[tmp[i]._id] ? num[tmp[i]._id] : 0;
        courses[i]["point"] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }

      let most_viewed_courses = [];
      let latest_courses = [];
      let featured_courses = [];
      let most_subscribed_categories = [];

      // 10 most_viewed_courses

      courses.sort((a, b) => (a.views < b.views && 1) || -1);

      for (var i = 0; i <= 9; i++) {
        most_viewed_courses.push(courses[i]);
      }

      // 10 latest courses
      courses.sort((a, b) => (a.createdAt < b.createdAt && 1) || -1);
      for (var i = 0; i <= 9; i++) {
        latest_courses.push(courses[i]);
      }

      // 4 featured courses
      courses.sort(
        (a, b) => (a.number_of_subscribers < b.number_of_subscribers && 1) || -1
      );
      for (var i = 0; i <= 3; i++) {
        featured_courses.push(courses[i]);
      }

      // 4 most number of subscribers category
      tmp = categories;
      num = 0;
      for (var i = 0; i < tmp.length; i++) {
        for (var j = 0; j < courses.length; j++) {
          if (categories[i]._id.equals(courses[j].category_id)) {
            num += courses[j].number_of_subscribers;
          }
        }
        categories[i]["number_of_subscribers"] = num;
        num = 0;
      }

      for (var i = 0; i < categories.length - 1; i++) {
        for (var j = i + 1; j < categories.length; j++) {
          if (
            categories[i].number_of_subscribers <
            categories[j].number_of_subscribers
          ) {
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
        most_subscribed_categories,
      };
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  async getMostSubscribedCourses(request) {
    try {
      let courses = await courseRepository.getAllByCategoryId({
        category_id: request.category_id,
        status: true
      });
      courses = JSON.parse(JSON.stringify(courses));
      const subscribers = await subscriberRepository.getAll();
      const users = await userRepository.getAll();
      const categories = await categoryRepository.getAll();
      let getUserById = {},
        getCategoryById = {},
        getPoint = {},
        num = {};
      users.forEach((element) => {
        getUserById[element._id] = element;
      });

      categories.forEach((element) => {
        getCategoryById[element._id] = element;
      });

      subscribers.forEach((element) => {
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
      });
      const ids = Object.keys(getPoint);
      ids.forEach((element) => {
        getPoint[element] /= num[element];
      });

      let tmp = courses;
      for (var i = 0; i < tmp.length; i++) {
        courses[i].price = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(courses[i].price);
        const teacher = getUserById[tmp[i].teacher_id];
        const category = getCategoryById[tmp[i].category_id];
        courses[i]["teacher_name"] = teacher.name;
        courses[i]["teacher_email"] = teacher.email;
        courses[i]["category_name"] = category.name;
        courses[i]["number_of_subscribers"] = num[tmp[i]._id] ? num[tmp[i]._id] : 0;;
        courses[i]["point"] = getPoint[tmp[i]._id] ? getPoint[tmp[i]._id] : 0;
      }
      courses.sort(
        (a, b) => (a.number_of_subscribers < b.number_of_subscribers && 1) || -1
      );
      tmp = courses.filter((course) => course._id != request.id);
      let most_subscribed_courses = [];
      if (tmp.length >= 5) {
        for (var i = 0; i <= 4; i++) {
          most_subscribed_courses.push(tmp[i]);
        }
        return {
          code: courseResponseEnum.SUCCESS,
          most_subscribed_courses,
        };
      } else {
        return {
          code: courseResponseEnum.SUCCESS,
          most_subscribed_courses: tmp,
        };
      }
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  updateOne(request) {
    // if (this.isCountryAvailable(country.country_id)) {
    //   return _entityRepository.updateOne(country, country.country_id);
    // }
    // else {
    //   return operatorType.NOT_AVAILABLE;
    // }
  },

  async updateOneById(request) {
    try {
      await _entityRepository.updateOneById(request.id, {
        status: request.status,
      });
      return {
        code: courseResponseEnum.SUCCESS,
      };
    } catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR };
    }
  },

  async updateView(request) {
    try {
      let course = await _entityRepository.getOneById(request.id);
      if (!course) {
        return {
          code: courseResponseEnum.ID_IS_INVALID,
        };
      }
      if (!course.status) {
        return {
          code: courseResponseEnum.COURSE_HAS_BEEN_DELETED,
        };
      }
      course.views += 1;
      await _entityRepository.updateOne(course);
      return {
        code: courseResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: courseResponseEnum.SERVER_ERROR,
      };
    }
  },
};

export default courseService;