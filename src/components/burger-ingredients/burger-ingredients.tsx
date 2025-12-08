import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '.././ui/burger-ingredients';
import { fetchIngredients } from '../../slices/ingredients-slice';
export const BurgerIngredients = () => {
  const dispatch = useDispatch();
  const { ingredients, loading } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const buns: TIngredient[] = ingredients.filter((i) => i.type === 'bun');
  const mains: TIngredient[] = ingredients.filter((i) => i.type === 'main');
  const sauces: TIngredient[] = ingredients.filter((i) => i.type === 'sauce');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  if (loading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={(val: string) => setCurrentTab(val as TTabMode)}
    />
  );
};
