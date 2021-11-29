import React, { useState } from "react";

import "./Mail.css";

function Mail(props) {
  const [showContent, setShowContent] = useState(false);
  const { message, from, to, opened, subject, linkclicks, createdat } = props;
  let interaction = "";
  if (linkclicks !== null && opened !== null) {
    interaction = "openclicked";
  } else if (opened !== null) {
    interaction = "opened";
  } else if (linkclicks !== null) {
    interaction = "clicked";
  }
  function createMarkup() {
    return { __html: message };
  }
  return (
    <div
      onClick={() => setShowContent(!showContent)}
      className={`mail-card ${interaction}`}
    >
      <p>Send at: {new Date(createdat).toString()}</p>
      <p>From: {from}</p>
      <p>To: {to}</p>
      <p>Subject: {subject}</p>
      <p>Opened: {opened}</p>
      <p>
        LinkClicks:{" "}
        {linkclicks !== null &&
          Object.keys(linkclicks)
            .map((l) => `${l} (${linkclicks[l]})`)
            .join(", ")}
      </p>
      {showContent ? (
        <div>
          <p>Message</p>
          <div
            className="message-content"
            dangerouslySetInnerHTML={createMarkup()}
          ></div>
        </div>
      ) : null}
    </div>
  );
}

export default Mail;
