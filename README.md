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

# Redux | Инициализация хранилища

Перепишем всё на Redux. В этом задании создадим первые редьюсеры и экшены для компонента Cart. А после — инициализируем хранилище и подпишем на него все компоненты.

1. Создать директорию services и две поддиректории actions, reducers с файлами cart.js и index.js в каждой. В директории actions будем хранить все типы экшенов, а в reducers — редьюсеры.

2. Опишите все нужные типы экшенов в файле cart.js директории actions:

- INCREASE_ITEM — увеличение количества товаров,
- DECREASE_ITEM — уменьшение количества товаров,
- DELETE_ITEM — удаление товара,
- CANCEL_PROMO — отмена промокода,
- TAB_SWITCH — переключение между вкладками «Отложенные товары» и «Товары в корзине».

3. Импортируйте все типы экшенов в файл cart.js директории reducers. Но сперва разберитесь с начальным состоянием для массива items и recommendedItems. Захардкордите данные в директории services файла initialData.js. Импортируйте recommendedItems и items, используйте эти переменные как начальное состояние для товаров в корзине и рекомендуемых товаров в редьюсере cart.js.

4. Создайте cartReducer, а в нём — конструкцию switch-case, и обработайте все импортированные типы экшенов в конструкции switch-case:

- TAB_SWITCH — этот редьюсер отвечает за переключение между вкладками «Отложенные товары» и «Товары в корзине». Используйте тернарный оператор для поля currentTab. Если currentTab в состоянии со значением items, возвращайте отложенные товары postponed. В противном случае возвращайте items. И items, и postponed — обычные строки.
- INCREASE_ITEM — редьюсер увеличения количества товаров items. Найдите с помощью переданного в диспатчер id нужный элемент массива items. Когда нужный элемент найден, увеличьте число в поле qty. Звучит сложно, но на деле достаточно применить метод map и найти элемент с нужным id. Воспользуйтесь тернарным оператором в колбек-функции — для найденного элемента верните обновлённый объект с изменённым полем qty. В противном случае просто верните текущий элемент массива.
- DECREASE_ITEM — уменьшение количества товаров. По функциональности аналогичен INCREASE_ITEM, но уменьшает значение поля qty.
- DELETE_ITEM — удаление товара из корзины. Примените метод filter для поиска удаляемого элемента. Используйте id из экшена, переданного в редьюсер.
- CANCEL_PROMO — удаление промокода. Очищайте поля promoCode и promoDiscount, которые надо привести к изначальному состоянию.

5. Создайте rootReducer в файле index.js директории reducers. Как только редьюсер будет готов, импортируйте cartReducer в файл index.js директории reducers. Объедините cartReducer в rootReducer с использованием combineReducers.

6. В конце перейдите в корневой файл index.js. Инициализируйте в нём хранилище:

- Импортируйте createStore, Provider и rootReducer.
- Инициализируйте хранилище в переменную store с помощью createStore.
- Оберните компонент App в Provider.
- Передайте store в качестве аргумента провайдера.

Фактически мы пытаемся описать логику работы нескольких небольших функций, но выглядит это очень объёмно. Есть несколько советов:
Для работы с массивами и объектами состояния щедро используйте спред-синтаксис.

Не забывайте про путь воина: в большинстве случаев нужно именно обновлять исходное состояние. Например, редьюсер удаления товара выглядит так:
jsx
case DELETE_ITEM: {
return { ...state, items: [...state.items].filter(item => item.id !== action.id) };
}

7. Теперь вам предстоит настроить шаги оформления заказа. Это основная логика приложения, поэтому отнести соответствующие экшены и редьюсеры к конкретному файлу — сложно. Значит, всю логику опишем в файлах index.js директорий actions и reducers. Предстоит сначала описать такие типы экшенов:

- PREVIOUS_STEP — шаг назад в оформлении заказа,
- NEXT_STEP — шаг вперёд.

8. Импортируйте эти типы экшенов в файл index.js директории reducers.
9. Теперь разберёмся с редьюсером. Он называется stepReducer. Создавать объект начального состояния не нужно — в нём будет храниться всего лишь строка. По умолчанию это первый шаг оформления заказа — корзина ("cart"). Мы написали часть этого редьюсера для следующего шага — NEXT_STEP. Раскомментируйте блок кода с обработкой экшена NEXT_STEP.

./reducers/index.js:

```js
const stepReducer = (state = "cart", action) => {
  switch (action.type) {
    // Раскомментируйте код ниже и опишите шаг PREV_STEP
    // case NEXT_STEP: {
    //   return state === 'cart'
    //     ? 'delivery'
    //     : state === 'delivery'
    //     ? 'checkout'
    //     : state === 'checkout'
    //     ? 'checkout'
    //     : 'checkout';
    // }
    default: {
      return state;
    }
  }
};
```

