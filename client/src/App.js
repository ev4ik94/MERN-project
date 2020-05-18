import React from 'react';
import 'materialize-css';
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from './context/auth.context';
import {NavBar} from "./components/Navbar";
import {Loader} from "./components/Loader";

function App() {

    const {login, logout, token, userId, ready} = useAuth();
    const isAuthenticated = !!token;

    const routes = useRoutes(isAuthenticated);

    if(!ready){
        return <Loader />
    }

  return (
      <AuthContext.Provider value={{
        token, userId, logout, login, isAuthenticated
      }}>
      <BrowserRouter>


        {isAuthenticated && <NavBar />}
        <div className="container">
            {routes}
        </div>

      </BrowserRouter>
      </AuthContext.Provider>
  );
}

export default App;
