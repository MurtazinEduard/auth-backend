import express from 'express';

import mongoose from 'mongoose';

import cors from 'cors';

import {
  loginValidation,
  registerValidation,
} from './validations.js';



import * as UserController from './controllers/UserController.js';

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => {
    console.log('DB started');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());

app.use(express.json());

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server started');
});
