
const{Router} = require('express'); // Импортирую class Router
const bcrypt = require('bcryptjs'); // Модуль позволяет хэшировать пароли и в последствии их сравнивать
const {check, validationResult} = require('express-validator'); // импортирую методы для валидации входных данных
const jwt = require('jsonwebtoken'); // для генерации токенов
const config = require('config');
const router = Router();
const User = require('../modals/user'); // импортирую модель


// Создаю роут обрабатывающий post запрос по API app/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорретный email').isEmail(), // С помощью встроенного валидатора isEmail() я проверяю правильность введенного email
        check('password', 'Пароль не короче 6 символов').isLength({min:6})
    ],
    async(req,res)=>{

    // Отлавиливаю ошибки
    try{

        const errors = validationResult(req); // Таким образом express-validator валидирует поля

        // Если объект errors не пуст то отправляю пользователю оюъект с ошибками и сообщением
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array(), message: 'Некорректные данные при регистрации'});
        }

        const {email, password} = req.body; // От пользователя забираю email и password

        const condidate = await User.findOne({ email}); // Начинаю поиск в базе данных по всем email

        if(condidate){  // если нашел такой email, то он не уникален и выбрасываю ошибку
            return  res.status(400).json({message: 'такой пользователь уже существует'});
        }

        const hashpassword = await bcrypt.hash(password, 12); // хэшируем пароль из 12 символов
        const user = new User({email: email, password: hashpassword}); // после того как пароль за хэшировался,
                                                                        // создаю нового пользователя и передаю полученные данные

        await user.save(); // после того как пользователь создался, сохраняю его в базе данных

        res.status(201).json({message: 'Пользователь создан'}); // отправляю сообщение что регистрация благополучно прошла



    }catch(e){
        res.status(500).json({message: 'что то пошло не так'});
    }
});


router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists() // проверяю на существование пароля чтобы поле не было пустым
    ],
    async(req,res)=>{
        try{

            const errors = validationResult(req); // Таким образом express-validator валидирует поля

            // Если объект errors не пуст то отправляю пользователю оюъект с ошибками и сообщением
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array(), message: 'Некорректные данные при входе в систему'});
            }

            const {email, password} = req.body;

            const user = await User.findOne({email}); // ишу в базе такого пользователя

            if(!user){ // если такого пользователя нет в базе
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({message: 'Неверный пароль попробуйте снова'});
            }


            // Создаю токент, метод sign принимает 3 параметра (объект, секретный ключ и время существования этого токена (1 час))
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            // после всего я отправляю пользователю успешное сообщение с объектом токена и юсер id
            res.json({token, userId: user.id})





        }catch(e){
            res.status(500).json({message: 'что то пошло не так'});
        }
});


module.exports = router;
