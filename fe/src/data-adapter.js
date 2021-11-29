import { Auth } from "aws-amplify";

import { API_URL } from "./config";

export async function fetchMails() {
  const {
    idToken: { jwtToken },
  } = await Auth.currentSession();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwtToken}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${API_URL}/mail`, requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}

export async function fetchSend(payload) {
  const {
    idToken: { jwtToken },
  } = await Auth.currentSession();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwtToken}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(payload);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(`${API_URL}/mail/send`, requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}

export async function fetchPreview(payload) {
  const {
    idToken: { jwtToken },
  } = await Auth.currentSession();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwtToken}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(payload);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(`${API_URL}/mail/preview`, requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}
