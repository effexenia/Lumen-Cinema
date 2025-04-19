const app = require('./app'); // Импортируем ваше Express-приложение

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
  console.log(`Доступно за адресою: http://localhost:${PORT}`);
});