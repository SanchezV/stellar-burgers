import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { getCookie, setCookie } from '../../utils/cookie';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const location = useLocation();

  const cookieToken = getCookie('accessToken');
  const lsToken = localStorage.getItem('accessToken');
  const isAuth = Boolean(cookieToken || lsToken);

  if (cookieToken && !lsToken) {
    localStorage.setItem('accessToken', cookieToken);
  }

  if (lsToken && !cookieToken) {
    setCookie('accessToken', lsToken);
  }

  if (!isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};

const App = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={state?.background || location}>
        {/* публичные роуты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* авторизация */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* защищённые */}
        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        {/* прямой переход */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        {/* NotFound404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалки */}
      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ингредиент' onClose={() => window.history.back()}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal
                    title='Информация о заказе'
                    onClose={() => window.history.back()}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
