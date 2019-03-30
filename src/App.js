import React from 'react';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

import { Header } from "./library";

import {Main} from './pages/Main';
import {History} from './pages/History';
import {NotFound} from './pages/NotFound';

const App = () => {
  return (
    <div style={{margin: 0, padding: 0}}>
      <Header />
      <BrowserRouter>
        <Switch>

          <Route exact path="/" render={(props) => (
            <Main />
          )}/>

          <Route exact path="/history" render={(props) => (
            <History {...props}/>
          )}/>

          <Route path="/history" render={(props) => (
            <History {...props}/>
          )}/>

          <Route render={(props) => <NotFound /> } />
      
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
