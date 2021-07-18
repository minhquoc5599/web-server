import RootCategory from '../../models/root_category.js'
import operatorType from "../../utils/enums/operatorType.js"

const rootCategoryReposity = {
  //CREATE
  addRootCategory(root_category) {
    return root_category.save().catch(() => {
      operatorType.FAIL.CREATE
    });
  },

  //READ
  getRootCategories() {
    return RootCategory.find().catch(() => {
      operatorType.FAIL.READ
    });
  },
  getRootCategoryById(id) {
    return RootCategory.findById(id).catch(() => {
      operatorType.FAIL.READ
    })
  },
  getRootCategoryByName(name) {
    return RootCategory.findOne({ name: name }).catch(() => {
      operatorType.FAIL.READ
    })
  },

  //UPDATE
  updateRootCategory(root_category) {
    return root_category.save().catch(() => {
      operatorType.FAIL.UPDATE
    })
  },
  //DELETE
  deleteRootCategory(id) {
    return RootCategory.deleteOne({ _id: id }).catch(() => {
      operatorType.FAIL.DELETE
    })
  }
}

export default rootCategoryReposity;