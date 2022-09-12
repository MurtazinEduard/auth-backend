import { body } from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
    body('fullName', 'Полное имя должно содержать минимум 2 символа').isLength({min: 2}),
]
export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
]
export const productCreateValidation = [
    body('title', 'Введите название товара').isLength({min: 1}).isString(),
    body('subtitle', 'Введите описание товара').isLength({min: 1}).isString(),
    body('imgUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('price', 'Цена должна быть Number!').isNumeric(),
    body('comments', 'Должен быть массив комментов!').optional().isArray(),
    body('category', 'Введите категорию товара').isString(),
]

export const productAddCommentValidation = [
    body('_idProduct', 'Нет id товара!').isString(),
    body('comment', 'Введите комментарий').isLength({min: 2, max: 100}).isString()
]