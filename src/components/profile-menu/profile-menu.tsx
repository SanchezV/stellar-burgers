import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUserThunk } from '../../slices/auth-slice';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    <Navigate replace to={'/login'} />;
    dispatch(logoutUserThunk());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
