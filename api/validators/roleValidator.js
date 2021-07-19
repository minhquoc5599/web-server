import roleResponseEnum from '../../utils/enums/roleResponseEnum.js';

const roleValidator = (id) => {
  if (!id) {
    return {
      isSuccess: false,
      code: roleResponseEnum.ID_IS_EMPTY
    };
  }
  return {
    isSuccess: true,
    code: roleResponseEnum.VALIDATOR_IS_SUCCESS
  };
}

export default roleValidator;