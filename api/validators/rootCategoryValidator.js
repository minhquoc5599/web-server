import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const rootCategoryValidator = (name) => {
  if (!name) {
    return { isSuccess: false, code: categoryResponseEnum.NAME_IS_EMPTY };
  }
  return { isSuccess: true, code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
}

export default rootCategoryValidator;