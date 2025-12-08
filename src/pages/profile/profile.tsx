import { ProfileUI } from '@ui-pages';
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';
import { getUser, updateUser } from '../../slices/auth-slice';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, accessToken, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const token = accessToken || localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getUser())
        .unwrap()
        .then((data) => {
          setFormValue({ name: data.name, email: data.email, password: '' });
        })
        .catch(() => {});
    }
  }, [dispatch, accessToken, navigate]);

  useEffect(() => {
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const isFormChanged =
    user &&
    (formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {})
      };
      const result = await dispatch(updateUser(updatedUserData));

      if (updateUser.fulfilled.match(result)) {
        setFormValue({
          name: result.payload.name,
          email: result.payload.email,
          password: ''
        });
      }
    } catch {}
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({ name: user.name, email: user.email, password: '' });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && !user) {
    return (
      <p className='text text_type_main-medium mt-20'>Загрузка профиля...</p>
    );
  }

  if (!accessToken) {
    return null;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={!!isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={error || ''}
    />
  );
};
