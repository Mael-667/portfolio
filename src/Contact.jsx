import EmailForm from "./EmailForm";

export default function Contact() {

  return (
    <div id="contactCards">
      <div id="email" className="liquidGlassLarge">
        <h3>N'hésitez pas à me contacter par mail</h3>
        <EmailForm />
      </div>
      <div id="reseaux">
        <div className="liquidGlassLarge">
          <h3>Ou retrouvez moi sur</h3>
          <div id="social">
            <a href="https://github.com/Mael-667" target="_blank">
              <i className="fa-brands fa-github" />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/ma%C3%ABl-flament-9256b9386/"
              target="_blank"
            >
              <i className="fa-brands fa-square-linkedin" />
              Linkedin
            </a>
          </div>
        </div>
        <div className="liquidGlassLarge">
          <h3>Mon cv</h3>
          <a
            href="./files/CV_2025-09-19_Maël_Flament.pdf"
            download=""
            className="liquidBtn"
          >
            <div id="dlcv">
              <i className="fa-solid fa-file-arrow-down" />{" "}
              <p>Télécharger mon CV</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}


