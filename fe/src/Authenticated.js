import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import ListMail from "./pages/ListMails/ListMails";
import NewMail from "./pages/NewMail/NewMail";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <ListMail></ListMail>
          </Route>
          <Route exact path="/new">
            <NewMail></NewMail>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
