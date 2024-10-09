import React from 'react';
import { Link } from 'react-router-dom';
import { LOCATION } from 'utils/constants';

function NotFound() {
  return (
    <div>
      Component not found
      <Link to={LOCATION.HOME}>
        <button type="button">Trở về trang chủ</button>
      </Link>
    </div>
  );
}

export default NotFound;
