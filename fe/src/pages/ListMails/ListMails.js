import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMails } from "../../data-adapter";

import Mail from "../../components/Mail/Mail";

const renderFooterJurek = () => `
--

Jurek Barth  
web: [heyper.link/jurekbarth](https://heyper.link/jurekbarth)  
mail: [jurek@heyper.link](mailto:jurek@heyper.link)`;

const germanPreset = (name) => `Hallo

Mein Name ist ${name} und ich bin Mitgründer von [heyper.link](https://heyper.link). Heyper.link ist ein Tool, dass es dir ermöglicht eine Micropage zu erstellen die darauf optimiert ist deine Audience weiterzuverteilen auf Content auf anderen Plattformen.

Warum heyper.link?

- **Analytics**: du bekommst DSGVO konforme Analytics ohne Cookie Banner, funktioniert immer egal ob mit oder ohne Ad-Blocker.
- **Mobile optimiert:** die Profilseiten sind im Schnitt 90% kleiner als bei der Konkurrenz. Das führt zu besserer Conversion und mehr
- **Shortlinks**: Jeder Link bekommt einen Shortlink, perfekt für deep-linking in Stories
- **Custom Domain**: Verwende deine eigene Domain, damit deine Audience sich deine Marke merkt.

Wir würden uns sehr freuen dich als Nutzer zu gewinnen, [heyper.link](https://heyper.link/) wird für dich kostenlos bleiben. Natürlich freuen wir uns über jedes Feedback!

Viele Grüße aus ${name === "Jurek" ? "München" : "Freiburg"}

${name}

P.S. Du hast Fragen? Melde dich einfach!
${name === "Jurek" ? renderFooterJurek() : ""}`;

const englishPreset = (name) => `Hi

My name is ${name} and I’ll keep it quick.

I’m the co-founder of [heyper.link](https://heyper.link). Heyper.link is a tool to create a micro landing page without a line of code. You use that tool to link to content on other platforms. 

Why heyper.link?

- **Analytics**: Get GDPR conforming analytics without a cookie banner out of the box, for your profile and each link.
- **Mobile optimized**: Our profile pages are 90% faster than our average competitor. This leads to better user experience and conversions
- **Shortlinks**: Every link gets a shortlink that you can use to deep link into content.
- **Custom Domain**: Use your custom domain without any sign of usage for heyper.link

We would be very happy to have you as a customer. For you the tool is completely free. Of course we would love to get your feedback!

Greetings from ${name === "Jurek" ? "Munich" : "Freiburg"}

${name}

P.S. You have questions? Just send us a message!
${name === "Jurek" ? renderFooterJurek() : ""}`;

function ListMails() {
  const [mails, setMails] = useState([]);
  const [mailFilter, setMailFilter] = useState("all");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setupView();
  }, []);

  async function setupView() {
    const mails = await fetchMails();
    setMails(mails);
  }
  const sorted = mails.sort((a, b) => {
    return new Date(b.createdat) - new Date(a.createdat);
  });
  async function checkMail() {
    const mails = await fetchMails();
    const found = mails.find((element) => email === element.to);
    if (found !== undefined) {
      setEmail("");
      alert("Already used");
    } else {
      alert("Good to go");
    }
  }
  return (
    <div className="App">
      <h1>All Mails</h1>
      <div>
        <h2>Check Email</h2>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={checkMail}>Check</button>
      </div>
      <div className="links">
        <Link className="new-mail-link" to="/new">
          New Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Alex from heyperlink <alex@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: germanPreset("Alex"),
              presetTo: email,
            },
          }}
        >
          [Alex] New German Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Alex from heyperlink <alex@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: englishPreset("Alex"),
              presetTo: email,
            },
          }}
        >
          [Alex] New English Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Benny from heyperlink <benny@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: germanPreset("Benny"),
              presetTo: email,
            },
          }}
        >
          [Benny] New German Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Benny from heyperlink <benny@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: englishPreset("Benny"),
              presetTo: email,
            },
          }}
        >
          [Benny] New English Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Jurek from heyperlink <jurek@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: germanPreset("Jurek"),
              presetTo: email,
            },
          }}
        >
          [Jurek] New German Mail
        </Link>
        <Link
          className="new-mail-link"
          to={{
            pathname: "/new",
            state: {
              presetFrom: "Jurek from heyperlink <jurek@heyper.link>",
              presetTopic: "<> heyper.link",
              presetMessage: englishPreset("Jurek"),
              presetTo: email,
            },
          }}
        >
          [Jurek] New English Mail
        </Link>
      </div>
      <div>
        <h2>Filter: {mailFilter}</h2>
        <button onClick={() => setMailFilter("all")}>all</button>
        <button
          onClick={() =>
            setMailFilter("Alex from heyperlink <alex@heyper.link>")
          }
        >
          Alex
        </button>
        <button
          onClick={() =>
            setMailFilter("Benny from heyperlink <benny@heyper.link>")
          }
        >
          Benny
        </button>
        <button
          onClick={() =>
            setMailFilter("Jurek from heyperlink <jurek@heyper.link>")
          }
        >
          Jurek
        </button>
      </div>

      {sorted
        .filter((m) => {
          if (mailFilter === "all") {
            return true;
          }
          return m.from === mailFilter;
        })
        .map((m) => (
          <Mail key={m.uuid} {...m} />
        ))}
    </div>
  );
}

export default ListMails;
