require('dotenv').config();

//* Подключаем фреймворк express для сервера на ноде
const express = require('express');

//* Подключаем модуль для повышения безопасности сервера
const helmet = require('helmet');

//* Подключаем модуль для работы с базой данных в MongoDB
const mongoose = require('mongoose');

//* Подключаем модуль обработки запроса body
const bodyParser = require('body-parser');

//* Подключаем модуль обработки запроса cookie
const cookieParser = require('cookie-parser');

//* Подключаем модуль ограничения запросов к серверу
const rateLimit = require('express-rate-limit');

//* Подключаем модуль, предоставляет утилиты для работы с путями к файлам и каталогам
// const path = require('path');

//* Возьмём порт (по умолчанию 3000) из переменной окружения
const { PORT = 3000 } = process.env;

//* Импортировать модуль users
const usersRouter = require('./routes/users');

//* Импортировать модуль cards
const cardsRouter = require('./routes/cards');

//* Создаем приложение методом express
const app = express();

//* Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

//* Импорт controllers
const { login, createUser } = require('./controllers/users');

//* Импорт мидлвэр авторизации для зашиты роутов
const auth = require('./middlewares/auth');

//* Ограничение количества запросов к серверу
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

//* Обрабатываем запрос
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/sign-in', login);
app.post('/sign-up', createUser);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', (req, res) => {
  res
    .status(404)
    .send({ message: 'Страница не существует' });
});

//* Передаем статичную страницу
// app.use(express.static(path.join(__dirname, 'public')));

//* Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

//* Установим слушателя на порт
app.listen(PORT);
