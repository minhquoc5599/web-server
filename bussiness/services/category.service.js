import Category from '../../models/category.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import categoryRepository from '../../data/repositories/category.repository.js';
import categoryValidator from '../../api/validators/categoryValidator.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';

const categoryService = {
  async getAll() {
    try {
      const listAllResponse = await categoryRepository.getAll();
      return {
        code: categoryResponseEnum.SUCCESS,
        listAllResponse: listAllResponse

      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async addOne(name, root_category_id) {
    try {
      // Validate request
      const resultValidator = categoryValidator.addValidator(root_category_id, name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name category is available or not
      let category = await categoryRepository.getOneByName(name);
      if (category) {
        return {
          code: categoryResponseEnum.NAME_IS_UNAVAILABLE
        };
      }

      // Check root_category_id is available or not
      const root_category = await rootCategoryReposity.getOneById(root_category_id);
      if (!root_category) {
        return {
          code: categoryResponseEnum.ROOT_CATEGORY_ID_IS_INVALID
        };
      }

      // Save category to DB
      category = new Category({ name, root_category_id });
      const resultCategory = await categoryRepository.addOne(category);
      return {
        code: categoryResponseEnum.SUCCESS,
        category: resultCategory
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async getOnebyId(id) {
    try {
      const category = await categoryRepository.getOneById(id);

      // check category is available or not
      if (!category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        }
      }
      return {
        code: categoryResponseEnum.SUCCESS,
        category
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async updateOne(id, name) {
    try {
      // Validate request
      const resultValidator = categoryValidator.updateValidator(id, name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name category is available or not
      let category = await categoryRepository.getOneByName(name);
      if (category) {
        return {
          code: categoryResponseEnum.NAME_IS_UNAVAILABLE
        };
      }

      // Check id category is available or not
      category = await categoryRepository.getOneById(id);
      if (!category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        };
      }

      // Update category to DB
      category.name = name;
      const update = await categoryRepository.updateOne(category);
      return {
        code: categoryResponseEnum.SUCCESS,
        category: update
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default categoryService;