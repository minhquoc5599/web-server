import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import httpStatusCode from './utils/enums/httpStatusCode.js';
import userController from './api/controllers/user.controller.js';
import courseController from './api/controllers/course.controller.js';
import categoryController from './api/controllers/category.controller.js';
import roleController from './api/controllers/role.controller.js';
import subscriberController from './api/controllers/subscriber.controller.js';
import watchListController from './api/controllers/watch_list.controller.js';
import videoController from './api/controllers/video.controller.js';
import chatbotController from './api/controllers/chatbot.controller.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
mongoose.connect(process.env.URL_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
})
app.get('/actor', (req, res) => {
  res.sendFile(__dirname + '/views/crud-actor.html');
})
app.get('/category', (req, res) => {
  res.sendFile(__dirname + '/views/crud-category.html');
})

app.use('/api/user-controller', userController);
app.use('/api/course-controller', courseController);
app.use('/api/category-controller', categoryController);
app.use('/api/role-controller', roleController);
app.use('/api/subscriber-controller', subscriberController);
app.use('/api/watch-list-controller', watchListController);
app.use('/api/video-controller', videoController);
app.use('/api/chatbot-controller', chatbotController);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = httpStatusCode.CLIENT_ERRORS.BAD_REQUEST;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR).send({
    error: {
      status: error.status || httpStatusCode.SERVER_ERRORS.INTERNAL_SERVER_ERROR,
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server has started.');
});