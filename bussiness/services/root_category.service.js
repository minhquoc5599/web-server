import RootCategory from '../../models/root_category.js'
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';
import categoryRepository from '../../data/repositories/category.repository.js';
import rootCategoryValidator from '../../api/validators/rootCategoryValidator.js';
const rootCategoryService = {
  async getAll() {
    try {
      const listAllResponse = await rootCategoryReposity.getAll();
      return {
        code: categoryResponseEnum.SUCCESS,
        listAllResponse: listAllResponse
      }
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
  },

  async addOne(name) {
    try {
      // Validate request
      const resultValidator = rootCategoryValidator(name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name root category is available or not
      let root_category = await rootCategoryReposity.getOneByName(name);
      if (root_category) {
        return {
          code: categoryResponseEnum.NAME_IS_UNAVAILABLE
        };
      }

      // Save root category to DB
      root_category = new RootCategory({ name });
      const result = await rootCategoryReposity.addOne(root_category);
      return {
        code: categoryResponseEnum.SUCCESS,
        root_category: result
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async getOneById(id) {
    try {
      const root_category = await rootCategoryReposity.getOneById(id);

      // check root category is available or not
      if (!root_category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        };
      }
      return {
        code: categoryResponseEnum.SUCCESS,
        root_category
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
      const resultValidator = rootCategoryValidator(name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name root_category is available or not
      let root_category = await rootCategoryReposity.getOneByName(name);
      if (root_category) {
        return {
          code: categoryResponseEnum.NAME_IS_UNAVAILABLE
        };
      }

      // Check id root_category is available or not
      root_category = await rootCategoryReposity.getOneById(id);
      if (!root_category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        };
      }

      // Update root category to DB
      root_category.name = name;
      const update = await rootCategoryReposity.updateOne(root_category);
      return {
        code: categoryResponseEnum.SUCCESS,
        root_category: update
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async deleteOne(id) {
    try {
      // Check id root_category is available or not
      const root_category = await rootCategoryReposity.getOneById(id);
      if (!root_category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        };
      }

      // Check available category
      const categories = await categoryRepository.getAllByRootCategoryId(id);
      if (categories !== null) {
        return {
          code: categoryResponseEnum.CATEGORY_IS_AVAILABLE
        };
      }

      // Delete root category
      const del = await rootCategoryReposity.deleteOne(id);
      return {
        code: categoryResponseEnum.SUCCESS
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
  }
}

export default rootCategoryService;