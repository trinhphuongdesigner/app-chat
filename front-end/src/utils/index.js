import { toast } from 'react-toastify';
import moment from 'moment';

export const convertIsoDateToString = (date, format = 'YYYY.MM.DD') => {
  if (date === '' || date === undefined || date === null) return '';

  return moment(new Date(date)).format(format);
};

export const convertCapitalString = (str) => {
  const mess = str.trim();
  return mess.charAt(0).toUpperCase() + mess.slice(1).toLowerCase();
};

export const showSuccess = (mess) => {
  toast.success(convertCapitalString(mess));
};

export const showError = (mess) => {
  toast.error(convertCapitalString(mess));
};

export const handleErrorResponse = (error, defaultMessage) => {
  let errorsMessage = defaultMessage || '';
  if (error.response) {
    if (error.response.data.message) {
      errorsMessage = error.response.data.message;
    } else if (error.response.data.errors) {
      const { errors } = error.response.data;
      errorsMessage = errors.join(', ');
    }
  }

  showError(errorsMessage);
};

export const handleErrorResponseCustom = (message, error) => {
  if (error.response) {
    let errorsMessage = '';
    if (error.response.data.error) {
      if (typeof error.response.data.error === 'string') {
        errorsMessage = error.response.data.error;
        showError(errorsMessage);
      } else if (error.response.data.error.length > 0) {
        error.response.data.error.forEach((nestedError) => {
          errorsMessage = nestedError;
          showError(errorsMessage);
        });
      }
    } else if (error.response.data.errors) {
      error.response.data.errors.forEach((nestedError) => {
        errorsMessage = nestedError;
        showError(errorsMessage);
      });
    }
  } else {
    showError(message);
  }
};

export const getParamsFormObject = (queries) => {
  const validQueries = {};
  Object.keys(queries).forEach((key) => {
    const value = queries[key];
    // Kiểm tra nếu giá trị không phải là "", undefined hoặc null
    if (value !== '' && value !== undefined && value !== null) {
      validQueries[key] = String(value); // Chuyển đổi giá trị thành chuỗi và thêm vào validQueries
    }
  });

  const searchParams = new URLSearchParams(validQueries);
  return `?${searchParams.toString()}`;
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
