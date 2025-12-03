/* eslint-disable no-unused-vars */
import React from "react";
import {
  addEvt,
  delEvt,
  get,
  triFusion,
  capitalizeFirstLetter,
  b64DecodeUnicode,
  animateOnSpawn,
} from "./js/utils.js";
import ProjectScrollbar from "./projectScrollbar.jsx";

class ProjectCarrousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      cardsLength: 0,
    };
  }

  async loadGithubData() {
    const url = "https://api.github.com/users/Mael-667/repos";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      let result = await response.json();
      result = triFusion(result, (g, d) => g.id > d.id);
      let ans = [];
      let limit = result.length > 6 ? 6 : result.length;
      for (let index = 0; index < limit; index++) {
        ans.push(await this.parseGithubProj(result[index], index));
      }

      this.setState(() => ({
        cards: ans,
        cardsLength: ans.length,
      }));
    } catch (error) {
      console.error(error.message);
    }
  }

  async getReadme(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return b64DecodeUnicode(result.content);
    } catch (error) {
      console.error(error.message);
      return "";
    }
  }

  async parseGithubProj(data, id) {
    let parsedGithubData = {};
    parsedGithubData.key = id;
    parsedGithubData.name = capitalizeFirstLetter(data.name);

    parsedGithubData.url = data.html_url;
    parsedGithubData.img = this.getProjectIcon(parsedGithubData.name);
    parsedGithubData.primaryLanguage = data.language;
    parsedGithubData.languageIcon = this.getLanguageIcon(data.language);
    parsedGithubData.stars = data.stargazers_count; //one day.
    parsedGithubData.desc = data.description;

    if (parsedGithubData.desc == null) {
      parsedGithubData.desc = await this.getReadme(
        `https://api.github.com/repos/Mael-667/${data.name}/contents/README.md`
      );
    }

    if (parsedGithubData.desc.length > 255) {
      parsedGithubData.desc = `${parsedGithubData.desc.substring(0, 255)}...`;
    }

    return parsedGithubData;
  }

  getProjectIcon(project) {
    let link = {
      Stateur: "./img/stateur.jpg",
      Interstalla: "./img/interstella.jpg",
      Flex: "./img/flex.jpg",
      Diskype: "./img/diskype.jpg",
      Portfolio: "./img/portfolio.png",
      "Liquid-Glass-CSS": "./img/lgcss.gif",
    };
    return link[project];
  }

  getLanguageIcon(language) {
    let icons = {
      Java: <i className="fa-brands fa-java"></i>,
      HTML: <i className="fa-brands fa-html5"></i>,
      JavaScript: <i className="fa-brands fa-square-js"></i>,
      CSS: <i className="fa-brands fa-css"></i>,
    };
    return icons[language];
  }

  componentDidMount() {
    this.loadGithubData();
    animateOnSpawn(
      get("#carProjet"),
      "slide-in-right 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"
    );
  }

  render() {
    return (
      <>
        <h2>Mes projets</h2>
        <div>
          <div id="carProjet" style={{ transform: "translateX(50vw)" }}>
            {this.state.cards.map((element) => (
              <ProjectCard data={element} />
            ))}
            <article className="liquidGlassLarge projet">
              <div
                className="minia"
                style={{ backgroundImage: 'url("./img/more.jpg")' }}
              ></div>
              <div className="projText">
                <div className="projEntete">
                  <h3>Et bien plus</h3>
                  <p>
                    <i className="fa-solid fa-trophy" />
                  </p>
                </div>
                <p>
                  Étant particulièrement passionné par la programmation, je me
                  plais réaliser des programmes en tout genre et à essayer
                  différentes technologies sur mon temps libre.
                </p>
              </div>
            </article>
          </div>
          {this.state.cardsLength > 0 && (<ProjectScrollbar length={this.state.cardsLength} />)}
        </div>
      </>
    );
  }
}
export default ProjectCarrousel;

function ProjectCard(data) {
  data = data.data;
  return (
    <article className="liquidGlassLarge projet" key={data.key}>
      <div
        className="minia"
        style={{ backgroundImage: `url(${data.img}` }}
        role="img"
        aria-label={`Image d'illustration pour mon projet ${data.name}`}
      ></div>
      <div className="projText">
        <div className="projEntete">
          <h3>{data.name}</h3> <p>{data.languageIcon}</p>
        </div>
        <p>{data.desc}</p>
      </div>
      <a href={data.url} target="_blank" className="liquidBtn">
        En voir plus
      </a>
    </article>
  );
}
