const express = require('express'); // библиотека для удобной работы с сервером
const config = require('config'); // модуль для удобной работы с константами
const mongoose = require('mongoose'); // модуль для работы с MongoDB
const path = require('path');

const app = express();
app.use(express.json({ extended:true })) // Преобразовываю полученный объект из string в object
app.use('/app/auth', require('./routes/auth.routes')); // Подключаю роуты
app.use('/app/link', require('./routes/links.routes')); // Подключаю роуты
app.use('/t/', require('./routes/redirect.routes')); // Подключаю роуты

if(process.env.NODE_ENV === 'production'){ // Проверяю окружение пользовательской части если запускаю продакшн версию

    app.use('/', express.static(path.join(__dirname, 'client', 'build'))); // то направляю сервер в статический файл

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) // на любой другой запрос отправляю на статический файл index.html
    })
}


const PORT = config.get('port') || 5000; // из config/default.json достаю ствойство 'port' если нет то 5000

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }); // Подключение с базе данный в монгоДб


        // После успешного подключения мы подключаем сервер
        app.listen(PORT, ()=>{
            console.log('app has been started on PORT .... 5000');
        });
    }catch(e){
        console.log('Server error', e.message); // отловить ошибку и вывести ее в консоль
        process.exit(1); // Если что-то пошло не так завершить процес
    }
}


start();

