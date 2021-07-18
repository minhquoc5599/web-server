import RootCategory from '../../models/root_category.js'
import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js';
import rootCategoryReposity from '../../data/repositories/root_category.repository.js';
import operatorType from '../../utils/enums/operatorType.js';
import rootCategoryValidator from '../../api/validators/rootCategoryValidator.js';
const rootCategoryService = {
  async getAll() {
    try {
      const listAllResponse = await rootCategoryReposity.getRootCategories();
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
  async addRootCategory(name) {
    // Validate request
    const resultValidator = rootCategoryValidator(name);
    if (!resultValidator.isSuccess) return resultValidator;
    let root_category = await rootCategoryReposity.getRootCategoryByName(name);
    if (root_category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
    if (root_category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.NAME_IS_UNAVAILABLE
      };
    }
    // Save root category to DB
    root_category = new RootCategory({ name });
    console.log(root_category);
    const addResult = await rootCategoryReposity.addRootCategory(root_category);
    if (addResult == operatorType.FAIL.CREATE) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.SERVER_ERROR
      };
    }
    return {
      isSuccess: true,
      root_category,
      code: operatorType.SUCCESS.CREATE
    }
  },

  async getRootCategoryById(id) {
    const root_category = await rootCategoryReposity.getRootCategoryById(id);
    if (root_category === operatorType.FAIL.READ) {
      return {
        isSuccess: false,
        code: operatorType.FAIL.READ
      }
    }
    if (!root_category) {
      return {
        isSuccess: false,
        code: categoryResponseEnum.ID_IS_INVALID
      }
    }
    return {
      isSuccess: true,
      root_category,
      code: operatorType.SUCCESS.READ
    }
  }
}

export default rootCategoryService;