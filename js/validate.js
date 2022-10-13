const validate = () => {
  // ссылка на форму и поле типа жилья
  const advertForm = document.querySelector('.ad-form');
  const typeOfHouse = advertForm.querySelector('#type');

  // объект для установки минимальной цены поля цены за ночь
  const minPrices = {
    'bungalow': 0,
    'flat': 1000,
    'hotel': 3000,
    'house': 5000,
    'palace': 10000,
  };

  // создаем экземпляр валидатора
  const pristine = new Pristine(advertForm, {
    classTo: 'ad-form__element',
    errorClass: 'ad-form__element--invalid',
    successClass: 'ad-form__element--valid',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'span',
    errorTextClass: 'text-help'
  });

  // вынесенная функция проверки "Заголовок объявления"
  function validateTitle(value) {
    return value.length >= 30 && value.length <= 100;
  }

  // добавление поля "Заголовок объявления" для проверки валидатором
  const title = advertForm.querySelector('#title');
  pristine.addValidator(title, validateTitle, 'От 30 до 100 символов');

  // установка минимальной цены с учетом выбора типа жилья и
  // добавление проверки поля "Цена за ночь"
  const priceField = document.querySelector('#price');
  pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);
  function validatePrice(value) {
    priceField.placeholder = minPrices[typeOfHouse.value];
    if (value < 100000 && value > minPrices[typeOfHouse.value]) {
      return true;
    }
    return false;
  }

  // сообщение об ошибке поля price
  function getPriceErrorMessage(value) {
    if (value > 100000) {
      return 'Максимальная цена 100 000 рублей';
    }
    if (value < minPrices[typeOfHouse.value]) {
      return `Минимальная цена ${minPrices[typeOfHouse.value]} рублей`;
    }
  }

  // добавление проверки полей "Количество комнат" и "Количество мест"
  const roomsField = document.querySelector('[name="rooms"]');
  const guestsField = document.querySelector('[name="capacity"]');

  // таблица для создания логики проверки комнат-мест
  const roomsOption = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  // проверка валидности полей комнат - мест
  function validateRoomsAndCapacity() {
    if (roomsOption[roomsField.value] === 100 && guestsField.value === '0') {
      return true;
    }
    else if (roomsOption[roomsField.value].includes(guestsField.value)) {
      return true;
    }
    return false;
  }

  // сообщение ошибки поля количества комнат
  function getRoomsErrorMessage() {
    const room = roomsField.value;
    const guest = guestsField.value;

    if (room === '100' && guest !== '0') {
      return 'Не для гостей';
    }
    if (room === '1' && guest !== '1') {
      return 'Для 1 гостя';
    }
    if (room === '2' && (guest !== '1' || guest !== '2')) {
      return 'для 1 или 2 гостей';
    }
    if (room === '3' && guest === '0') {
      return 'для 1, 2 или 3 гостей';
    }
  }

  // сообщение ошибки поля количества гостей
  function getCapacityErrorMessage() {
    if (roomsField.value === '100') {
      return 'Не для гостей';
    } else if (guestsField.value === '0') {
      return 'Необходимо 100 комнат';
    }
    return `Необходимо минимум ${guestsField.value} комнаты.`;
  }

  // добавление синхронизации полей время заезда время выезда
  pristine.addValidator(roomsField, validateRoomsAndCapacity, getRoomsErrorMessage);
  pristine.addValidator(guestsField, validateRoomsAndCapacity, getCapacityErrorMessage);

  const timeInField = document.querySelector('#timein');
  const timeOutField = document.querySelector('#timeout');

  const validateTimeIn = () => {
    timeOutField.value = timeInField.value;
    return true;
  };

  const validateTimeOut = () => {
    timeInField.value = timeOutField.value;
    return true;
  };

  pristine.addValidator(timeInField, validateTimeIn);
  pristine.addValidator(timeOutField, validateTimeOut);

  advertForm.addEventListener('change', (evt) => {
    if (!pristine.validate()) {
      evt.preventDefault();
    }
  });

  // событие, по которому происходит проверка формы
  advertForm.addEventListener('submit', (evt) => {
    if (!pristine.validate()) {
      evt.preventDefault();
    }
  });
};

export { validate };

