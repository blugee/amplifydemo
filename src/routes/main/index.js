import React from "react";
import {Route, Switch} from "react-router-dom";
import Dashboard from "./dashboard";

const Main = ({match}) => (
  <Switch>
    <Route path={`${match.url}/dashboard`} component={Dashboard}/>
  </Switch>
);

export default Main;
