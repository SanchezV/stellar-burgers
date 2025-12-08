import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredients } from '../../slices/ingredients-slice';
import { useParams } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { ingredients, loading } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (loading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
