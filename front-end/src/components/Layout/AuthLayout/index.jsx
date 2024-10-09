import React from 'react';
import PropTypes from 'prop-types';

import AuthHeader from './Header';

function AuthLayout({ children }) {
  return (
    <div>
      <AuthHeader />
      {children}
    </div>
  );
}

export default AuthLayout;

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// AuthLayout.defaultProps = {
// };
