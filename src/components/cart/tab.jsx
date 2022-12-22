import React from 'react';
import styles from './tab.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_ITEM,
  ADD_POSTPONED_ITEM,
  TAB_SWITCH,
  DELETE_ITEM,
  DELETE_POSTPONED_ITEM
} from '../../services/actions/cart';
import { useDrop } from 'react-dnd';

export const Tab = ({ text, tabName }) => {

  const dispatch = useDispatch();
  const currentTab = useSelector(state => state.cart.currentTab);
  const movePostponedItem = (item) => {
    dispatch({
      type: ADD_ITEM,
      ...item,
    })
    dispatch({
      type: DELETE_POSTPONED_ITEM,
      ...item,
    })
  }
  const moveItem = (item) => {
    dispatch({
      type: ADD_POSTPONED_ITEM,
      ...item,
    })
    dispatch({
      type: DELETE_ITEM,
      ...item,
    })
  }
  const switchTab = () => {
    dispatch({ type: TAB_SWITCH });
  };

  const [{ isHover }, dropTarget] = useDrop({
    accept: tabName === 'items' ? 'postponed' : 'items',
    collect: monitor => ({
      isHover: monitor.isOver()
    }),
    drop(itemId) {
      currentTab === 'items' ? moveItem(itemId) : movePostponedItem(itemId)
    }
  });

  const className = `${styles.tab} ${currentTab === tabName ? styles.tab_type_current : ''} ${
    isHover ? styles.onHover : ''
  }`;
  return (
    <div ref={dropTarget} className={`${className}`} onClick={switchTab}>
      {text}
    </div>
  );
};