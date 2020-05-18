const {Router} = require('express');
const router = Router();
const Link = require('../modals/Link');


router.get('/:code',async (req,res)=>{
    try{
        const link = await Link.findOne({code: req.params.code}); // Нахожу ссылку с таким же кодом что в параметре get запроса

        if(link){
            link.clicks++; // добавляю клик
            await link.save(); // Сохраняю изменения
            return res.redirect(link.from) // после делаю редирект
        }

        return res.status(404).json({message: 'Ссылка не найдена'});
    }catch(e){
        return res.status(500).json({message: 'оШИБКА СЕРВЕРА'});
    }
});

module.exports = router;
