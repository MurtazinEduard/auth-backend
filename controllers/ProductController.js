import ProductModel from '../models/Product.js';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
export const create = async (req, res) => {
  try {
    const doc = new ProductModel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      category: req.body.category,
      comments: req.body.comments,
    });
    const product = await doc.save();
    res.json({
      message: 'Товар успешно добавлен!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать товар',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    console.log(req.body);
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить товары',
    });
  }
};
export const getCategories = async (req, res) => {
  try {
    console.log(req.body);
    const products = await ProductModel.find();
    const uniqueCategories = new Set(products.map((item) => item.category));
    res.json(['Все', ...uniqueCategories]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить категории',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const productId = req.params.id;
    ProductModel.findById(
      {
        _id: productId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось найти товар',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Товар не найден',
          });
        }
        return res.json(doc);
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить товар',
    });
  }
};

export const getWithCategory = async (req, res) => {
  try {
    const productCategory =
      req.body.category === 'Все' || ''
        ? null
        : { category: req.body.category };
    const products = await ProductModel.find();
    ProductModel.find(productCategory, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Не удалось найти товары',
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Товары не найдены',
        });
      }

      const uniqueCategories = new Set(products.map((item) => item.category));
      return res.json({
        products: doc,
        categories: ['Все', ...uniqueCategories],
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить товары',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const productId = req.params.id;
    ProductModel.findOneAndDelete(
      {
        _id: productId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить товар',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Товар не найден',
          });
        }
        return res.json({
          message: 'Товар успешно удален',
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось удалить товар',
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
    const products = await ProductModel.findById(req.body._id);
    if (!products) {
      return res.status(404).json({
        message: 'Товар не найден',
      });
    }
    
    const newDate = Date.now()
    const comment = {
      user: user.fullName,
      comment: req.body.comment,
      date: String(newDate)
    }
    products.comments.push(comment)
    products.save()
    res.status(200).json({
      message: 'Комментарий добавлен'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось добавить комментарий',
    });
  }
};
