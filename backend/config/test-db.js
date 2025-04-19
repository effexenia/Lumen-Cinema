const pool = require('./db');

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("База даних працює, результат:", rows[0].result);
  } catch (err) {
    console.error("Помилка підключення до БД:", err);
  }
})();
