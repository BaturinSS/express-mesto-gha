//* Подключаем модуль для работы с базой данных в MongoDB
const mongoose = require('mongoose');

//* Подключаем модуль для проверки данных на тип
const validatorjs = require('validator');

//* Импорт констант
const { textErrorNoValid } = require('../utils/constants');

//* Создаем схему для валидации данных в MongoDB
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    maxlength: 500,
    validate: {
      validator: (value) => validatorjs.isURL(value),
      message: (props) => `${textErrorNoValid} - '${props.value}'`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//* Создаем модель данных в mongoose
module.exports = mongoose.model('card', cardSchema);
