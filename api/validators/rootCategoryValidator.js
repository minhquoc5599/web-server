import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const rootCategoryValidator = {
  add(name) {
    if (!name) {
      return { code: categoryResponseEnum.ROOT_CATEGORY_NAME_IS_EMPTY };
    }
    return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
  },
  updateName(id, name) {
    if (!name) {
      return { code: categoryResponseEnum.ROOT_CATEGORY_NAME_IS_EMPTY };
    }
    if (!id) {
      return { code: categoryResponseEnum.ID_IS_EMPTY };
    }
    return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
  },
  updateStatus(id, status) {
    if (status === null) {
      return { code: categoryResponseEnum.STATUS_IS_EMPTY };
    }
    if (!id) {
      return { code: categoryResponseEnum.ID_IS_EMPTY };
    }
    return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
  }
}

export default rootCategoryValidator;