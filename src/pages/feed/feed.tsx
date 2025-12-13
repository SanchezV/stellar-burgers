import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getFeedsThunk,
  selectFeedOrders,
  selectOrdersLoading
} from '../../slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  /** DO: взять переменную из стора */
  const feedOrders: TOrder[] = useSelector(selectFeedOrders);
  const ordersLoading = useSelector(selectOrdersLoading);

  if (ordersLoading || !feedOrders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feedOrders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
