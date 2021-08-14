export default (_context) => {
  return {
    //CREATE
    addOne(entity) {
      return entity.save();
    },

    //READ
    getAll() {
      return _context.find();
    },

    getOneById(id) {
      return _context.findById(id);
    },

    //UPDATE
    updateOne(entity) {
      return entity.save();
    },
    updateOneById(id, entity) {
      return _context.findByIdAndUpdate(id, entity);
    },

    //DELETE
    async deleteOne(id) {
      await _context.deleteOne({ _id: id });
      return await _context.save();
    },
  };
};
