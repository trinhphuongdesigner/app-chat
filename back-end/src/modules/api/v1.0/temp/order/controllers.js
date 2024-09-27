const {
  Order,
  Product,
  OrderHistory,
  Employee,
  Customer,
} = require('../../../../models');
const { apiResponse, formatDate } = require('../../../../helpers');
const { fuzzySearch, asyncForEach } = require('../../../../helpers');
const { PAGINATION, STATUS, ACTIONS } = require('../../../../constants');

module.exports = {
  createOrder: async (req, res, next) => {
    try {
      const {
        shippedDate,
        paymentType,
        status,
        orderDiscount,
        isDelivery,
        totalFee,
        address,
        customerId,
        employeeId,
        orderDetail,
      } = req.body;

      const convertNewDate = new Date();
      convertNewDate.setHours(0, 0, 0, 0);
      const convertShippedDate = new Date(shippedDate);
      convertShippedDate.setHours(0, 0, 0, 0);

      if (convertShippedDate.getTime() < convertNewDate.getTime()) {
        return res.status(400).json({
          status: 400,
          message: 'Thời gian tạo không đúng',
          error: 'Thời gian tạo không đúng',
        });
      }

      const errors = {
        notExits: [],
        notEnoughStock: [],
      };
      let resultsOrderDetail = [];

      await asyncForEach(orderDetail, async (product) => {
        const getProductExits = await Product.findOne({
          _id: product.productId,
          deleteAt: null,
        });

        if (!getProductExits) {
          errors.notExits.push(`${product.productId}`);
        } else if (
          getProductExits.stock < product.quantity
          && getProductExits
        ) {
          errors.notEnoughStock.push(`${product.productId}`);
        }

        // eslint-disable-next-line no-return-assign
        return (resultsOrderDetail = [
          ...resultsOrderDetail,
          {
            productId: product.productId,
            quantity: product.quantity,
            name: product.name || getProductExits.name,
            price: product.price || getProductExits.price,
            discount: product.discount || getProductExits.discount,
            coverImageId: getProductExits.coverImageId || null,
          },
        ]);
      });

      if (errors.notExits.length > 0) {
        return res.status(404).json({
          status: 404,
          message: 'Danh sách sản phẩm không tìm thấy',
          error: errors.notExits,
        });
      }
      if (errors.notEnoughStock.length > 0) {
        return res.status(404).json({
          status: 400,
          message: 'Danh sách sản phẩm vượt quá tồn kho ',
          error: errors.notEnoughStock,
        });
      }

      // Find employee
      let employee = {};
      if (employeeId) {
        employee = await Employee.findOne({
          _id: employeeId,
          deleteAt: null,
        });

        if (!employee) {
          return res.status(404).json({
            status: 404,
            message: 'Nhân viên hiện đang tạo không tồn tại',
            error: 'Nhân viên hiện đang tạo không tồn tại',
          });
        }
      }

      let customer = {};
      if (!isDelivery && customerId) {
        const findCustomer = await Customer.findOne({ _id: customerId });
        customer = findCustomer;
      }

      const newOrder = {
        paymentType,
        status,
        orderDiscount,
        isDelivery: isDelivery || false,
        totalFee,
        customerId: customerId || null,
        employeeId: employeeId || null,
        shippedDate: shippedDate || convertNewDate,
        address: address || customer.address,
        orderDetail: resultsOrderDetail,
      };

      const addOrder = new Order(newOrder);
      const payloadOrder = await addOrder.save();

      // Thực hiện kiểm tra và trừ số lượng sản phẩm trong kho
      await asyncForEach(payloadOrder.orderDetail, async (product) => {
        await Product.findOneAndUpdate(
          { _id: product.productId },
          { $inc: { stock: -product.quantity } },
        );
      });

      const newOrderHistory = {
        employeeId: payloadOrder.employeeId || null,
        customerId: payloadOrder.customerId || null,
        action: ACTIONS.CREATED,
        orderId: payloadOrder._id,
      };

      const addOrderHistory = new OrderHistory(newOrderHistory);
      const payloadOrderHistory = await addOrderHistory.save();

      return res.status(200).json(
        apiResponse({
          message: 'Thêm đơn hàng thành công',
          payload: payloadOrder,
          payloadHistory: payloadOrderHistory,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getAllOrder: async (req, res, next) => {
    try {
      const { status } = req.query;

      let conditionFind;
      if (status) {
        conditionFind = {
          status,
        };
      } else {
        conditionFind = {
          status: {
            $in: Object.values(STATUS.VALUE),
          },
        };
      }

      const payload = await Order.find(conditionFind)
        .populate('customer')
        .populate('employee')
        .populate('orderDetail.coverImage')
        .lean();

      const totalOrder = payload.length;
      return res.status(200).json(
        apiResponse({
          message: 'Lấy thông tin tất cả đơn hàng thành công',
          total: totalOrder,
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  getDetailOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = await Order.findOne({
        _id: id,
      })
        .populate('customer')
        .populate('employee')
        .populate('orderDetail.coverImage')
        .lean();

      const payloadHistoryOrder = await OrderHistory.find({ orderId: id }).populate('employee').populate('customer');

      if (!payload) {
        return next();
      }

      return res.status(200).json(
        apiResponse({
          message: 'Lấy thông tin chi tiết đơn hàng thành công',
          payload,
          payloadHistoryOrder,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  searchOrder: async (req, res, next) => {
    try {
      const {
        keyword,
        productName,
        status,
        page,
        pageSize,
        customerId,
        employeeId,
        startDate,
        endDate,
        isDelivery,
        address,
        paymentType,
        orderDiscount,
      } = req.query;

      const limit = pageSize || PAGINATION.LIMIT;
      const skip = limit * (page - 1) || PAGINATION.SKIP;

      const conditionFind = {};

      if (status) {
        conditionFind.status = status;
      } else {
        conditionFind.status = {
          $in: Object.values(STATUS.VALUE),
        };
      }

      if (productName) {
        conditionFind['orderDetail.name'] = { $regex: fuzzySearch(productName) };
      }

      if (keyword) {
        conditionFind._id = keyword;
      }

      if (startDate && endDate) {
        conditionFind.$or = [
          { createdAt: { $gte: startDate, $lte: endDate } },
          { shippedDate: { $gte: startDate, $lte: endDate } },
        ];
      } else if (startDate) {
        conditionFind.$or = [
          { createdAt: { $gte: startDate } },
          { shippedDate: { $gte: startDate } },
        ];
      } else if (endDate) {
        conditionFind.$or = [
          { createdAt: { $lte: endDate } },
          { shippedDate: { $lte: endDate } },
        ];
      }

      if (customerId) {
        conditionFind.customerId = customerId;
      }

      if (employeeId) {
        conditionFind.employeeId = employeeId;
      }

      if (isDelivery) {
        conditionFind.isDelivery = isDelivery;
      }

      if (paymentType) {
        conditionFind.paymentType = paymentType;
      }

      if (orderDiscount) {
        conditionFind.orderDiscount = orderDiscount;
      }

      if (address) {
        conditionFind.address = address;
      }

      const payload = await Order.find(conditionFind)
        .populate('customer')
        .populate('employee')
        .populate('orderDetail.coverImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const totalOrder = await Order.countDocuments(conditionFind);
      const totalOrderList = payload.length;

      if (payload) {
        return res.status(200).json(
          apiResponse({
            message: 'Tìm kiếm đơn hàng thành công',
            total: totalOrder,
            count: totalOrderList,
            payload,
          }),
        );
      }

      return next();
    } catch (error) {
      next(error);
    }
  },

  updateOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        status, employeeId, shippedDate, address,
      } = req.body;

      const convertShippedDate = new Date(shippedDate);

      const arrayStatusLoop = Object.values(STATUS.VALUE);

      const getOrder = await Order.findOne({
        _id: id,
        status: {
          $nin: [
            STATUS.VALUE.REJECTED,
            STATUS.VALUE.COMPLETED,
            STATUS.VALUE.CANCEL,
            STATUS.VALUE.RESTOCKED,
          ],
        },
      })
        .populate('customer')
        .populate('employee')
        .populate('orderDetail.coverImage');

      if (!getOrder) {
        return next();
      }

      const errors = [];

      let employee;
      if (employeeId) {
        employee = await Employee.findOne({
          _id: employeeId,
          deleteAt: null,
        });
        if (!employee) {
          errors.push('Không tìm thấy nhân viên cập nhật');
        }
      }

      if (status) {
        const indexStatus = arrayStatusLoop.indexOf(status);
        const indexStatusOrder = arrayStatusLoop.indexOf(getOrder.status);
        if (
          indexStatusOrder === arrayStatusLoop.indexOf(STATUS.VALUE.WAITING)
        ) {
          if (
            indexStatus >= arrayStatusLoop.indexOf(STATUS.VALUE.WAITING)
            && indexStatus - arrayStatusLoop.indexOf(STATUS.VALUE.WAITING) !== 1
          ) {
            errors.push('Cập nhật trạng thái sai quy trình');
          }
        } else if (
          indexStatusOrder < arrayStatusLoop.indexOf(STATUS.VALUE.WAITING)
        ) {
          if (
            indexStatusOrder === arrayStatusLoop.indexOf(STATUS.VALUE.FAILED)
          ) {
            if (status !== STATUS.VALUE.RESTOCKED) {
              errors.push(
                'Trạng thái boom hàng chỉ có thể cập nhật sang trạng thái nhập vào lại kho',
              );
            }
          } else {
            errors.push('Không thể cập nhật những trạng thái đã hủy');
          }
        } else if (
          indexStatusOrder > arrayStatusLoop.indexOf(STATUS.VALUE.WAITING)
        ) {
          if (
            indexStatusOrder
            === arrayStatusLoop.indexOf(STATUS.VALUE.DELIVERING)
          ) {
            const checkStatus = [
              STATUS.VALUE.COMPLETED,
              STATUS.VALUE.FAILED,
            ].includes(status);
            if (!checkStatus) {
              errors.push(
                'Trạng thái giao hàng chỉ có thể cập nhật sang hoàn thành và boom hàng',
              );
            }
          } else if (
            indexStatusOrder
              !== arrayStatusLoop.indexOf(STATUS.VALUE.DELIVERING)
            && indexStatus - indexStatusOrder !== 1
          ) {
            errors.push('Cập nhật trạng thái sai quy trình');
          }
          if (
            indexStatusOrder === arrayStatusLoop.indexOf(STATUS.VALUE.COMPLETED)
          ) {
            errors.push('Không thể cập nhật trạng thái đã hoàn thành');
          }
        }
      }

      if (shippedDate && convertShippedDate.getTime() < getOrder.shippedDate.getTime()) {
        errors.push(
          'Cập nhật ngày dự kiến giao không thấp hơn ngày dự kiến giao trước đó',
        );
      }

      if (errors.length > 0) {
        return res.status(400).json({
          status: 400,
          message: 'Cập nhật đơn hàng không hợp lệ',
          error: errors,
        });
      }

      const updateOrderData = {
        ...(status && status !== getOrder.status && { status }),
        ...(employeeId && employeeId !== getOrder.employeeId && { employeeId }),
        ...(shippedDate && convertShippedDate.getTime() !== getOrder.shippedDate.getTime()
          && { shippedDate: convertShippedDate }),
        ...(address && address !== getOrder.address && { address }),
      };

      const updateOrder = await Order.findByIdAndUpdate(
        getOrder._id,
        updateOrderData,
        { new: true },
      );

      const errorsProduct = [];
      const restockedProduct = [];
      if (
        status === STATUS.VALUE.REJECTED
        || status === STATUS.VALUE.CANCEL
        || status === STATUS.VALUE.RESTOCKED
      ) {
        await asyncForEach(updateOrder.orderDetail, async (product) => {
          const updateProduct = await Product.findOneAndUpdate(
            { _id: product.productId, deleteAt: null },
            { $inc: { stock: +product.quantity } },
            { new: true },
          );
          if (!updateProduct) {
            errorsProduct.push(`${product.name} đã xóa`);
          } else {
            restockedProduct.push(updateProduct);
          }
        });
      }

      let newOrderHistory = {
        employeeId: getOrder.employeeId,
        customerId: getOrder.customerId,
        orderId: getOrder._id,
      };

      if (status && status !== getOrder.status) {
        newOrderHistory = {
          ...newOrderHistory,
          action: ACTIONS.UPDATE_STATUS,
          oldContent: `${getOrder.status}`,
          newContent: `${status}`,
        };
      }

      if (employeeId && employeeId !== getOrder.employeeId) {
        newOrderHistory = {
          ...newOrderHistory,
          action: ACTIONS.UPDATE_EMPLOYEE,
          oldContent: `${getOrder.employeeId || null}`,
          newContent: `${employeeId}`,
        };
      }

      if (shippedDate && convertShippedDate.getTime() !== getOrder.shippedDate.getTime()) {
        newOrderHistory = {
          ...newOrderHistory,
          action: ACTIONS.UPDATE_SHIPPED_DATE,
          oldContent: `${formatDate(getOrder.shippedDate)}`,
          newContent: `${formatDate(convertShippedDate)}`,
        };
      }

      if (address && address !== getOrder.address) {
        newOrderHistory = {
          ...newOrderHistory,
          action: ACTIONS.UPDATE_ADDRESS,
          oldContent: `${getOrder.address}`,
          newContent: `${address}`,
        };
      }

      const addOrderHistory = new OrderHistory(newOrderHistory);
      const payloadOrderHistory = await addOrderHistory.save();

      return res.status(200).json(
        apiResponse({
          message: 'Cập nhật đơn hàng thành công',
          payload: updateOrder,
          ...(status === STATUS.REJECTED
            || status === STATUS.CANCEL
            || (status === STATUS.RESTOCKED && {
              ...(errorsProduct.length > 0 && { errorProduct: errorsProduct }),
              ...(restockedProduct.length > 0 && {
                restockedProduct,
              }),
            })),
          payloadHistory: payloadOrderHistory,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  rejectOrder: async (req, res, next) => {
    try {
      const { id } = req.params;

      const rejectOrder = await Order.findOneAndUpdate(
        {
          _id: id,
          $nor: [
            { status: STATUS.VALUE.REJECTED },
            { status: STATUS.VALUE.COMPLETED },
            { status: STATUS.VALUE.CANCEL },
            { status: STATUS.VALUE.RESTOCKED },
            { status: STATUS.VALUE.FAILED },
          ],
        },
        { status: STATUS.VALUE.REJECTED },
        { new: true },
      );

      if (!rejectOrder) {
        return next();
      }

      const newOrderHistory = {
        employeeId: rejectOrder.employeeId || null,
        customerId: rejectOrder.customerId || null,
        action: ACTIONS.UPDATE_STATUS,
        orderId: rejectOrder._id,
      };

      const addOrderHistory = new OrderHistory(newOrderHistory);
      const payloadOrderHistory = await addOrderHistory.save();

      return res.status(200).json(
        apiResponse({
          message: 'Hủy đơn hàng thành công',
          payload: rejectOrder,
          payloadHistory: payloadOrderHistory,
        }),
      );
    } catch (error) {
      next(error);
    }
  },

  // rejectOrderSelected: async (req, res, next) => {
  //   try {
  //     const { idSelected } = req.body;

  //     const errors = [];
  //     const results = [];
  //     await asyncForEach(idSelected, async (id) => {
  //       const rejectOrder = await Order.findOne({
  //         _id: id,
  //         $nor: [{ status: STATUS.REJECTED }, { status: STATUS.COMPLETED }],
  //       });

  //       if (!rejectOrder) {
  //         errors.push(id);
  //       }
  //     });

  //     if (errors.length > 0) {
  //       return res.json({
  //         status: 400,
  //         message: `Hủy đơn hàng không hợp lệ`,
  //         error: errors,
  //       });
  //     }

  //     await asyncForEach(idSelected, async (id) => {
  //       const rejectOrder = await Order.findOneAndUpdate(
  //         { _id: id, $nor: [{ status: STATUS.REJECTED }, { status: STATUS.COMPLETED }] },
  //         { status: STATUS.REJECTED },
  //         { new: true }
  //       );

  //       if (rejectOrder) {
  //         results.push(rejectOrder);
  //       }
  //     });

  //     return res.json(
  //       apiResponse({
  //         message: "Hủy đơn hàng đã chọn thành công",
  //         payload: results,
  //       })
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // },
};
