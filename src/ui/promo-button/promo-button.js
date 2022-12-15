import React from 'react';
import styles from './promo-button.module.css';
import closeIcon from '../../images/close.svg';
import { PromoContext } from '../../services/productsContext';
import { DiscountContext } from '../../services/appContext';

export const PromoButton = ({ children, extraClass }) => {
	const {setPromo} = React.useContext(PromoContext);
	const {discountDispatcher} = React.useContext(DiscountContext);
  const cancelPromo = () => {
    setPromo('');
    discountDispatcher({type: 'reset'});
  };
  return (
    <button type="button" className={`${styles.button} ${extraClass}`} onClick={cancelPromo}>
      {children}
      <img className={styles.close} src={closeIcon} alt="кнопка закрытия" />
    </button>
  );
};