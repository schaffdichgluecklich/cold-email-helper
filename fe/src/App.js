import React from "react";
import { Auth } from "amplified";

import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";

const App = () => {
  const currentUser = Auth.useCurrentUser();
  if (currentUser === undefined) {
    return <div>Loading</div>;
  }
  return currentUser ? <Authenticated /> : <Unauthenticated />;
};

export default App;
