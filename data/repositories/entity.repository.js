export default _context => {
  return {
    //CREATE
    addOne(entity) {
      return entity.save();
    },

    //READ
    getAll() {
      return _context.find({}).lean().exec();
    },

    getOneById(id) {
      return _context.findById(id).lean().exec();
    },

    getAllByCategoryId(category_id) {
      return _context.find(category_id).lean().exec();
    },

    getAllByName(name) {
      return _context.find({ $text: { $search: name } }).lean().exec();
    },

    //UPDATE
    updateOne(entity) {
      return entity.save();
    },

    //DELETE
    async deleteOne(id) {
      await _context.deleteOne({ _id: id });
      return await _context.save();
    }
  }
};