import React from "react";
import {Route, Switch} from "react-router-dom";
import Admin from "./Admin/index";
import Main from "./main/index";
import asyncComponent from "../util/asyncComponent";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}main`} component={Main}/>
      <Route path={`${match.url}admin`} component={Admin}/>
      <Route path={`${match.url}profile`} component={asyncComponent(() => import('./Profile'))}/>
    </Switch>
  </div>
);

export default App;
