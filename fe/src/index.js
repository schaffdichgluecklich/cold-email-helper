import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
import { AppProvider } from "./app-provider";
import App from "./App";

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
