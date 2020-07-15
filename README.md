# FSD plugin

## Команды проекта

Установка зависимостей

`npm i`

Сборка в режиме разработки

`npm run dev`

Сборка в режиме продакшена

`npm run build`

Запуск линтера 

`npm run lint`

Запуск тестов 

`npm run test`

## Использование плагина

Для работы плагина необходима библиотеке JQuery (версия 3.x+).

Инициализация с параметрами по умолчанию:

```
$(#slider).slider()
```

Инициализация с заданием необходимых параметров:

```
$(#slider).slider({
  minValue: 0,
  maxValue: 50,
  step: 2,
  isVertical: true,
})
````

Список всех возможных параметров:

| Параметр          | Тип                | Значение по умолчанию | Описание                                                                                        |
|-------------------|--------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| minValue          | number             | 0                     | Минимальное значение слайдера                                                                   |
| maxValue          | number             | 100                   | Максимальное значение слайдера                                                                  |
| step              | number             | 1                     | Шаг значений                                                                                    |
| value             | number[]           | [50, 100]                    | Стартовое значение слайдера |
| scaleOptionsNum   | number             | 5                     | Количество интерактивных меток под слайдером                                                    |
| isTooltipDisabled | boolean            | false                 | Определяет, включен или нет элемент с цифрой над бегунком                                       |
| isVertical        | boolean            | false                 | Определяет направление слайдера (горизонтальное/вертикальное)                                   |
| range             | boolean            | false                 | Показывает/скрывает второй бегунок                                                              |

## API плагина

После инициализации плагина можно использовать несколько методов для взаимодействия с ним. Для этого необходимо вместо опций передать в слайдер название метода первым аргументом, а параметры - после него.

* update(newOptions: object)

  Позволяет обновить настройки слайдера

  ```
  
  $(#slider).slider('update', {
    isVertical: true    // Изменяет направление слайдера
  })

  ```

* updateValue(value: number[])

    Выделенный метод updateValue позволяет обновить только значение слайдера с сохранением остальных настроек

  ```
  
  $(#slider).slider('updateValue', [90])
  $(#slider).slider('updateValue', [75, 85])

  ```

* getValue(): number | number[]

  Возвращает текущее значение слайдера

  ```
  
  $(#slider).slider('getValue')

  ```

* onValueChange(callback: Function)

  Позволяет задать коллбэк, который выполнится при изменении значения слайдера

  ```
  
  $(#slider).slider('onValueChange', () => {
    console.log('Значение изменилось');
  })

  ```


## Архитектура

Плагин  спроектирован на основе паттерна MVС. Модель (класс Model) содержит логику по обновлению состояния слайдера и предоставляет текущее значение. Представление (класс View) основано на классах-представлениях различных элементов слайдера. Представление отвечает за внешний вид слайдера, обновляет его отображение на основе полученных извне данных, причем каждый подкласс (subview) отвечает за свою часть отображения. Контроллер (класс Controller) связывает Модель и Представление при помощи коллбэков, позволяя таким образом каждому из классов узнавать об изменении другого.


### Отвязывание слоев приложения

Каждая сущность не знает ничего о других сущностях, т.к. все параметры, необходимые для создания и функционирования она получает из объекта при инициализации класса. При любых изменениях компонент пользуется методами класса-родителя Observer для оповещения всех подписчиков о произошедших изменениях, при этом у него нет информации о конкретных подписчиках, что позволяет избежать связывания.

### Передача данных вниз-вверх по слоям приложения

Передача данных вниз по слоям осуществляется в момент инициализации соответствующих классов, данные передаются через объект в конструктор дочернего класса. Например, для многоуровневого представления передача данных на более низкие уровни (subviews) происходит при инициализации этих классов основным классом представления View.

Передача данных на более высокие слои приложения осуществляется при помощи использования функционала подписки на события паттерна Observer, при срабатывании которого подписчики получают объект с необходимыми данными. Например, при клике на трек слайдера всем подписчикам события valueChanged рассылается уведомление о том, что событие произошло, и объект связанных с ним данных, которые обрабатываются на более высоких слоях приложения.

### UML-диаграмма классов

![UML-диаграмма](https://i.imgur.com/a6ywn1i.jpg)
