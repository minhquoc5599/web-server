import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const categoryValidator = {
  addValidator(root_category_id, name) {
    if (!name) {
      return { code: categoryResponseEnum.NAME_IS_EMPTY };
    }
    if (!root_category_id) {
      return { code: categoryResponseEnum.ROOT_CATEGORY_ID_IS_EMPTY };
    }
    return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
  },
  updateValidator(id, name) {
    if (!name) {
      return { code: categoryResponseEnum.NAME_IS_EMPTY };
    }
    if (!id) {
      return { code: categoryResponseEnum.ID_IS_EMPTY };
    }
    return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
  }

}

export default categoryValidator;