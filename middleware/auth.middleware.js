const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req,res,next)=>{

    // Метод проверяет доступность сервера
    if(req.method==='OPTIONS'){
        return next();
    }

    try{
        const token = req.headers.authorization.split(' ')[1]; //Bearer token

        if(!token){
            return res.stat(401).json({message: 'Нет авторизации'});
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'), (err, result)=> {
            return{err: err, result: result};
        });

        if(decoded.err){
            return res.status(401).json({message: decoded.err});
        }

        req.user = decoded.result;


        next();


    }catch(e){

        res.status(401).json({message: e.message});
    }
};
