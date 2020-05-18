import{useState,useCallback, useContext} from 'react';
import {AuthContext} from "../context/auth.context";

export const useHttp = ()=>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {logout} = useContext(AuthContext);

    const request = useCallback(async (url, method = 'GET', body=null, headers={})=>{

        setLoading(true);
        try{

            if(body){
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json'; // Обязательно. для того чтобы на сервере правильно считывалась информация
            }
            const response = await fetch(url, {
                method, body, headers
            });

            const data = await response.json();

            if(!response.ok){

              if(response.status===401){
                  logout();
              }
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);

            return data;

        }catch (e){
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [logout]);

    const clearError = useCallback(()=>setError(null), []);

    return {loading, request, error, clearError};
};
