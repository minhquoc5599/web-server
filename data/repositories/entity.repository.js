export default _context => {
  return {
    //CREATE
    addOne(entity) {
      return entity.save();
    },

    //READ
    getAll() {
      return _context.find({}).exec();
    },

    getOneById(id) {
      return _context.findById(id).exec();
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