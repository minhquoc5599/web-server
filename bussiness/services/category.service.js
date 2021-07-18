import Category from '../../models/category.js';
import operatorType from '../../utils/enums/operatorType.js';
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import categoryRepository from '../../data/repositories/category.repository.js';
import categoryValidator from '../../api/validators/categoryValidator.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';

const categoryService = {
  async getAll() {
    try {
      const listAllResponse = await categoryRepository.getCategories();
      return {
        isSuccess: true,
        code: categoryResponseEnum.SUCCESS,
        listAllResponse: listAllResponse
      }
    } catch (e) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
  },

  async addCategory(name, root_category_id) {
    // Validate request
    const resultValidator = categoryValidator(name, root_category_id);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check name category is available or not
    let category = await categoryRepository.getCategoryByName(name);
    console.log(category);
    if (category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
    if (category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.NAME_IS_UNAVAILABLE
      };
    }

    // Check root_category_id is available or not
    let root_category = await rootCategoryReposity.getRootCategoryById(root_category_id);
    if (root_category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
    if (!root_category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.ROOT_CATEGORY_ID_IS_UNAVAILABLE
      }
    }

    // Save category to DB
    category = new Category({ name, root_category_id });
    const addResult = await categoryRepository.addCategory(category);
    if (addResult === operatorType.FAIL.CREATE) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      }
    }
    return {
      isSuccess: true,
      category,
      code: operatorType.SUCCESS.CREATE
    }
  },

  async getCategorybyId(id) {
    const category = await categoryRepository.getCategoryById(id);
    if (category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    // check category is available or not
    if (!category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.ID_IS_INVALID
      }
    }
    return {
      isSuccess: true,
      category,
      code: operatorType.SUCCESS.READ
    }
  },

  async updateCategory(id, name) {
    // Validate request
    const resultValidator = categoryValidator(name, id);
    if (!resultValidator.isSuccess) return resultValidator;

    // Check name category is available or not
    let category = await categoryRepository.getCategoryByName(name);
    if (category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
    if (category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.NAME_IS_UNAVAILABLE
      };
    }

    // Check id category is available or not
    category = await categoryRepository.getCategoryById(id);
    if (category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.ID_IS_INVALID
      }
    }

    // Update category to DB
    category.name = name;
    const update = await categoryRepository.updateCategory(category)
    if (update === operatorType.FAIL.UPDATE) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.UPDATE
      }
    }
    return {
      isSuccess: true,
      update,
      code: operatorType.SUCCESS.UPDATE
    }
  }
}

export default categoryService;