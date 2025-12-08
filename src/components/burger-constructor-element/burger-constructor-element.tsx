import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveConstructorIngredient,
  removeConstructorIngredient
} from '../../slices/burger-slice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          moveConstructorIngredient({ fromIndex: index, toIndex: index - 1 })
        );
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          moveConstructorIngredient({ fromIndex: index, toIndex: index + 1 })
        );
      }
    };

    const handleClose = () => {
      dispatch(removeConstructorIngredient(ingredient.id)); // используем id
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
