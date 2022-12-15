import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import { getItemsRequest, applyPromoCodeRequest } from "../../services/fakeApi";
import styles from "./products-container.module.css";
import { Product } from "./product";
import { Input } from "../../ui/input/input";
import { MainButton } from "../../ui/main-button/main-button";
import { PromoButton } from "../../ui/promo-button/promo-button";
import { Loader } from "../../ui/loader/loader";
import { useContext } from "react";
import { TotalPriceContext, DiscountContext } from "../../services/appContext";
import { PromoContext } from "../../services/productsContext";
import { useSelector } from "react-redux";

export const ProductsContainer = () => {
  const { setTotalPrice } = useContext(TotalPriceContext);
  const { discountDispatcher } = useContext(DiscountContext);
	const items = useSelector(store => store.cart.items);
  const [promo, setPromo] = useState("");
  const [itemsRequest, setItemsRequest] = useState(false);
  const [promoFailed, setPromoFailed] = useState(false);
  const [promoRequest, setPromoRequest] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setItemsRequest(true);
    getItemsRequest()
      .then((res) => {
        if (res && res.success) {
          setItemsRequest(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setItemsRequest(false);
      });
  }, []);

  useEffect(() => {
    let total = 0;
    items.map((item) => (total += item.price * item.qty));
    setTotalPrice(total);
  }, [items, setTotalPrice]);

  const applyPromoCode = useCallback(() => {
    const inputValue = inputRef.current.value;
    setPromoRequest(true);
    applyPromoCodeRequest(inputValue)
      .then((res) => {
        if (res && res.success) {
          setPromo(inputValue);
          discountDispatcher({type: 'set', payload: res.discount});
          setPromoRequest(false);
          setPromoFailed(false);
        } else {
          setPromoFailed(true);
          setPromoRequest(false);
          discountDispatcher({type: 'reset'});
          setPromo("");
        }
      })
      .catch((err) => {
        console.log(err);
        setPromoRequest(false);
      });
  }, [discountDispatcher]);

  const content = useMemo(() => {
    return itemsRequest ? (
      <Loader size="large" />
    ) : (
      items.map((item, index) => {
        return (
          <Product
            key={index}
            {...item}
          />
        );
      })
    );
  }, [itemsRequest, items]);

  const promoCodeStatus = useMemo(() => {
    return promoFailed ? (
      <p className={styles.text}>
        Произошла ошибка! Проверьте корректность введенного промокода
      </p>
    ) : promoRequest ? (
      ""
    ) : promo ? (
      <p className={styles.text}>Промокод успешно применён!</p>
    ) : (
      ""
    );
  }, [promoRequest, promo, promoFailed]);

  return (
    <div className={`${styles.container}`}>
        <PromoContext.Provider value={{ promo, setPromo }}>
          {content}
          <div className={styles.promo}>
            <div className={styles.inputWithBtn}>
              <Input
                type="text"
                placeholder="Введите промокод"
                extraClass={styles.input}
                inputWithBtn={true}
                inputRef={inputRef}
              />
              <MainButton
                type="button"
                extraClass={styles.promo_button}
                inputButton={true}
                onClick={applyPromoCode}
              >
                {promoRequest ? (
                  <Loader size="small" inverse={true} />
                ) : (
                  "Применить"
                )}
              </MainButton>
            </div>
            {promo && (
              <PromoButton extraClass={styles.promocode}>{promo}</PromoButton>
            )}
          </div>
        </PromoContext.Provider>
      {promoCodeStatus}
    </div>
  );
};
