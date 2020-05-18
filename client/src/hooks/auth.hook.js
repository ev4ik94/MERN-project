import {useState, useCallback, useEffect} from 'react';
const storageName = 'userData';


export const useAuth = ()=>{

    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);

    const login = useCallback((token, userId)=>{
        setToken(token);
        setUserId(userId);
        localStorage.setItem(storageName, JSON.stringify({userId:userId,token:token}));
    }, []);

    const logout = useCallback((token, userId)=>{
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(()=>{
        let data = localStorage.getItem(storageName);
        data = JSON.parse(data);

        if(data && data.token){
            login(data.token, data.userId);
        }

        setReady(true);
    }, [login])


    return {token, userId, login, logout, ready};

};
