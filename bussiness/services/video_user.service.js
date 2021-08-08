import VideoUser from "../../models/video_user.js";
import entityRepository from "../../data/repositories/entity.repository.js";
import videoUserRepository from "../../data/repositories/video_user.repository.js";
import videoUserResponseEnum from "../../utils/enums/videoUserResponseEnum.js";

const videoUserService = {
  async getAll() {
    try {
      const videos_users = await videoUserRepository.getAll();
      return {
        code: videoUserResponseEnum.SUCCESS,
        videos_users,
      };
    } catch (e) {
      return {
        code: videoUserResponseEnum.SERVER_ERROR,
      };
    }
  },

  async addOne() {},

  async getOnebyId() {},

  async updateOne() {},

  async deleteOne() {},
};

export default videoUserService;
