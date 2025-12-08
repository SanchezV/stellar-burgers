// components/BurgerConstructor.tsx
import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';

import { TConstructorIngredient, TOrder } from '@utils-types';
import { getCookie, setCookie } from '../../utils/cookie';
import { closeOrderModal, createOrder } from '../../slices/orders-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { orderRequest, orderModalData } = useSelector((s) => s.orders);
  const constructor = useSelector((s: RootState) => s.burger);

  const navigate = useNavigate();
  const cookieToken = getCookie('accessToken');
  const lsToken = localStorage.getItem('accessToken');
  const isAuth = Boolean(cookieToken || lsToken);

  if (cookieToken && !lsToken) {
    localStorage.setItem('accessToken', cookieToken);
  } else if (lsToken && !cookieToken) {
    setCookie('accessToken', lsToken);
  }
  const constructorItems = {
    bun: constructor.bun,
    ingredients: constructor.items || []
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    // диспатчим thunk — createOrder возьмёт данные из state.burger.constructor
    dispatch(createOrder());
  };

  const handleCloseModal = () => dispatch(closeOrderModal());

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderModalData as TOrder | null}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
