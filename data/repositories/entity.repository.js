export default _context => {
  return {
    //CREATE
    addOne({ entity }) {
      return entity.save();
    },

    //READ
    getAll() {
      return _context.find({}).exec();
    },

    getOneById({ id }) {
      return _context.findById(id).exec();
    },

    //UPDATE
    async updateOne({ entity, id }) {
      await _context.updateOne({ _id: id }, { $set: entity })
      return await _context.save();
    },

    //DELETE
    async deleteOne({ id }) {
      await _context.deleteOne({ _id: id });
      return await _context.save();
    }
  }
};