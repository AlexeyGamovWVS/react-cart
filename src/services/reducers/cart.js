import {
  INCREASE_ITEM,
  DECREASE_ITEM,
  DELETE_ITEM,
  CANCEL_PROMO,
  TAB_SWITCH,
} from "../actions/cart";

import { recommendedItems, items } from "../initialData";

const initialState = {
  items: items,
  recommendedItems: recommendedItems,
  promoCode: "",
  promoDiscount: null,
  currentTab: "items",
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_ITEM:
      return {
        ...state,
        items: [...state.items].map((item) =>
          item.id === action.id ? { ...item, qty: item.qty + 1 } : item
        ),
      };
    case DECREASE_ITEM:
      return {
        ...state,
        items: [...state.items].map((item) =>
          item.id === action.id ? { ...item, qty: item.qty - 1 } : item
        ),
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: [...state.items].filter((item) => item.id !== action.id),
      };
    case CANCEL_PROMO:
      return {
        ...state,
        promoCode: "",
        promoDiscount: null,
      };
    case TAB_SWITCH:
      return {
        ...state,
        currentTab: state.currentTab === "items" ? "postponed" : "items",
      };
    default:
      return state;
  }
};
