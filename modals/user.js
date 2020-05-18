const {Schema, model, Types} = require('mongoose');

// Описываю в этой модели какие данные мы ожидаем от пользователя
const schema = new Schema({
    email: {type: String, requires:true, unique:true}, // email, тип строка, поле обязательно для заполнения, должнобыть уникальным
    password: {type: String, required:true},  // password, тип строка, поле обязательно для заполнения
    links: [{type: Types.ObjectId, ref: 'Link'}] // массив ссылок, ref ---> указываю к какой коллекции мы привязываемся (Link - модель)
});

module.exports = model('User', schema); // экспортирую модель
