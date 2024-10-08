const {
  Message,
} = require('../../../../models');
const {
  apiResponse,
  fuzzySearch,
  toObjectId,
} = require('../../../../helpers');

module.exports = {
  getMessages: async (req, res, next) => {
    try {
      const { groupId } = req.params;
      const { id: userId } = req.user;
      const { q, page, limit = 50 } = req.query;
      const currentPage = Math.ceil((!page || page <= 0) ? 1 : +page);

      const conditionFind = { senderId: toObjectId(userId), groupId: toObjectId(groupId) };

      if (q) {
        const search = fuzzySearch(q);
        conditionFind.message = search;
      }

      const messages = await Message.aggregate()
        .match(conditionFind)
        .lookup({
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender',
        })
        .unwind('sender')
        .lookup({
          from: 'groups',
          localField: 'groupId',
          foreignField: '_id',
          as: 'group',
        })
        .unwind('group')
        .lookup({
          from: 'messages',
          localField: 'parentMessageId',
          foreignField: '_id',
          as: 'parentMessage',
        })
        .unwind({
          path: '$parentMessage',
          preserveNullAndEmptyArrays: true,
        })
        .sort({ createdAt: -1 })
        .skip(limit * (currentPage - 1))
        .limit(limit)
        .project({
          senderId: 0,
          groupId: 0,
          // parentMessageId: 0,
          updatedAt: 0,
          sender: {
            password: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
          },
          group: {
            createdAt: 0,
            updatedAt: 0,
          },
          parentMessage: {
            senderId: 0,
            groupId: 0,
            parentMessageId: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        });

      const total = await Message.countDocuments(conditionFind);

      res.json(apiResponse({
        payload: {
          messages,
          total,
        },
      }));
    } catch (error) {
      console.log('🔥🔥🔥««««« error »»»»»🚀🚀🚀', error);
      next(error);
    }
  },

  createMessage: async (req, res, next) => {
    try {
      const { groupId } = req.params;
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
