import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useLocation } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, fetchOrders } from '../../slices/orders-slice';
import { fetchIngredients } from '../../slices/ingredients-slice';

export const OrderInfo: FC = () => {
  /** DO: взять переменные orderData и ingredients из стора */
  const location = useLocation();
  const dispatch = useDispatch();
  const isFeedPage = location.pathname.startsWith('/feed');
  const isProfileOrdersPage = location.pathname.startsWith('/profile/orders');

  const { ingredients, loading } = useSelector(
    (state: RootState) => state.ingredients
  );
  const { orders, userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (isFeedPage && !orders.length) {
      dispatch(fetchFeeds());
    }
    if (isProfileOrdersPage && !userOrders.length) {
      dispatch(fetchOrders());
    }
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [
    dispatch,
    isFeedPage,
    isProfileOrdersPage,
    orders.length,
    userOrders.length,
    ingredients.length
  ]);

  const orderId = useMemo(() => {
    const match = location.pathname.match(
      /\/(?:feed|profile\/orders)\/([^/]+)/
    );
    return match ? Number(match[1]) : null;
  }, [location.pathname]);

  const orderData: TOrder | undefined = useMemo(() => {
    const source = isFeedPage ? orders : userOrders;
    if (!source.length || !orderId) return undefined;
    return source.find((order) => order.number === orderId);
  }, [isFeedPage, orders, userOrders, orderId]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
