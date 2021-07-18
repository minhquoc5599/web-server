import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const categoryValidator = (name, root_category_id) => {
  if (!name) {
    return { isSuccess: false, code: categoryResponseEnum.NAME_IS_EMPTY };
  }
  if (!root_category_id) {
    return { isSuccess: false, code: categoryResponseEnum.ROOT_CATEGORY_ID_IS_EMPTY };
  }
  return { isSuccess: true, code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
}

export default categoryValidator;