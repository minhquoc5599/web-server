import cloudinary from "cloudinary";

import Video from "../../models/video.js";
import videoValidator from "../../api/validators/videoValidator.js";
import videoResponseEnum from "../../utils/enums/videoResponseEnum.js";
import videoRepository from "../../data/repositories/video.repository.js";

const videoService = {
  async addOne(request) {
    try {
      let url = "";
      const resultValidator = videoValidator.addOne(
        request.courseId,
        request.title,
        request.video
      );
      if (resultValidator.code !== videoResponseEnum.SUCCESS) {
        return resultValidator;
      }
      const result = await cloudinary.v2.uploader.upload(request.video, {
        resource_type: "video",
      });
      url = result.secure_url;
      const video = new Video({
        course_id: request.courseId,
        title: request.title,
        video: url,
        is_previewed: request.isPreviewed,
        status: true,
      });
      await video.save();
      return {
        code: videoResponseEnum.SUCCESS,
      };
    } catch (e) {
      console.log(e);
      return { code: videoResponseEnum.SERVER_ERROR };
    }
  },

  async getAllByCourseId(course_id) {
    try {
      const videos = await videoRepository.getAllByCourseId(course_id);
      return {
        code: videoResponseEnum.SUCCESS,
        videos,
      };
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR,
      };
    }
  },

  async updateOne(id, title, video, is_previewed) {
    try {
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR,
      };
    }
  },

  async deleteOne(id) {
    try {
      // Check id video
      const video = await videoRepository.getOneById(id);
      if (!video) {
        return {
          code: videoResponseEnum.ID_IS_EMPTY,
        };
      }

      // Delete video
      const del = await videoRepository.deleteOne(id);
      return {
        code: videoResponseEnum.SUCCESS,
      };
    } catch (e) {
      return {
        code: videoResponseEnum.SERVER_ERROR,
      };
    }
  },
};

export default videoService;
