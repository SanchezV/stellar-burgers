import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../slices/auth-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error || ''}
    />
  );
};
