import React from "react";
import { AmplifyProvider, Auth } from "amplified";

import awsExports from "./aws-exports";

export const AppProvider = ({ children }) => {
  return (
    <React.Suspense fallback={<div>Loading</div>}>
      <AmplifyProvider config={awsExports}>
        <Auth.Provider>{children}</Auth.Provider>
      </AmplifyProvider>
    </React.Suspense>
  );
};
