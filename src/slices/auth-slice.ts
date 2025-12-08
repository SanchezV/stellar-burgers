// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from './../utils/burger-api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: TUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  loading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  { accessToken: string; refreshToken: string; user: TUser },
  TRegisterData,
  { rejectValue: string }
>('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      user: res.user
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  { accessToken: string; refreshToken: string; user: TUser },
  TLoginData,
  { rejectValue: string }
>('auth/loginUser', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      user: res.user
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка авторизации');
  }
});

export const forgotPassword = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    await forgotPasswordApi({ email });
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка восстановления пароля');
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка сброса пароля');
  }
});

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      if (res.success && res.user) return res.user;
      return rejectWithValue('Не удалось получить данные пользователя');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка получения пользователя');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    if (res.success && res.user) return res.user;
    return rejectWithValue('Не удалось обновить данные пользователя');
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка обновления пользователя');
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка выхода');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  }
});

export default authSlice.reducer;
