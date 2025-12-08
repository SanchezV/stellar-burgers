import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { forgotPassword } from '../../slices/auth-slice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const result = await dispatch(forgotPassword({ email }));

      if (forgotPassword.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      } else {
        setErrorText(
          (result.payload as string) || 'Ошибка восстановления пароля'
        );
      }
    } catch (err: any) {
      setErrorText(err.message || 'Ошибка восстановления пароля');
    }
  };

  return (
    <ForgotPasswordUI
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      errorText={errorText}
    />
  );
};
