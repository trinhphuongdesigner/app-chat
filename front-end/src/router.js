import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ChatUI from 'chat/chatUI';
import AuthLayout from 'components/Layout/AuthLayout';
import NonAuthLayout from 'components/Layout/NonAuthLayout';
import Login from 'pages/login';
import NotFound from 'pages/notFound';
import Register from 'pages/register';
import { LOCATION, TOKEN } from 'utils/constants';
// import NotFound from 'Pages/notFound/index.jsx';

// import AuthLayout from 'components/Layout/AuthLayout';
// import NonAuthLayout from 'components/Layout/NonAuthLayout';

const routes = [{ path: LOCATION.HOME, element: <ChatUI /> }];

function AppRouter() {
  const token = window.localStorage.getItem(TOKEN);

  return (
    <div className="container">
      {!token ? (
        <Routes>
          <Route path={LOCATION.LOGIN} element={<Login />} />
          <Route path={LOCATION.REGISTER} element={<Register />} />

          <Route path="*" element={<Navigate to={LOCATION.LOGIN} replace />} />
        </Routes>
      ) : (
        <Routes>
          {routes.map((r) => {
            return (
              <>
                <Route
                  key={crypto.randomUUID()}
                  path={r.path}
                  // element={r.element}
                  element={<AuthLayout>{r.element}</AuthLayout>}
                />

                <Route
                  key="not-found"
                  path={LOCATION.NOT_FOUND}
                  element={
                    <NonAuthLayout>
                      <NotFound />
                    </NonAuthLayout>
                  }
                />
              </>
            );
          })}
          <Route path="*" element={<Navigate to={LOCATION.HOME} replace />} />
        </Routes>
      )}
    </div>
  );
}

export default AppRouter;
