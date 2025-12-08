import React, { FC, memo, RefObject } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { IngredientsCategory } from '@components';
import { BurgerIngredientsUIProps } from './type';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    buns,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => {
    const handleTabClick = (val: string) => {
      onTabClick(val);

      let targetRef: RefObject<HTMLHeadingElement> | null = null;
      if (val === 'bun') targetRef = titleBunRef;
      else if (val === 'main') targetRef = titleMainRef;
      else if (val === 'sauce') targetRef = titleSaucesRef;

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    return (
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value='bun'
              active={currentTab === 'bun'}
              onClick={handleTabClick}
            >
              Булки
            </Tab>
            <Tab
              value='main'
              active={currentTab === 'main'}
              onClick={handleTabClick}
            >
              Начинки
            </Tab>
            <Tab
              value='sauce'
              active={currentTab === 'sauce'}
              onClick={handleTabClick}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
        <div className={styles.content}>
          <div data-type='buns'>
            <IngredientsCategory
              title='Булки'
              titleRef={titleBunRef}
              ingredients={buns}
              ref={bunsRef}
            />
          </div>
          <div data-type='mains'>
            <IngredientsCategory
              title='Начинки'
              titleRef={titleMainRef}
              ingredients={mains}
              ref={mainsRef}
            />
          </div>
          <div data-type='sauces'>
            <IngredientsCategory
              title='Соусы'
              titleRef={titleSaucesRef}
              ingredients={sauces}
              ref={saucesRef}
            />
          </div>
        </div>
      </section>
    );
  }
);
