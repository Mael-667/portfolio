import emailjs from "@emailjs/browser";
import { useEffect } from "react";
import { addEvt, get } from "./js/utils";

export default function EmailForm() {
  useEffect(() => {
    initEmailJs();
  }, []);

  return (
    <form>
      <p id="mailLog" />
      <input
        type="text"
        name="sujet"
        id="sujet"
        placeholder="Votre nom"
        className="liquidBtn"
      />
      <input
        type="text"
        name="mail"
        id="mail"
        placeholder="Votre email"
        className="liquidBtn"
      />
      <textarea
        type="text"
        name="text"
        id="text"
        placeholder="Votre message"
        className="liquidBtn"
        defaultValue={""}
      />
      <button type="submit" className="liquidGlass" id="sendMail">
        <i className="fa-solid fa-paper-plane" aria-label="Envoyer le mail" />
      </button>
    </form>
  );
}

function initEmailJs() {
  (function () {
    emailjs.init({
      publicKey: "yYpHDqxVNiasi79Ps",
    });
  })();

  let mailLog = get("#mailLog");
  addEvt(get("form"), "submit", function (e) {
    e.preventDefault();
    mailLog.style.backgroundColor = "";
    mailLog.innerText = "";
    let params = {
      name: get("#sujet").value,
      email: get("#mail").value,
      message: get("#text").value,
    };
    let complete = true;
    for (let key in params) {
      if (params[key] == "") {
        mailLog.innerText = `Le champ ${
          key == "name" ? "Nom" : key
        } ne peut pas être vide`;
        complete = false;
      }
    }
    if (!params.email.match(/.*@.*\..*/)) {
      mailLog.innerText = `Veuillez entrer une adresse mail valide`;
      complete = false;
    }
    if (complete) {
      mailLog.style.backgroundColor = "#68ff8494";
      mailLog.innerText = "Envoi en cours";
      emailjs.send("service_3942ntr", "template_vmiqhyq", params).then(
        function () {
          mailLog.innerText = "Email bien envoyé.";
          get("form").reset();
        },
        function (error) {
          console.log(error);
          mailLog.innerText = `L'email n'a pas pu être envoyé`;
        }
      );
    }
    mailLog.style.display = "block";
  });
}
