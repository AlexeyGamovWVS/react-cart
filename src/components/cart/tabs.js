import styles from './tabs.module.css';
import { Tab } from './tab';
import { useSelector } from 'react-redux';

export const Tabs = () => {
	const currentTab = useSelector(store => store.cart.currentTab);
  return (
    <div className={`${styles.tabs}`}>
      <Tab text="Товары в корзине" value="items" active={currentTab === 'items'} />
      <Tab text="Отложенные товары" value='postponed' active={currentTab === 'postponed'} />
    </div>
  );
};