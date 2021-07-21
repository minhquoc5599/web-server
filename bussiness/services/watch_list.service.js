import watchListValidator from "../../api/validators/watchListValidator.js";
import watchListRepository from "../../data/repositories/watch_list.repository.js";
import WatchList from "../../models/watch_list.js";
import operatorType from "../../utils/enums/operatorType.js";
import watchListResponseEnum from "../../utils/enums/watchListResponseEnum.js";

const watchListService = {
  async addWatchList(course_id, student_id) {
    // Validate request
    const resultValidator = watchListValidator.addValidator(course_id, student_id);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check watch list available or not
    let watch_list = await watchListRepository.getWatchListByCourseIdStudentId(course_id, student_id);
    if (watch_list === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      };
    }
    if (watch_list) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.COURSE_HAS_BEEN_ADDED_TO_WATCHLIST
      };
    }

    // Save watch list to DB
    watch_list = new WatchList({ course_id, student_id });
    const createWatchList = await watchListRepository.addWatchList(watch_list);
    if (createWatchList === operatorType.FAIL.CREATE) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.CREATE
      };
    }
    return {
      isSuccess: true,
      createWatchList,
      code: operatorType.SUCCESS.CREATE
    }
  },
  async getWatchListsByStudentId(student_id) {
    // Validate student id
    const resultValidator = watchListValidator.studentIdValidator(student_id);
    if (!resultValidator.isSuccess) return resultValidator;

    const watch_lists = await watchListRepository.getWatchListsByStudentId(student_id);
    if (watch_lists === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!watch_lists) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.STUDENT_ID_IS_INVALID
      }
    }
    return {
      isSuccess: true,
      watch_lists,
      code: operatorType.SUCCESS.READ
    }
  },
  async deleteWatchList(course_id, student_id) {
    // Validate request
    const resultValidator = watchListValidator.addValidator(course_id, student_id);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check watch list available or not
    let watch_list = await watchListRepository.getWatchListByCourseIdStudentId(course_id, student_id);
    if (watch_list === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      };
    }
    if (!watch_list) {
      return {
        isSuccess: false,
        code: watchListResponseEnum.COURSE_ID_AND_STUDENT_ID_ARE_INVALID
      };
    }

    const resultDelete = await watchListRepository.deleteWatchList(course_id, student_id);
    if (resultDelete === operatorType.FAIL.DELETE) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.DELETE
      };
    }
    return {
      isSuccess: true,
      resultDelete,
      code: operatorType.SUCCESS.DELETE
    }
  },
}

export default watchListService;