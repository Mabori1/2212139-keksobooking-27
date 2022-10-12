const validate = () => {
  // ссылка на форму
  const advertForm = document.querySelector('.ad-form');

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

  // добавление проверки поля "Цена за ночь"
  const priceField = document.querySelector('#price');
  pristine.addValidator(priceField, validatePrice, 'Не больше 100000 рублей');
  function validatePrice(value) {
    return value < 100000;
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
  function getCapacityErrorMessage() {
    if (roomsField.value === '100') {
      return 'Не для гостей';
    } else if (guestsField.value === '0') {
      return 'Необходимо 100 комнат';
    }
    return `Необходимо минимум ${guestsField.value} комнаты.`;
  }

  pristine.addValidator(roomsField, validateRoomsAndCapacity, getRoomsErrorMessage);
  pristine.addValidator(guestsField, validateRoomsAndCapacity, getCapacityErrorMessage);

  // событие, по которому происходит проверка формы
  advertForm.addEventListener('submit', (evt) => {
    if (!pristine.validate()) {
      evt.preventDefault();
    }
  });
};

export { validate };
