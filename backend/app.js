const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const movieRoutes = require('./routes/movie.routes');
const genreRoutes = require('./routes/genre.routes');
const hallRoutes = require('./routes/hall.routes');
const sessionRoutes = require('./routes/session.routes');
const ticketRoutes = require('./routes/ticket.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const commentRoutes = require('./routes/comment.routes');
const ratingRoutes = require('./routes/rating.routes');


require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', commentRoutes);
app.use('/api', ratingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Тест корінного ендпоінта
app.get('/', (req, res) => res.send('Cinema API working'));

module.exports = app;

// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// app.use(cors());
// app.use('/uploads', express.static('uploads')); 

// // Настройка Multer для загрузки файлов
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir); 
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + file.originalname; 
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // Роут для загрузки изображения
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('Файл не загружен!');
//   }
  
//   // Здесь можно сохранить путь в БД (например, MongoDB или MySQL)
//   const imagePath = req.file.path;
  
//   res.json({ 
//     message: 'Файл загружен!',
//     imagePath: imagePath 
//   });
// });

// // Запуск сервера
// app.listen(5000, () => {
//   console.log('Сервер запущен на http://localhost:5000');
// });
