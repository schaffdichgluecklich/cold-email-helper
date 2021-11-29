import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { fetchMails, fetchPreview, fetchSend } from "../../data-adapter";

const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function NewMail() {
  const { state } = useLocation();
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (state !== undefined) {
      const { presetMessage, presetTopic, presetFrom, presetTo } = state;
      setMessage(presetMessage);
      setSubject(presetTopic);
      setFrom(presetFrom);
      setTo(presetTo);
    }
  }, []);

  useEffect(() => {
    setIsPreview(false);
  }, [message, from, to, subject]);

  async function send() {
    if (!to.match(regexp) || message === "" || to === "" || from === "") {
      alert("Invalid format");
      return;
    }
    setIsSending(true);
    const mails = await fetchMails();
    const found = mails.find((element) => to === element.to);
    if (
      found !== undefined &&
      !window.confirm(
        `There's already an email sent to this email. Do you want to continue?`
      )
    ) {
      setIsSending(false);
      return;
    }
    const data = await fetchSend({ message, from, to, subject });
    if (data === null) {
      alert("something went wrong, look into the console logs!");
      return;
    }
    setIsSent(true);
  }
  async function preview() {
    if (!to.match(regexp) || message === "" || to === "" || from === "") {
      alert("Invalid format");
      return;
    }
    const data = await fetchPreview({ message, from, to, subject });
    if (data === null) {
      alert("error, show in console for more information");
      return;
    }
    setPreviewData(data);
    setIsPreview(true);
  }
  function createMarkup() {
    return { __html: previewData.html };
  }
  if (isSent) {
    return (
      <div className="App">
        <h1>Success</h1>
        <Link to="/">Overview</Link>
      </div>
    );
  }
  return (
    <div className="App">
      <label htmlFor="from">From:</label>
      <select id="from" onChange={(e) => setFrom(e.target.value)}>
        <option selected={from === ""} value="">
          Select
        </option>
        <option
          selected={from === "Alex from heyperlink <alex@heyper.link>"}
          value="Alex from heyperlink <alex@heyper.link>"
        >
          Alex from heyperlink (alex@heyper.link)
        </option>
        <option
          selected={from === "Benny from heyperlink <benny@heyper.link>"}
          value="Benny from heyperlink <benny@heyper.link>"
        >
          Benny from heyperlink (benny@heyper.link)
        </option>
        <option
          selected={from === "Jurek from heyperlink <jurek@heyper.link>"}
          value="Jurek from heyperlink <jurek@heyper.link>"
        >
          Jurek from heyperlink (jurek@heyper.link)
        </option>
      </select>
      <label htmlFor="to">To:</label>
      <input
        id="to"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        type="text"
      />

      <label htmlFor="subject">Subject:</label>
      <input
        id="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        type="text"
      />
      <label htmlFor="message">Message (Markdown):</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        cols="30"
        rows="30"
      ></textarea>
      {!isPreview ? (
        <div className="button" onClick={preview}>
          preview
        </div>
      ) : null}
      {isPreview ? (
        <div>
          <br />
          <br />
          <br />
          <h1>Preview:</h1>
          <p>From: {previewData.from}</p>
          <p>To: {previewData.to}</p>
          <p>Subject: {previewData.subject}</p>
          <p>Message:</p>
          <div
            className="message-content"
            dangerouslySetInnerHTML={createMarkup()}
          />
          {!isSending ? (
            <div className="button" onClick={send}>
              send
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default NewMail;
