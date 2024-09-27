const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { S3 } = require('../../../../services/s3');
const { Media } = require('../../../../models');
const {
  fuzzySearch,
  apiResponse,
  isMongoId,
  asyncForEach,
  generateUniqueFileName,
} = require('../../../../helpers');
const { PAGINATION } = require('../../../../constants');

module.exports = {
  uploadSingleMedia: async (req, res, next) => {
    try {
      const { name } = req.body;
      const { file } = req;

      if (!file) {
        throw new Error('Không có tập tin hình ảnh được cung cấp');
      }

      // Kiểm tra kích thước của file
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Chuyển đổi kích thước sang MB
      if (fileSizeInMB > 5) {
        throw new Error('Kích thước file không được vượt quá 5MB.');
      }

      const fileName = generateUniqueFileName(file.originalname);

      await S3.send(
        new PutObjectCommand({
          Body: file.buffer,
          Bucket: 'warehouse',
          Key: fileName,
          ContentType: file.mimetype,
        }),
      );

      const url = `${process.env.R2_DEV_URL}/warehouse/${fileName}`;

      // Tạo mới media
      const media = new Media({
        name,
        location: url,
        size: `${fileSizeInMB} MB`,
      });

      await media.save();
      return res.json(
        apiResponse({
          payload: media,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  uploadMultipleMedias: async (req, res, next, type = 'controller') => {
    try {
      const { name } = req.body;
      const { files } = req;

      if (!files || files.length === 0) {
        throw new Error('Không có tập tin hình ảnh được cung cấp');
      }

      const uploadedMedia = [];

      await asyncForEach(files, async (file, index) => {
        // Kiểm tra kích thước của file
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        if (fileSizeInMB > 5) {
          throw new Error(
            `Kích thước file "${file.originalname}" không được vượt quá 5MB.`,
          );
        }

        const fileName = generateUniqueFileName(file.originalname);

        await S3.send(
          new PutObjectCommand({
            Body: file.buffer,
            Bucket: 'warehouse',
            Key: fileName,
            ContentType: file.mimetype,
          }),
        );

        const url = `${process.env.R2_DEV_URL}/warehouse/${fileName}`;

        const media = new Media({
          name: `${name}(${index + 1})`, // Tạo tên duy nhất cho mỗi media
          location: url,
          size: `${fileSizeInMB} MB`,
        });

        const savedMedia = await media.save();
        uploadedMedia.push(savedMedia);
      });

      if (type !== 'controller') {
        return uploadedMedia;
      }
      return res.json(
        apiResponse({
          payload: uploadedMedia,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  allMedias: async (req, res, next) => {
    try {
      const medias = await Media.find({}).sort({ createdAt: -1 });
      const totalMedias = medias.length;

      return res.json(apiResponse({ payload: medias, total: totalMedias }));
    } catch (error) {
      next(error);
    }
  },

  listMedias: async (req, res, next) => {
    try {
      const { page, pageSize, keyword } = req.query;
      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = {};

      if (keyword) {
        conditionFind.name = { $regex: fuzzySearch(keyword) }; // Sửa dấu ":" thành "="
      }

      const medias = await Media.find(conditionFind)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalResult = await Media.countDocuments(conditionFind);
      const totalResultPerPage = medias.length;

      return res.json(
        apiResponse({
          payload: medias,
          total: totalResult,
          totalPerPage: totalResultPerPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  detailMedia: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!isMongoId(id)) return next();

      const media = await Media.findOne({
        _id: id,
      }).select('-createdAt -updatedAt ');

      if (!media) return next();

      return res.json(apiResponse({ payload: media }));
    } catch (error) {
      next(error);
    }
  },

  deleteMedia: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Xóa media từ cơ sở dữ liệu
      const media = await Media.findOneAndDelete({ _id: id });

      if (!media) return next();

      // Trích xuất key từ URL
      const url = media.location;
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1]; // Key là phần cuối cùng của URL

      // Xóa đối tượng từ Amazon S3

      await S3.send(
        new DeleteObjectCommand({
          Bucket: 'warehouse',
          Key: fileName,
        }),
      );

      return res.json(apiResponse({ payload: media }));
    } catch (error) {
      next(error);
    }
  },

  deleteMedias: async (req, res, next) => {
    try {
      const { ids } = req.body;

      // Kiểm tra xem ids có phải là một mảng và tất cả các phần tử trong mảng có phải là id không
      const areAllIdsValid = Array.isArray(ids) && ids.every(id => isMongoId(id));
      if (!areAllIdsValid) {
        return res.status(400).json({
          message: 'Ids phải là một mảng các id hợp lệ',
          error: 'Ids không hợp lệ',
        });
      }

      const errors = [];
      const results = [];

      // Tạo mảng promises cho việc xóa media và đối tượng trong bucket
      const deletePromises = ids.map(async (id) => {
        try {
          // Xóa media từ cơ sở dữ liệu
          const media = await Media.findOneAndDelete({ _id: id });

          if (!media) {
            errors.push(`${media.name}`);
          }

          // Trích xuất key từ URL
          const url = media.location;
          const urlParts = url.split('/');
          const fileName = urlParts[urlParts.length - 1]; // Key là phần cuối cùng của URL

          // Xóa đối tượng từ Amazon S3
          await S3.send(
            new DeleteObjectCommand({
              Bucket: 'warehouse',
              Key: fileName,
            }),
          );

          results.push(`Media ${media.name} đã được xóa thành công`);
        } catch (error) {
          errors.push(
            `Xảy ra lỗi khi xóa media với id ${id}: ${error.message}`,
          );
        }
      });

      // Chờ tất cả các promises hoàn thành
      await Promise.all(deletePromises);

      if (errors.length > 0) {
        return res.status(404).json({
          message: `Xóa hình ảnh ${errors} không thành công`,
          errors: `${errors}`,
        });
      }

      return res.json(apiResponse({ payload: results }));
    } catch (error) {
      next(error);
    }
  },
};
