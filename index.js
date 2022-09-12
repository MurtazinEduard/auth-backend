import express from 'express';

import mongoose from 'mongoose';

import cors from 'cors';

import {
  loginValidation,
  productAddCommentValidation,
  productCreateValidation,
  registerValidation,
} from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as ProductController from './controllers/ProductController.js';

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

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/orders',checkAuth, UserController.getOrders);

app.post('/orders', checkAuth, UserController.sendOrder)

app.post(
  '/products',
  checkAuth,
  productCreateValidation,
  ProductController.create,
);

app.get('/products', ProductController.getAll);

app.get('/products/:id', ProductController.getOne);

app.post('/products/sorted', ProductController.getWithCategory);

app.post(
  '/products/addComment',
  checkAuth,
  productAddCommentValidation,
  ProductController.addComment,
);

app.get('/categories', ProductController.getCategories);

app.delete('/products/:id', checkAuth, ProductController.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server started');
});
