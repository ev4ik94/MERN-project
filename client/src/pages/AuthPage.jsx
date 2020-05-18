import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from './../hooks/http.hook';
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/auth.context";

export const AuthPage = ()=>{
    const auth = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp();
    const message = useMessage();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(()=>{
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(()=>{
        window.M.updateTextFields();
    },[]);


    const changeHandler = event=>{
        setForm({...form, [event.target.name]: event.target.value});
    };

    const registerHandler = async()=>{

        try{
            const data = await request('/app/auth/register', 'POST', {...form});
            message(data.message);
        }catch(e){

        }
    };

    const loginHandler = async()=>{

        try{
            const data = await request('/app/auth/login', 'POST', {...form});
            message(data.message);
            auth.login(data.token, data.userId);
            console.log(data)
        }catch(e){

        }
    };

    return(
        <div className="row">
           <div className="col s6 offset-s3">
               <h3>Сократи ссылку</h3>
               <div className="card blue darken-1">
                   <div className="card-content white-text">
                       <span className="card-title">Авторизация</span>
                       <div>
                           <div className="input-field">
                               <input
                                   placeholder="Введите Email"
                                   id="email"
                                   name="email"
                                   type="text"
                                   className="validate yellow-input"
                                   value={form.email}
                                   onChange = {changeHandler}/>
                                   <label htmlFor="Email">Email</label>
                           </div>
                           <div className="input-field">
                               <input
                                   placeholder="Введите пароль"
                                   id="password"
                                   name="password"
                                   type="password"
                                   value={form.password}
                                   className="validate yellow-input"
                                   onChange = {changeHandler}
                               />
                                   <label htmlFor="password">Пароль</label>
                           </div>
                       </div>
                   </div>
                   <div className="card-action">
                       <button
                           className="btn yellow darken-4"
                           style={{marginRight:'4px'}}
                           onClick={loginHandler}
                       >
                           Логин</button>
                       <button
                           className="btn grey whiten-1 black-text"
                           onClick={registerHandler}
                           disabled={loading}
                       >Авторизация</button>
                   </div>
               </div>
           </div>
        </div>
    )
};
