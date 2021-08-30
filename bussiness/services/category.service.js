import Category from '../../models/category.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import categoryRepository from '../../data/repositories/category.repository.js';
import categoryValidator from '../../api/validators/categoryValidator.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';
import courseRepository from '../../data/repositories/course.repository.js';

const categoryService = {
  async getAll() {
    try {
      const categories = await categoryRepository.getAll();
      return {
        code: categoryResponseEnum.SUCCESS,
        categories
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
      const resultValidator = categoryValidator.add(root_category_id, name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check root_category_id is available or not
      let root_category = await rootCategoryReposity.getOneById(root_category_id);
      if (!root_category) {
        return {
          code: categoryResponseEnum.ROOT_CATEGORY_ID_IS_INVALID
        };
      }
      if (!root_category.status) {
        return {
          code: categoryResponseEnum.ROOT_CATEGORY_HAS_BEEN_DELETED
        }
      }
      name = name.trim();
      if (root_category.name === name) {
        return {
          code: categoryResponseEnum.CATEGORY_NAME_IS_UNAVAILABLE
        }
      }
      root_category = await rootCategoryReposity.getOneByName(name);
      if (root_category) {
        return {
          code: categoryResponseEnum.CATEGORY_NAME_IS_UNAVAILABLE
        };
      }
      // Check name category is available or not
      let category = await categoryRepository.getOneByName(name);
      if (category) {
        return {
          code: categoryResponseEnum.CATEGORY_NAME_IS_UNAVAILABLE
        };
      }

      // Save category to DB
      category = new Category({ name, root_category_id });
      await categoryRepository.addOne(category);
      return {
        code: categoryResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  // async getOnebyId(id) {
  //   try {
  //     const category = await categoryRepository.getOneById(id);

  //     // check category is available or not
  //     if (!category) {
  //       return {
  //         code: categoryResponseEnum.ID_IS_INVALID
  //       }
  //     }
  //     return {
  //       code: categoryResponseEnum.SUCCESS,
  //       category
  //     };
  //   } catch (e) {
  //     return {
  //       code: categoryResponseEnum.SERVER_ERROR
  //     };
  //   }
  // },

  async updateEntityName(id, name) {
    try {
      // Validate request
      const resultValidator = categoryValidator.updateName(id, name);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name root_category is available or not
      const root_category = await rootCategoryReposity.getOneByName(name);
      if (root_category) {
        return {
          code: categoryResponseEnum.CATEGORY_NAME_IS_UNAVAILABLE
        };
      }
      name = name.trim();
      // Check name category is available or not
      let category = await categoryRepository.getOneByName(name);
      if (category) {
        return {
          code: categoryResponseEnum.CATEGORY_NAME_IS_UNAVAILABLE
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
      await categoryRepository.updateOne(category);
      return {
        code: categoryResponseEnum.SUCCESS
      };
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
  },

  async updateEntityStatus(id, status) {
    try {
      // Validate request
      const resultValidator = categoryValidator.updateStatus(id, status);
      if (resultValidator.code !== categoryResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;
      // Check id category is available or not
      let category = await categoryRepository.getOneById(id);
      if (!category) {
        return {
          code: categoryResponseEnum.ID_IS_INVALID
        }
      }

      // Check available courses
      const courses = await courseRepository.getAllByCategoryId({ category_id: id, status: true });
      if (courses.length > 0) {
        return {
          code: categoryResponseEnum.AVAILABLE_COURSE_LIST
        }
      }

      // Delete category
      category.status = status;
      await categoryRepository.updateOne(category);
      return {
        code: categoryResponseEnum.SUCCESS
      }
    } catch (e) {
      return {
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
  }
}

export default categoryService;