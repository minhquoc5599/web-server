import RootCategory from '../../models/root_category.js'
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';
import categoryRepository from '../../data/repositories/category.repository.js';
import rootCategoryValidator from '../../api/validators/rootCategoryValidator.js';

const rootCategoryService = {
  async getAll() {
    try {
      let root_categories = await rootCategoryReposity.getAll();
      const tmp = root_categories;
      root_categories = JSON.parse(JSON.stringify(root_categories));
      for (var i = 0; i < tmp.length; i++) {
        const categories = await categoryRepository.getAllByRootCategoryId(root_categories[i]._id);
        root_categories[i]['categories'] = categories
      }
      return {
        code: categoryResponseEnum.SUCCESS,
        root_categories
      }
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
  },

  async getAllByPage(page) {
    try {
      let root_categories = await rootCategoryReposity.getAll();
      let tmp = root_categories;
      root_categories = JSON.parse(JSON.stringify(root_categories));
      for (var i = 0; i < tmp.length; i++) {
        const categories = await categoryRepository.getAllByRootCategoryId(root_categories[i]._id);
        root_categories[i]['categories'] = categories
      }

      // Pagination
      tmp = [];
      const page_number = [];
      let _i = 0
      for (var i = 0; i < root_categories.length; i++) {
        if (Math.floor(_i / 5) == page - 1) {
          const data = root_categories[_i];
          tmp.push(data);
        }
        if (_i / 5 == Math.floor(_i / 5)) {
          page_number.push((_i / 5) + 1);
        }
        _i++;
      }

      return {
        code: categoryResponseEnum.SUCCESS,
        root_categories: tmp,
        page_number
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
          code: categoryResponseEnum.ROOT_CATEGORY_NAME_IS_UNAVAILABLE
        };
      }

      // Save root category to DB
      root_category = new RootCategory({ name });
      await rootCategoryReposity.addOne(root_category);
      return {
        code: categoryResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  // async getOneById(id) {
  //   try {
  //     const root_category = await rootCategoryReposity.getOneById(id);
  //     // check root category is available or not
  //     if (!root_category) {
  //       return {
  //         code: categoryResponseEnum.ID_IS_INVALID
  //       };
  //     }
  //     const categories = await categoryRepository.getAllByRootCategoryId(root_category._id);
  //     root_category['categories'] = categories


  //     return {
  //       code: categoryResponseEnum.SUCCESS,
  //       root_category
  //     };
  //   } catch (e) {
  //     return {
  //       code: categoryResponseEnum.SERVER_ERROR
  //     };
  //   }
  // },

  async updateOne(id, name) {
    try {
      // Validate request
      const resultValidator = rootCategoryValidator(name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name root_category is available or not
      let root_category = await rootCategoryReposity.getOneByName(name);
      if (root_category) {
        return {
          code: categoryResponseEnum.ROOT_CATEGORY_NAME_IS_UNAVAILABLE
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
      await rootCategoryReposity.updateOne(root_category);
      return {
        code: categoryResponseEnum.SUCCESS
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
      let root_category = await rootCategoryReposity.getOneById(id);
      if (!root_category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        };
      }
      if (!root_category.status) {
        return {
          code: categoryResponseEnum.ROOT_CATEGORY_HAS_BEEN_DELETED
        }
      }

      // Check available category
      const categories = await categoryRepository.getAllByRootCategoryId(id);
      if (categories.length > 0) {
        return {
          code: categoryResponseEnum.CATEGORY_IS_AVAILABLE
        };
      }

      // Delete root category
      root_category.status = false;
      await rootCategoryReposity.updateOne(root_category);
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