import RootCategory from '../../models/root_category.js'

const rootCategoryReposity = {
  //CREATE
  addOne(root_category) {
    return root_category.save();
  },

  //READ
  getAll() {
    return RootCategory.find({ status: true });
  },
  getOneById(id) {
    return RootCategory.findById(id);
  },
  getOneByName(name) {
    return RootCategory.findOne({ name: name });
  },

  //UPDATE
  updateOne(root_category) {
    return root_category.save();
  },

  //DELETE
  deleteOne(id) {
    return RootCategory.deleteOne({ _id: id });
  }
}

export default rootCategoryReposity;