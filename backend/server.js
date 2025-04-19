const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function test() {
    let x = 10
    x = y // Необъявленная переменная
    console.log(x)
  } 