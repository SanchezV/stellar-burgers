import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../slices/orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** DO: взять переменную из стора */
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length]);

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
