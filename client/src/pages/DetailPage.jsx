import React, {useState, useCallback, useContext, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {Loader} from "../components/Loader";
import {LinkCard} from "../components/LinkCard";


export const DetailPage = ()=>{

    const [link, setLink] = useState(null);
    const linkId = useParams().id; // Получаем get параметр из ссылки
    const {request, loading} = useHttp();
    const {token} = useContext(AuthContext);

    const getLink = useCallback(async ()=>{
        try{
            const fetched = await request(`/app/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });

            setLink(fetched);
        }catch(e){

        }
    }, [token, linkId, request]);

    useEffect(()=>{
        getLink();
    }, [getLink]);

    if(loading){
        return <Loader />
    }
    return(
        <>
            {!loading && link && <LinkCard link={link}/>}
        </>
    )
};
