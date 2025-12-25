import EmailForm from "./EmailForm";
import useIsMobile from "./hooks/useIsMobile";
import { LiquidGlass } from "./modules/LiquidGlassProvider";

export default function Contact() {

  const mobile = useIsMobile();

  return (
    <>
    <h2>Si mon travail a retenu votre attention</h2>
    <div id="contactCards">
      <LiquidGlass id="email" large>
        <h3>N'hésitez pas à me contacter par mail</h3>
        <EmailForm />
      </LiquidGlass>
      <div id="reseaux" className={mobile ? "liquidGlassLarge" : ""}>
        <div className={!mobile ? "liquidGlassLarge" : ""}>
          <h3>Mes réseaux</h3>
          <div id="social">
            <a href="https://github.com/Mael-667" target="_blank">
              <i className="fa-brands fa-github" />
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/ma%C3%ABl-flament/"
              target="_blank"
            >
              <i className="fa-brands fa-square-linkedin" />
              Linkedin
            </a>
          </div>
        </div>
        <div className={!mobile ? "liquidGlassLarge" : ""}>
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
    </>
  );
}