10. После этого нужно дописать редьюсер stepReducer в файл ./services/reducers/index.js. Вам необходимо добавить аналогичный блок, только для экшена PREVIOUS_STEP. Логика такая:

- если мы находимся на шаге "cart", необходимо остаться на нём же;
- если мы на шаге "delivery", нужно вернуться на шаг "cart";
- если мы на шаге "checkout", следует вернуться на шаг "delivery";
- во всех остальных случаях надо вернуться на шаг "cart".

11. Редьюсер stepReducer подключите к rootReducer. Присвойте stepReducer полю step

# Взаимодействие react с redux

У вас уже есть список товаров в хранилище store.cart.items. Вам нужно избавиться от хука const [data, setData] = useState([]); в файле для хранения списка товаров products-container.js. Все вызовы setData также следует удалить.

1. Для получения товаров воспользуйтесь useSelector и избавьтесь от DataContext в блоке return и импортах.
2. Из useSelector нужно получить ключ хранилища items, который содержит список товаров, и отрендерить товары из полученных данных. Не забудьте поменять data на items во всём компоненте ProductsContainer.
3. Затем необходимо убрать useContext(DataContext) из файла product.js. Для операций над товарами нужно воспользоваться экшенами, которые вы сделали ранее: INCREASE_ITEM, DECREASE_ITEM, DELETE_ITEM. Помните, что для всех этих операций нужно передавать id товара в экшене. Для отправки экшенов воспользуйтесь хуком useDispatch в компоненте Product. Замените содержимое функций onDelete, decrease, increase на отправку экшенов в Redux. Вызовы setTotalPrice оставьте пока на своих местах в обновлённых функциях, а DataContext удалите из импортов.

4. Продолжим наступление и перенесём вычисления общей цены товаров и результат применения скидки в Redux. В хранилище мы поместили информацию про уровень скидки и промокод. Эта информация приходит из контекста. Ваша задача — избавиться от использования DiscountContext и TotalCostContext. Для этого вам предстоит сделать такие шаги:

* Удалите провайдеры и экземпляры контекстов из файла app.js — они больше не понадобятся.
* В total-price.js уберите использование контекста и воспользуйтесь хуком useSelector для вычисления общей стоимости товаров, которые находятся в корзине. Получите список товаров по ключу cart.items и воспользуйтесь методом массивов reduce. Присвойте результат работы хука useSelector переменной totalPrice. Не забудьте, что у каждого товара есть количество, которое также следует учитывать при вычислении общей стоимости.
* Присвойте результат работы ещё одного хука useSelector переменной discount. Она должна ссылаться на значение promoDiscount из ключа хранилища cart.
* Убедитесь, что в файле products-container.js больше не используется контекст, а значение промокода и процент скидки берутся из Redux с помощью useSelector.
* Замените использование promo из useState на promoCode из ключа хранилища cart.
* Удалите хук const [promo, setPromo] = useState(''); и все вызовы setPromo и setDiscount, в следующих заданиях мы вернём былую функциональность. Также полностью избавьтесь от хука useEffect, который устанавливает значение общей стоимости при изменении списка товаров.
* В компоненте Product также удалите контекст: использование DiscountContext и TotalCostContext из файла product.js. Важно сохранить в компоненте Product возможность отображать цену без скидки и цену со скидкой. Для этого воспользуйтесь значением promoDiscount из ключа хранилища cart. Тут снова потребуется хук useSelector. Результат работы хука присвойте прежней переменной — discount.
* Осталась маленькая деталь — доделать компонент PromoButton в файле ui/promo-button.js. Сейчас этот компонент использует контекст, но поскольку мы везде от него избавились, то и здесь сделаем то же самое. Воспользуемся хуком useDispatсh и экшеном CANCEL_PROMO для сброса промокода. После этого нужно избавиться от PromoContext в приложении.
* Наконец, убедитесь, что в приложении не осталось следов былого величия контекстов, разбросанных то тут, то там.

