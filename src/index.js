import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/app';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { rootReducer } from './services/reducers';
import thunk from 'redux-thunk';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const actionLogger = store => next => action => {
			// Выводим в консоль время события и его содержание
		console.log(`${new Date().getTime()} | Action: ${JSON.stringify(action)}` );
			// Передаём событие «по конвейеру» дальше
		return next(action);
	};

const errorLogger = store => next => action => {
		if (action.type === 'SOMETHING_FAILED') {
					console.error(`Произошла ошибка: ${JSON.stringify(action)}`)
			}
		return next(action);
	};

const enhancer = composeEnhancers(applyMiddleware(thunk, actionLogger, errorLogger));

const store = createStore(rootReducer, enhancer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();