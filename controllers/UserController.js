import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      orders: [],
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'edward777',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    );
    if (!isValidPass) {
      return res.status(403).json({
        message: 'Неверный пароль',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'edward777',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};
//тут крч снизу пример как брать себя чтобы мои заказы брать
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
//пока не робит нифига, нужно ли передавать что-то хзз, токен надо точно
//p.s охуенно робит починиль
export const getOrders = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    res.json(user.orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при получении заказов',
    });
  }
};

export const sendOrder = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const newDate = Date.now()
    const order = {
      date: String(newDate),
      items: req.body,
      status: 'В процессе'
    }
    user.orders.push(order)
    user.save()
    res.json({
      message: 'Успешно'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Ошибка при отправке заказа',
    });
  }
};
