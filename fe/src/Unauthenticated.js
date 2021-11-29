import React from "react";

import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifyConfirmSignIn,
  AmplifyRequireNewPassword,
  AmplifyVerifyContact,
  AmplifyForgotPassword,
  AmplifyLoadingSpinner,
} from "@aws-amplify/ui-react";

const linkStyle = {
  color: "#ff9900",
  textDecoration: "none",
};

const Unauthenticated = () => {
  return (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignIn slot="sign-in">
        <div slot="secondary-footer-content">
          <span>
            No account?{" "}
            <a href="https://yourdomain.tld#signup" style={linkStyle}>
              Create Account
            </a>
          </span>
        </div>
      </AmplifySignIn>
      <AmplifyConfirmSignIn />
      <AmplifyRequireNewPassword />
      <AmplifyVerifyContact />
      <AmplifyForgotPassword />
      <AmplifyLoadingSpinner />
    </AmplifyAuthenticator>
  );
};

export default Unauthenticated;
