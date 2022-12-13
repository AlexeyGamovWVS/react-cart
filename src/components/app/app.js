import React, {useReducer, useState} from "react";
import styles from "./app.module.css";
import { Title } from "../../ui/title/title";
import { Cart } from "../cart";
import { TotalPrice } from "../common/total-price";
import { TotalPriceContext, DiscountContext } from "../../services/appContext";

const discountInitialState = { discount: null };

function reducer(state, action) {
  switch (action.type) {
    case "set":
      return { discount: action.payload };
    case "reset":
      return discountInitialState;
    default:
      throw new Error(`Wrong type of action: ${action.type}`);
  }
}

function App() {
  const [totalPrice, setTotalPrice] = useState(0);
  //const [discount, setDiscount] = React.useState(null);
	const [discountState, discountDispatcher] = useReducer(reducer, discountInitialState, undefined);

  return (
    <div className={styles.app}>
      <TotalPriceContext.Provider value={{ totalPrice, setTotalPrice }}>
        <DiscountContext.Provider value={{ discountState, discountDispatcher }}>
          <Title text={"Корзина"} />
          <Cart />
          <TotalPrice />
        </DiscountContext.Provider>
      </TotalPriceContext.Provider>
    </div>
  );
}

export default App;
