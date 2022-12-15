import { Tabs } from './tabs';
import { ProductsContainer } from './products-container';
import { useSelector } from 'react-redux';
import { Postponed } from './postponed';

export const Cart = () => {
	const currentTab = useSelector(store => store.cart.currentTab);
  return (
    <section>
      <Tabs />
			{currentTab === 'items' ? (<ProductsContainer/>) : (<Postponed />)}
    </section>
  );
};