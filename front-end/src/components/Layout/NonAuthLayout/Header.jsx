import React from 'react';
import { Link } from 'react-router-dom';
import { LOCATION } from 'utils/constants';

function NonAuthHeader() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* <a className="navbar-brand" href="#">
        Navbar
      </a> */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <Link className="nav-link" to={LOCATION.LOGIN}>
            Đăng nhập
          </Link>
          <Link className="nav-link" to={LOCATION.REGISTER}>
            Đăng kí
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default NonAuthHeader;
