const { Group, UserGroup } = require('../../../../models');
const { apiResponse } = require('../../../../helpers');

module.exports = {
  validationUserGroup: async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { id: userId } = req.user;

      const checkGroup = await Group.findOne({ _id: groupId, isActive: true });
      if (!checkGroup) {
        res.json(apiResponse({ message: 'Nhóm không tồn tại' }));
      }

      const checkUserGroup = await UserGroup
        .findOne({
          userId,
          groupId,
        })
        .lean();
      if (!checkUserGroup) {
        res.json(apiResponse({ message: 'Người dùng không thuộc nhóm này' }));
      }

      next();
    } catch (error) {
      next(error);
    }
  },
};
