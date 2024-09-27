const { validationResult } = require('express-validator');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  Employee, Media, Organization, User,
} = require('../../../models');
const {
  apiErrors,
  checkPermission,
  isMongoId,
  generateUniqueFileName,
} = require('../../../helpers');
const Jwt = require('../../../services/jwt');
const { S3 } = require('../../../services/s3');

module.exports = {
  checkAuth: async (req, res, next) => {
    try {
      const { authorization: token } = req.headers;

      if (!token) {
        return next(apiErrors.requireAuthToken);
      }

      const { _id: userId } = await Jwt.verifyToken(token);

      const user = await User.findById(userId).lean();

      if (!user) {
        return next(apiErrors.userNotExists);
      }

      if (user.isBlocked) {
        return next(apiErrors.userIsBlocked);
      }

      req.user = {
        id: user._id,
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(apiErrors.invalidAuthToken);
      }

      if (error.name === 'TokenExpiredError') {
        return next(apiErrors.tokenExpired);
      }

      next(error);
    }
  },

  checkEmployeeAuth: async (req, res, next) => {
    try {
      const { authorization: token } = req.headers;

      if (!token) {
        return next(apiErrors.requireAuthToken);
      }

      const { _id: employeeId } = await Jwt.verifyToken(token);

      const employee = await Employee.findById(employeeId).lean();

      if (!employee) {
        return next(apiErrors.employeeNotExists);
      }

      if (employee.deletedAt) {
        return next(apiErrors.employeeAccountDisabled);
      }

      req.employee = {
        id: employee._id,
        organization: employee.organization,
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(apiErrors.invalidAuthToken);
      }

      if (error.name === 'TokenExpiredError') {
        return next(apiErrors.tokenExpired);
      }

      next(error);
    }
  },

  handleValidate: (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return res.status(400).json({
      ...apiErrors.badRequest,
      errors: errors.array(),
    });
  },

  checkOrganizationDeleted: async (req, res, next) => {
    try {
      const { organization: organizationId } = req.employee;

      const organization = await Organization.findById(organizationId).select(
        'deletedAt',
      );

      if (!organization || organization.deletedAt) {
        return next(apiErrors.organizationNoLongerActive);
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  checkPermission: async (req, res, next) => {
    const currentEmployee = await Employee.findById(req.employee.id)
      .select(
        'firstName lastName middleName avatar deletedAt role organization',
      )
      .populate('role', 'isRoot organization permissions deletedAt')
      .lean();

    if (currentEmployee.deletedAt) {
      return next(apiErrors.employeeAccountDisabled);
    }

    if (!currentEmployee.role) {
      return next(apiErrors.permissionDenied);
    }

    res.locals.currentEmployee = {
      _id: currentEmployee._id,
      firstName: currentEmployee.firstName,
      lastName: currentEmployee.lastName,
      middleName: currentEmployee.middleName,
      avatar: currentEmployee.avatar,
      organization: currentEmployee.organization,
    };

    if (currentEmployee.role && currentEmployee.role.deletedAt) {
      currentEmployee.role.permissions = [];
    }

    const { isAllow, denyRoutes } = checkPermission(
      req._parsedOriginalUrl.pathname,
      req.method.toLowerCase(),
      currentEmployee.role.permissions,
    );

    res.locals.denyRoutes = currentEmployee.role.isRoot ? [] : denyRoutes;

    if (
      currentEmployee.organization.toString()
        !== currentEmployee.role.organization.toString()
      || (!isAllow && !currentEmployee.role.isRoot)
    ) {
      // if (req.xhr) {
      //   return res.status(403).json('Bạn không có quyền thực hiện việc này!');
      // }
      return next(apiErrors.permissionDenied);
    }

    next();
  },

  processMedia: async (next, name, checkMedia) => {
    try {
      let media = null;

      // Kiểm tra xem checkMedia có phải là một chuỗi ObjectId hợp lệ không
      if (isMongoId(checkMedia)) {
        // Nếu checkMedia là ObjectId, kiểm tra xem media có tồn tại không
        media = await Media.findById(checkMedia);
        if (!media) return next(); // Nếu không tìm thấy media, gọi next để xử lý tiếp theo
      } else if (checkMedia && checkMedia.buffer) {
        // Kiểm tra xem checkMedia có phải là một file được tải lên không
        const file = checkMedia;

        // Kiểm tra kích thước của file // Chuyển đổi kích thước sang MB
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
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
        media = new Media({
          name,
          location: url,
          size: `${fileSizeInMB} MB`,
        });

        await media.save();
      } else {
        throw new Error('Không có tập tin hình ảnh được cung cấp');
      }

      return media._id;
    } catch (error) {
      next(error);
    }
  },

  mergeImages: (req, res, next) => {
    const { typeImages, imageIds } = req.body;
    const { imageFiles } = req.files;

    // Tạo một mảng để lưu kết quả gộp lại
    const mergedImages = [];

    let idIndex = 0;
    let fileIndex = 0;

    // Duyệt qua mảng typeImages để xác định loại và gộp
    typeImages.forEach((type) => {
      if (type === 'id') {
        if (idIndex < imageIds.length) {
          mergedImages.push(imageIds[idIndex]);
          idIndex += 1;
        }
      } else if (type === 'file') {
        if (fileIndex < imageFiles.length) {
          mergedImages.push(imageFiles[fileIndex]);
          fileIndex += 1;
        }
      }
    });

    // Gán lại giá trị cho req.body.mergedImages
    req.body.mergedImages = mergedImages;

    next();
  },
};
