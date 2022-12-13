# Ссылка на проект

[Перейти ->](https://alexeygamovwvs.github.io/react-cart)

# Tasks

Провести рефакторинг и при помощи React Context API упростить взаимодействие разработчиков с состоянием приложения.
Вносить исправления нужно в нескольких файлах: app/app.js, cart/index.js, cart/products-container.js, common/total-price.js и ui/promo-button.js.

## Рефакторинг глобального состояния

Глобальный стейт хранится в компоненте App. Там определены состояния totalPrice и discount, и они передаются дочерним компонентам с помощью пропсов. Чтобы перенести эти состояния на механизм контекста:

1. Создайте файл appContext.js в директории services и определите в нём контексты для скидки и общей стоимости товаров:

```jsx
export const TotalPriceContext = React.createContext(null);
export const DiscountContext = React.createContext(null);
```

2. Реализуйте провайдеры контекста в компоненте App. Они создают «область видимости», внутри которой любой компонент сможет получить содержимое контекста:

```jsx
return (
  <div className={styles.app}>
    <TotalPriceContext.Provider value={{ totalPrice, setTotalPrice }}>
      <DiscountContext.Provider value={{ discount, setDiscount }}>
        <Title text={"Корзина"} />
        <Cart />
        <TotalPrice />
      </DiscountContext.Provider>
    </TotalPriceContext.Provider>
  </div>
);
```

3. Удалите все пропсы, с помощью которых передавали состояние другим компонентам, и получите состояния totalPrice и discount. Для этого нужно воспользоваться хуком useContext():

```jsx
const { totalPrice, setTotalPrice } = useContext(TotalPriceContext);
const { discount, setDiscount } = useContext(DiscountContext);
```

## Рефакторинг состояния компонента ProductsContainer

Похожим образом проведём рефакторинг состояния компонента ProductsContainer:

1. Создайте файл productsContext.js в директории services и определите в нём контексты данных о товарах и названия промоакции:

```jsx
export const DataContext = React.createContext([]);
export const PromoContext = React.createContext("");
```

2. Реализуйте провайдеры контекста внутри ProductsContainer и в качестве значения передайте им параметры стейтов data и promo:

```jsx
 <div className={`${styles.container}`}>
   <DataContext.Provider value={{ data, setData }}>
     <PromoContext.Provider value={{ promo, setPromo }}>
 // ...
```

3. Замените все пропсы на контекст в дочерних компонентах:

```jsx
const { data, setData } = useContext(DataContext);
const { promo, setPromo } = useContext(PromoContext);
```

## useReducer

Сейчас состояние discount определено с помощью хука useState(). Ваша задача — переписать это состояние с использованием хука useReducer(). Для решения вам потребуется:

1. Написать функцию-редьюсер, которая будет изменять значение состояния discount.
2. Заменить хук useState() на useReducer().
3. Сохранить новое состояние и функцию отправки экшена в существующем контексте DiscountContext.
4. В дочерних компонентах переработать обращение к состоянию и заменить функцию setDiscount() на функцию отправки экшена.

Вносить исправления нужно в нескольких файлах: app/app.js, cart/products-container.js, cart/product.js, common/total-price.js и ui/promo-button.js.
Для удобства разработки определите начальное значение стейта discount как константу. Это можно сделать рядом с компонентом App:

```jsx
const discountInitialState = { discount: null };
```

Значение стейта вместо примитива стало объектом с полем discount. Это сделано для удобства обработки состояния внутри редьюсера. Возможно, объект с одним полем кажется избыточным, но лучше с самого начала привыкать к хорошим практикам. Теперь напишите функцию-редьюсер, принимающую аргументы state и action, где state — текущее значение состояния, а action — объект с полями type и payload. В зависимости от action.type состояние discount должно:

1. модифицироваться, если action.type === 'set';
2. сбрасываться, если action.type === 'reset'.

Значение для изменения состояния нужно брать из поля action.payload. Сброс состояния означает возврат к начальному состоянию: discountInitialState.

После того как вы определили начальное состояние и функцию-редьюсер, можно заменить хук useState() на useReducer(): 
```jsx
function App() {
// ...
const [discountState, discountDispatcher] = useReducer(reducer, discountInitialState, undefined);
// ...
```

Функция инициализации init в этом случае не используется, так что третьим аргументом можно передать undefined.

Когда стейт полностью определён с помощью хука useReducer(), сохраните discountState и discountDispatcher в контексте: 
```jsx
<DiscountContext.Provider value={{ discountState, discountDispatcher }}>
```

Переработайте в компонентах обращение к состоянию и способ обновления состояния discount. Получить стейт можно так: 
```jsx
const { discountState } = useContext(DiscountContext);
// текущее значение скидки хранится в поле discount
discountState.discount;
Для обновления стейта нужно вызвать discountDispatcher: jsx
const { discountDispatcher } = useContext(DiscountContext);

// обновить стейт
discountDispatcher({type: 'set', payload: newDiscountValue});

// сбросить стейт
discountDispatcher({type: 'reset'});
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
