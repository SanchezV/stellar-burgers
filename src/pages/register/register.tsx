import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../slices/auth-slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const result = await dispatch(
        registerUser({ name: userName, email, password })
      );

      if (registerUser.fulfilled.match(result)) {
        navigate('/', { replace: true });
      } else {
        setErrorText((result.payload as string) || 'Ошибка регистрации');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Ошибка регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
