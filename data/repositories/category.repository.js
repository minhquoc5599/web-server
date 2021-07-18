import Category from '../../models/category.js';
import operatorType from '../../utils/enums/operatorType.js';

const categoryRepository = {
  //CREATE
  addCategory(category) {
    return category.save().catch(() => {
      operatorType.FAIL.CREATE
    });
  },
  //READ
  getCategories() {
    return Category.find().catch(() => {
      operatorType.FAIL.READ
    });
  },
  getCategoryById(id) {
    return Category.findById(id).catch(() => {
      operatorType.FAIL.READ
    })
  },
  getCategoryByName(name) {
    return Category.findOne({ name: name }).catch(() => {
      operatorType.FAIL.READ
    })
  },
  //UPDATE
  updateCategory(category) {
    return category.save().catch(() => {
      operatorType.FAIL.UPDATE
    })
  },
  //DELETE
  deleteCategory({ id }) {
    return Category.deleteOne({ _id: id }).catch(() => {
      operatorType.FAIL.DELETE
    });
  }
}

export default categoryRepository;