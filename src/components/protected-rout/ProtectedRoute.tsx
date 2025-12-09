import { Navigate, useLocation } from 'react-router-dom';
import { getCookie, setCookie } from '../../utils/cookie';

export const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
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
