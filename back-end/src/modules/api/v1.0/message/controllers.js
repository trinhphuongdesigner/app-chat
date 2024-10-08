const {
  Group, Message,
} = require('../../../../models');
const {
  apiResponse,
  fuzzySearch,
} = require('../../../../helpers');

module.exports = {
  getMessages: async (req, res, next) => {
    try {
      const { id: groupId } = req.params;
      const { id: userId } = req.user;
      const { q, page, limit = 50 } = req.query;
      const currentPage = Math.ceil((!page || page <= 0) ? 1 : +page);

      const conditionFind = { senderId: userId, groupId };

      if (q) {
        const search = fuzzySearch(q);
        conditionFind.name = search;
      }

      const messages = await Group.aggregate()
        .match(conditionFind)
        .lookup({
          from: 'user_groups',
          localField: '_id',
          foreignField: 'groupId',
          as: 'userGroups',
        })
        .sort({ createdAt: -1 })
        .skip(limit * (currentPage - 1))
        .limit(limit);
        // .project({
        //   isActive: 0,
        //   createdAt: 0,
        //   userGroups: {
        //     groupId: 0,
        //     isActive: 0,
        //     createdAt: 0,
        //   },
        // });

      const total = await Group.countDocuments(conditionFind);

      res.json(apiResponse({
        payload: {
          messages,
          total,
        },
      }));
    } catch (error) {
      next(error);
    }
  },

  createMessage: async (req, res, next) => {
    try {
      const { id: groupId } = req.params;
      const { id: userId } = req.user;
      const { message, parentMessageId } = req.body;

      const newMessage = await Message.create({
        message,
        senderId: userId,
        groupId,
        parentMessageId: parentMessageId || null,
      });

      return res.json(apiResponse({
        payload: newMessage,
      }));
    } catch (error) {
      next(error);
    }
  },
};
