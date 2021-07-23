import Video from '../../models/video.js';
import videoResponseEnum from '../../utils/enums/videoResponseEnum.js';
import videoRepository from '../../data/repositories/video.repository.js';
import videoValidator from '../../api/validators/videoValidator.js';

const videoService = {
  async addOne(course_id, title, video, is_previewed) {
    try {
      // Validate request
      const resultValidator = videoValidator.addValidator(course_id, title, video);
      if (resultValidator.code !== videoResponseEnum.VALIDATOR_IS_SUCCESS) return resultValidator;

      // Check name title
      let addVideo = await videoRepository.getOneByTitle(title);
      if (addVideo) {
        return {
          code: videoResponseEnum.TITLE_IS_UNAVAILABLE
        };
      }

      addVideo = new Video({ course_id, title, video, is_previewed });
      const addResult = await videoRepository.addOne(addVideo);
      return {
        code: videoResponseEnum.SUCCESS,
        video: addResult
      };
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR
      };
    }
  },

  async getAllByCourseId(course_id) {
    try {
      const videos = await videoRepository.getAllByCourseId(course_id);
      return {
        code: videoResponseEnum.SUCCESS,
        videos
      }
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR
      };
    }
  },

  async updateOne(id, title, video, is_previewed) {
    try {

    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR
      };
    }
  },

  async deleteOne(id) {
    try {
      // Check id video
      const video = await videoRepository.getOneById(id);
      if (!video) {
        return {
          code: videoResponseEnum.ID_IS_EMPTY
        };
      }

      // Delete video
      const del = await videoRepository.deleteOne(id);
      return {
        code: videoResponseEnum.SUCCESS
      };
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR
      };
    }
  }
}

export default videoService;