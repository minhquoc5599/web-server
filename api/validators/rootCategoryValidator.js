import categoryResponseEnum from '../../utils/enums/categoryResponseEnum.js'

const rootCategoryValidator = (name) => {
  if (!name) {
    return { code: categoryResponseEnum.NAME_IS_EMPTY };
  }
  return { code: categoryResponseEnum.VALIDATOR_IS_SUCCESS };
}

export default rootCategoryValidator;