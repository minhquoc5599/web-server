import Course from "../../models/course.js";
import courseResponseEnum from "../../utils/enums/courseResponseEnum.js";
import entityRepository from '../../data/repositories/entity.repository.js';

const _entityRepository = entityRepository(Course);

const countryService = {
  async getAll() {
    try {
      const listAllResponse = await _entityRepository.getAll();
      return {
        code: courseResponseEnum.SUCCESS,
        listAllResponse: listAllResponse
      }
    }
    catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
    }
  },

  async getOneById(request) {
    try {
      const course = await _entityRepository.getOneById({ id: request.id });
      return {
        code: courseResponseEnum.SUCCESS,
        course: course
      }
    }
    catch (e) {
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
    }
    catch (e) {
      return { code: courseResponseEnum.SERVER_ERROR }
    }
  },
};

export default countryService;