import {
  triFusion,
  capitalizeFirstLetter,
  b64DecodeUnicode,
} from "../js/utils.js";

export default class GithubData {
  static async loadData() {
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
        ans.push(await this.#parseGithubProj(result[index], index));
      }

      return ans;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  static async #getReadme(url) {
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

  static async #parseGithubProj(data, id) {
    let parsedGithubData = {};
    parsedGithubData.key = id;
    parsedGithubData.name = capitalizeFirstLetter(data.name);

    parsedGithubData.url = data.html_url;
    parsedGithubData.img = this.#getProjectIcon(parsedGithubData.name);
    parsedGithubData.primaryLanguage = data.language;
    parsedGithubData.languageIcon = this.#getLanguageIcon(data.language);
    parsedGithubData.stars = data.stargazers_count; //one day.
    parsedGithubData.desc = data.description;

    if (parsedGithubData.desc == null) {
      parsedGithubData.desc = await this.#getReadme(
        `https://api.github.com/repos/Mael-667/${data.name}/contents/README.md`
      );
    }

    if (parsedGithubData.desc.length > 255) {
      parsedGithubData.desc = `${parsedGithubData.desc.substring(0, 255)}...`;
    }

    return parsedGithubData;
  }

  static #getProjectIcon(project) {
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

  static #getLanguageIcon(language) {
    let icons = {
      Java: <i className="fa-brands fa-java"></i>,
      HTML: <i className="fa-brands fa-html5"></i>,
      JavaScript: <i className="fa-brands fa-square-js"></i>,
      CSS: <i className="fa-brands fa-css"></i>,
    };
    return icons[language];
  }
}