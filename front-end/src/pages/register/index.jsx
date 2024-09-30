/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
import React from 'react';

import './index.scss';

function Register() {
  return (
    <div className="register-page">
      <div className="form">
        <form className="register-form">
          <input type="text" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button>create</button>
          <div className="link-action">
            <span>Already registered?</span>
            <a href="#">Sign In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
