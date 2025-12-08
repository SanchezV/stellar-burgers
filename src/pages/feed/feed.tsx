import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../slices/orders-slice';

export const Feed: FC = () => {
  /** DO: взять переменную из стора */
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
