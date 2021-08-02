export default _context => {
  return {
    //CREATE
    addOne(entity) {
      return entity.save();
    },

    //READ
    getAll() {
      return _context.find({ status: true });
    },

    getOneById(id) {
      return _context.findById(id);
    },

    getAllByCategoryId(query) {
      return _context.find(query);
    },

    getAllByName(name) {
      return _context.find({ $text: { $search: name }, status: true });
    },

    //UPDATE
    updateOne(id, entity) {
      return _context.findByIdAndUpdate(id, entity);
    },

    //DELETE
    async deleteOne(id) {
      await _context.deleteOne({ _id: id });
      return await _context.save();
    }
  }
};