# Подключить логику переключения табов в корзине в React. Вот что нужно сделать:
1. Для начала разберёмся с экшеном TAB_SWITCH. Вам необходимо отправлять этот экшен при нажатии на табы в корзине. Для этого в файле tab.js воспользуйтесь хуком useDispatch и допишите функцию switchTab так, чтобы её вызов отправлял экшен { type: TAB_SWITCH }.
2. В файле tabs.js нужно получать информацию об активном табе из Redux-хранилища по ключу cart.currentTab. Для этого используйте хук useSelector и присвойте результат селектора переменной currentTab.
3. Также в файле tabs.js необходимо добавить булево значение в пропс active у элементов <Tab />. Получать это значение нужно, сравнивая currentTab и строку "items" для первого элемента <Tab /> и строку "postponed" для второго элемента.
4. В файл ./cart/index.js в компоненте Cart, как и в tabs.js, следует поместить значение cart.currentTab в переменную currentTab. Достать его нужно из Redux-хранилища. Для этого воспользуйтесь хуком useSelector.
5. Также в файле ./cart/index.js необходимо применить условный рендеринг с помощью тернарного выражения: если currentTab равен "items", то нужно рендерить компонент <ProductsContainer />, в противном случае — компонент <Postponed />. Допишите эту логику в блок return компонента Cart.

# Redux Thunk и сайд-эффекты (API)
Сейчас корзина товаров работает с захардкоженными данными. На практике такого не бывает и, как правило, данные запрашиваются с бэкенда. Мы подготовили уже знакомый вам файл fakeApi.js. В этом задании попробуем забирать данные оттуда с использованием усилителя redux-thunk.

1. Сначала возьмём в работу самый простой запрос, который будет возвращать список товаров корзины. Для этого нужно подготовить усилитель в директории actions файла cart.js. Импортируйте запрос getItemsRequest и расширьте тип экшенов. Добавьте три экшена:
* GET_ITEMS_REQUEST — отображается, если запрос отправлен.
* GET_ITEMS_SUCCESS — показывается в случае успеха, когда запрос выполнен и данные получены.
* GET_ITEMS_FAILED — используется в случае ошибки.

2. После создайте в том же файле асинхронный экшен getItems. В самом начале отправляйте экшен GET_ITEMS_REQUEST. После экшена — запрос с использованием ранее импортированной функции getItemsRequest. Если ответ пришёл и свойство success равно true — отправьте в редьюсер экшен GET_ITEMS_SUCCESS, а в качестве данных укажите свойство items со значением res.data. В противном случае — GET_ITEMS_FAILED.

3. Это всё, что нужно сделать в файле экшенов. Остаётся только обработать каждый из созданных. Для этого перейдите в редьюсер cart.js директории reducers и расширьте начальное состояние:
* в начальном состоянии укажите значение items равное пустому массиву;
* добавьте поля itemsRequest и itemsFailed со значением false по умолчанию.

4. После этого импортируйте типы экшенов, созданные до этого. В редьюсере cartReducer обработайте действия таким образом:
* GET_ITEMS_REQUEST — запрос отправлен, а значит можно отобразить прелоудер. Поле itemsRequest приобретает значение true.
* GET_ITEMS_SUCCESS — запрос прошёл успешно. Поля itemsRequest и itemsFailed принимают значение false, а в состояние items попадает массив action.items.
* GET_ITEMS_FAILED — всё плохо. Но не у нас. Поле itemsFailed приобретает значение true, а itemsRequest — false.

5. В хранилище корзины ещё остались блоки кода, которые нужно привязать к бэкенду. Это функциональность промокодов и рекомендуемые товары. Начнём с последних, потому что работа с ними очень похожа на обработку обычных товаров.

6. Подготовьте усилитель в файле cart.js директории actions. Импортируйте запрос getRecommendedItemsRequest и расширьте тип экшенов. Добавьте три экшена:
* GET_RECOMMENDED_ITEMS_REQUEST — отображается, если запрос отправлен.
* GET_RECOMMENDED_ITEMS_SUCCESS — показывается в случае успеха, когда запрос выполнен и товары получены.
* GET_RECOMMENDED_ITEMS_FAILED — используется в случае ошибки при выполнении запроса.
7. Затем в том же файле создайте усилитель getRecommendedItems. Логика этого усилителя полностью дублирует логику getItems за тем исключением, что отличаются типы экшенов.
8. После этого в редьюсере cart.js директории reducers расширьте начальное состояние:
* в начальном состоянии укажите значение recommendedItems равное пустому массиву;
* добавьте поля recommendedItemsRequest и recommendedItemsFailed со значением false по умолчанию.
9. Импортируйте созданные до этого типы экшенов. В редьюсере cartReducer обработайте действия следующим образом:
* GET_RECOMMENDED_ITEMS_REQUEST — запрос отправлен. Поле recommendedItemsRequest приобретает значение true.
* GET_RECOMMENDED_ITEMS_SUCCESS — запрос прошёл успешно. Поля recommendedItemsRequest и recommendedItemsFailed приобретают значение false, а в состояние recommendedItems попадает массив action.items.
* GET_RECOMMENDED_ITEMS_FAILED — произошла ошибка при выполнении запроса. Поле recommendedItemsFailed приобретает значение true, а recommendedItemsRequest — false.

