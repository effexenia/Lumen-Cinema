/* eslint-disable no-unused-vars */
const db = require('../config/db');

exports.getHalls = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM halls');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні залів' });
  }
};

exports.createHall = async (req, res) => {
  try {
    const { name, seat_rows, seat_cols } = req.body;
    const [result] = await db.query(
      'INSERT INTO halls (name, seat_rows, seat_cols) VALUES (?, ?, ?)', 
      [name, seat_rows, seat_cols]
    );

    const newHallId = result.insertId;

    res.status(201).json({
      id: newHallId,
      name,
      seat_rows,
      seat_cols
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при створенні залу' });
  }
};


exports.updateHall = async (req, res) => {
  try {
    const { name, seat_rows, seat_cols } = req.body;
    const hallId = req.params.id;

    await db.query(
      'UPDATE halls SET name = ?, seat_rows = ?, seat_cols = ? WHERE id = ?', 
      [name, seat_rows, seat_cols, hallId]
    );

    res.json({
      id: Number(hallId),
      name,
      seat_rows,
      seat_cols
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка при оновленні залу' });
  }
};


exports.deleteHall = async (req, res) => {
  try {
    await db.query('DELETE FROM halls WHERE id = ?', [req.params.id]);
    res.json({ message: 'Зал видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні залу' });
  }
};
