import Category from '../../models/category.js';

const categoryRepository = {
  //CREATE
  addOne(category) {
    return category.save();
  },

  //READ
  getAll() {
    return Category.find();
  },
  getAllByRootCategoryId(root_category_id) { // By root_category_id
    return Category.find({ root_category_id: root_category_id });
  },
  getOneById(id) {
    return Category.findById(id);
  },
  getOneByName(name) {
    return Category.findOne({ name: name });
  },

  //UPDATE
  updateOne(category) {
    return category.save();
  },

  //DELETE
  deleteOne({ id }) {
    return Category.deleteOne({ _id: id });
  }
}

export default categoryRepository;