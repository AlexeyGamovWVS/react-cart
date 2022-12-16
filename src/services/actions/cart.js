import { getItemsRequest } from "../fakeApi";

const INCREASE_ITEM = "INCREASE_ITEM";
const DECREASE_ITEM = "DECREASE_ITEM";
const DELETE_ITEM = "DELETE_ITEM";
const CANCEL_PROMO = "CANCEL_PROMO";
const TAB_SWITCH = "TAB_SWITCH";

const GET_ITEMS_REQUEST = "GET_ITEMS_REQUEST";
const GET_ITEMS_SUCCESS = "GET_ITEMS_SUCCESS";
const GET_ITEMS_FAILED = "GET_ITEMS_FAILED";

function getItems() {
  return function (dispatch) {
    dispatch({ type: GET_ITEMS_REQUEST });
    getItemsRequest()
      .then((res) => {
        if (res && res.success) {
          dispatch({ type: GET_ITEMS_SUCCESS, items: res.data });
        } else dispatch({ type: GET_ITEMS_FAILED });
      })
      .catch((err) => dispatch({ type: GET_ITEMS_FAILED }));
  };
}

export {
  INCREASE_ITEM,
  DECREASE_ITEM,
  DELETE_ITEM,
  CANCEL_PROMO,
  TAB_SWITCH,
  getItems,
  GET_ITEMS_REQUEST,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAILED,
};
