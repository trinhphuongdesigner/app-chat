module.exports = {
  PAGINATION: {
    LIMIT: 10,
    SKIP: 0,
  },

  REGEX: {
    // eslint-disable-next-line no-useless-escape
    MAIL: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    PHONE: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  },

  PAYMENT_TYPE: {
    CASH: 'CASH',
    CARD: 'CARD',
  },

  STATUS: {
    VALUE: {
      CANCEL: 'CANCEL', // Người mua hủy đơn khi chưa được xác nhận
      REJECTED: 'REJECTED', // Nhà bán hủy đơn vừa được tạo
      FAILED: 'FAILED', // Bom hàng
      RESTOCKED: 'RESTOCKED', // Nhập lại hàng vào kho
      WAITING: 'WAITING', // Đặt hàng thành công
      DELIVERING: 'DELIVERING', // Nhà bán xác nhận đơn và đang đóng gói - giao đến khách hàng
      COMPLETED: 'COMPLETED', // Giao hàng thành công
    },
    CONVERT: {
      CANCEL: 'người mua hủy đơn hàng',
      REJECTED: 'người bán hủy đơn hàng',
      FAILED: 'xác nhận bom hàng',
      RESTOCKED: 'đơn hàng hoàn trả',
      WAITING: 'đang chờ',
      DELIVERING: 'đang giao hàng',
      COMPLETED: 'hoàn thành',
    },
  },

  ACTIONS: {
    CREATED: 'CREATED',
    UPDATE_STATUS: 'UPDATE_STATUS',
    UPDATE_ADDRESS: 'UPDATE_ADDRESS',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    UPDATE_SHIPPED_DATE: 'UPDATE_SHIPPED_DATE',
  },
};