9. Не поверите, но следующим шагом предстоит сделать то же самое для применения промокодов. Попытайтесь реализовать экшены и редьюсер самостоятельно, а мы предоставим вам название переменных и особенности работы с промокодами.
Типы экшенов:
* APPLY_PROMO_FAILED — ошибка активации промокода,
* APPLY_PROMO_REQUEST — произошёл запрос,
* APPLY_PROMO_SUCCESS — запрос выполнился успешно. В этом случае из усилителя требуется отправить поле value со значением { ...res, code }.
* Название усилителя — applyPromo. А запрос на активацию промокода из файла fakeApi.js — applyPromoCodeRequest.

10. В редьюсере расширьте начальное состояние:
* promoRequest — поле для хранения состояния запроса,
* promoFailed — произошла ошибка при выполнении запроса.
11. В случае возникновения ошибки при применении промокода обнулите текущие данные о скидке и названии промокода в редьюсере:
* promoDiscount: null,
* promoCode: '' 
12. Если же промокод применился успешно, возьмите данные из ответа и добавьте их, как делали с полями выше:
* promoCode: action.value.code,
* promoDiscount: action.value.discount 
Когда всё будет готово — удалите файл initialData.js и все импорты данных из этого файла в редьюсере cart.

13. Самое время подключить Redux Devtools и усилители к хранилищу. Для этого в корневом файле index.js создайте переменную composeEnhancers и проверьте, есть ли в ней объекты window и window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__. Если всё хорошо, вызовите расширение с пустым набором опций. В противном случае — верните compose.
После этого создайте расширитель хранилища: передайте вспомогательную функцию applyMiddleware в composeEnhancers. В завершении — передайте созданный расширитель в функциюcreateStore.

14. Усилители подключены и теперь можно начать ими пользоваться. Мы добавили два новых компонента: Recommend и RecommendItem. Это список с рекомендуемыми товарами. Компоненты не придётся писать заново — большую часть кода разработчик корзины написал за нас. К сожалению, у него не получилось написать весь код — наступили майские праздники. Отдуваться будем мы.
Импортируйте функцию getRecommendedItems, хук useDispatch и useEffect в компонент Recommend. Для отправки экшенов создайте переменную dispatch со значением useDispatch.

15. Товары понадобятся нам сразу при монтировании компонента. Поэтому в хуке useEffect вызовите dispatch и передайте в качестве параметра getRecommendedItems. Массивом зависимости укажите dispatch. Доработайте переменную content так, чтобы во время выполнения запроса отображался компонент Loader. А если с запросом всё хорошо, переберите массив recommendedItems и для каждого элемента верните компонент RecommendItem. Не забудьте про key и пропсы. Статус выполнения запроса хранится в переменной recommendedItemsRequest

16. Переработаем компонент ProductsContainer. Чтобы показать состояние компонента до и после рефакторинга, мы не удаляли существующий код.
Сейчас в компоненте небольшая каша: хуки используются как для доступа к хранилищу, так и для работы с внутренним состоянием. Поскольку теперь мы храним все запросы к серверу в усилителях, а переменные для отображения их состояний в хранилище — смело удаляйте весь код с 16 до 53 строки включительно, оставьте только переменную inputRef — она ещё пригодится. Остальной код нам больше не нужен.

17. После этого модифицируйте хук useSelector. Используйте деструктуризацию и заберите всё необходимое из хранилища. Вот полный список ключей хранилища:
items, promoCode, promoDiscount, promoRequest, promoFailed, itemsRequest 

18. Для настройки работы промокодов и отображения товаров в корзине импортируйте усилители applyPromo и getItems из cart.js. А для отправки экшенов — импортируйте хук useDispatch и присвойте его переменной dispatch.
19. При монтировании компонента ProductsContainer отправьте экшен с функцией getItems. Сделайте это внутри хука useEffect, а в качестве deps укажите переменную dispatch.
20. Для применения промокодов создайте переменную applyPromoCode и используйте в ней хук useCallback. Внутри хука отправьте экшен с усилителем applyPromo. В отличие от усилителей, которые мы использовали раньше, applyPromo принимает параметры. Передайте в качестве параметра значение рефа инпута inputRef. Не забудьте про deps для хука useCallback.
Финальным штрихом модифицируйте разметку, возвращаемую компонентом ProductsContainer. Компонент PromoButton должен рендериться только в случае, если нет ни промокода, ни скидки. Эти ключи вы забрали из хранилища в самом начале работы.
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
