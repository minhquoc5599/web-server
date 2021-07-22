import watchListValidator from "../../api/validators/watchListValidator.js";
import watchListRepository from "../../data/repositories/watch_list.repository.js";
import WatchList from "../../models/watch_list.js";
import watchListResponseEnum from "../../utils/enums/watchListResponseEnum.js";

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
      const createWatchList = await watchListRepository.addOne(watch_list)
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

  async getAllByStudentId(student_id) {
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
      return {
        code: watchListResponseEnum.SUCCESS,
        watch_lists
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
      const resultDelete = await watchListRepository.deleteOne(course_id, student_id);
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