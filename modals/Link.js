const {Schema, model, Types} = require('mongoose');

// Описываю в этой модели какие данные мы ожидаем от пользователя
const schema = new Schema({
   from: {type:String, required:true},
    to: {type:String, required:true, unique:true},
    code: {type:String, required:true, unique: true},
    date: {type: Date, default: Date.now},
    clicks: {type:Number, default:0},
    owner: {type:Types.ObjectId, ref:'User'}

});

module.exports = model('Link', schema); // экспортирую модель
