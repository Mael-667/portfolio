/* eslint-disable no-unused-vars */
import React from "react";
import {
    addEvt,
    delEvt,
    get,
    triFusion,
    capitalizeFirstLetter,
    b64DecodeUnicode,
} from "./js/utils.js";

class ProjectCarrousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
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
            console.log(limit);

            for (let index = 0; index < limit; index++) {
                ans.push(await this.parseGithubProj(result[index], index));
            }
            console.log(ans);

            this.setState(() => ({
                cards: ans,
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

        if (parsedGithubData.desc.length > 300) {
            parsedGithubData.desc = `${parsedGithubData.desc.substring(0, 300)}...`;
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
    }

    componentDidUpdate() {
        let sb = new HorizontalScrollBar(
            get("#carProjet"),
            get("#elements"),
            get("#cursor")
        );
        let elements = get("#elements"),
            line = get("#line");
        sb.onScroll(function (center, end) {
            elements.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${end - 5
                }px, rgba(31, 0, 23, 1) ${end}px) !important;`;
            line.style = `background-image : radial-gradient(circle at ${center}px,rgba(255, 221, 235, 1) ${end - 5
                }px, rgba(31, 0, 23, 1) ${end}px) !important;`;
        });
    }

    render() {
        return (
            <>
                <div>
                    <div id="carProjet">
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
                                    Étant passionné par la programmation et les expérimentations,
                                    j'aime réaliser des scripts et des programmes en tout genre
                                    sur mon temps libre.
                                </p>
                            </div>
                        </article>
                    </div>
                    <div id="projScroll" className="liquidGlass no-drag">
                        <div id="elements">
                            <i className="fa-solid fa-circle" />
                            {this.state.cards.map(() => (
                                <Line />
                            ))}
                        </div>
                        <div id="line" />
                        <div id="cursor" className="liquidGlass" />
                    </div>
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

function Line() {
    return <i className="fa-solid fa-circle" />;
}

class HorizontalScrollBar {
    constructor(
        scrollarea,
        scrollbar,
        bar,
        transformMethod = (barposition) => `translate(${barposition}px, -50%)`
    ) {
        this.scrollarea = scrollarea;
        this.scrollbar = scrollbar;
        this.bar = bar;
        this.rect = this.scrollbar.getBoundingClientRect();
        this.barPos = this.rect.left;
        this.scrollBarWidth = this.scrollbar.offsetWidth;
        this.scrollBarRight = this.scrollbar.getBoundingClientRect().right;
        this.renderWidth = this.scrollarea.offsetWidth; //taille affichée a l'écran
        this.scrollWidth = this.scrollarea.scrollWidth; //taille totale de l'élément
        this.scrollLeft =
            Math.floor(this.scrollWidth) - Math.floor(this.renderWidth);
        this.bar.style.width = `${(this.renderWidth * this.scrollBarWidth) / this.scrollWidth
            }px`;
        this.barRight = Math.floor(this.bar.getBoundingClientRect().right);
        this.maxSpaceLeft = this.scrollBarRight - this.barRight;
        this.transform = transformMethod;
        this.onScroll();

        let updatesbBind = this.#updatescrollbar.bind(this);
        let updatebarBind = this.#updateCursor.bind(this);

        scrollarea.addEventListener("scroll", updatesbBind);

        //clic support pour la touchbar sur pc
        scrollbar.addEventListener("mousedown", (e) => {
            scrollarea.removeEventListener("scroll", updatesbBind);
            scrollbar.addEventListener("mousemove", updatebarBind);
        });

        document.addEventListener("mouseup", () => {
            scrollbar.removeEventListener("mousemove", updatebarBind);
            scrollarea.addEventListener("scroll", updatesbBind);
        });

        //touch support pour la scrollbar sur mobile
        scrollbar.addEventListener("touchstart", (e) => {
            scrollarea.removeEventListener("scroll", updatesbBind);
            scrollbar.addEventListener("touchmove", updatebarBind);
        });

        document.addEventListener("touchend", (e) => {
            scrollbar.removeEventListener("touchmove", updatebarBind);
            scrollarea.addEventListener("scroll", updatesbBind);
        });

        this.stoptt = false;
        this.decr = this.scrollWidth / 77;

        this.intervalAnim = setInterval(() => {
            this.#autoScroll();
        }, 7777);

                // carrousel = get("#carProjet"); scrollaera
            // bar = this.bar.parentElement; scrollbar
        addEvt(this.scrollarea, "touchstart", this.cancelCarAnim);
        addEvt(this.scrollarea, "mousedown", this.cancelCarAnim);
        addEvt(this.scrollbar, "mousedown", this.cancelCarAnim);

        addEvt(this.scrollbar, "touchstart", function() {
            this.cancelCarAnim();
            this.bar.classList.add("touched");
        });
        document.addEventListener("touchend", () => {
            this.bar.classList.remove("touched");
        });
    }

    onScroll(fun = (barCenter, barEnd) => { }) {
        this.styleFun = fun;
        this.#updatescrollbar();
    }

    setTransform(
        transformMethod = (barposition) => `translate(${barposition}px, -50%)`
    ) {
        this.transform = transformMethod;
    }

    #updateCursor(e) {
        let cursorPos;
        if (e.type == "touchmove") {
            cursorPos = e.changedTouches[0].clientX;
        } else {
            cursorPos = e.clientX;
        }
        let cursorRelativePos = cursorPos - this.barPos; //position du curseur par rapport a la scrollbar
        let actualBarRightPos = Math.floor(this.bar.getBoundingClientRect().right); //position de l'extremité gauche de la barre de la scrollbar
        let actualSpaceLeft = this.scrollBarRight - actualBarRightPos; //espace restant entre l'extrémité gauche de la barre de scroll et l'extrémité gauche de la scrollbar
        let spaceTotal = this.scrollBarWidth - this.bar.offsetWidth; //espace total pour calculer le ratio en % de scroll
        let trueOffset = (actualSpaceLeft * 100) / this.maxSpaceLeft; //ratio en % d'a quel point la scrollbar a été scroll
        trueOffset = Math.abs(trueOffset - 100); //j'inverse le % car si il reste 0% d'espace a scroll on veut que le carrousel soit scroll a 100%
        trueOffset = (trueOffset * this.scrollLeft) / 100; //je prends le % pixel du carrousel a scroll
        let barposition = cursorRelativePos - this.bar.offsetWidth / 2; //on deplace la barre vers le curseur - la moitié de la taille de la barre afin de la centrer
        let barCenter = cursorRelativePos;
        let barEnd = this.bar.offsetWidth / 2;
        //on gere les extrémités
        if (cursorRelativePos - this.bar.offsetWidth / 2 < 0) {
            barposition = 0;
            barCenter = this.bar.offsetWidth / 2 - 5;
        } else if (cursorRelativePos - this.bar.offsetWidth / 2 > spaceTotal) {
            barposition = spaceTotal;
            barCenter = this.scrollbar.offsetWidth - this.bar.offsetWidth / 2 + 5;
        }
        this.bar.style.transform = this.transform(barposition);
        this.styleFun(barCenter, barEnd);
        this.scrollarea.scrollTo(trueOffset, 0);
    }

    #updatescrollbar() {
        let scrollBarWidth = this.scrollbar.offsetWidth; //taille du scrollbar
        let scrollPos = this.scrollarea.scrollLeft; //a quel pt l'élément a été scroll
        let offset = (scrollPos * scrollBarWidth) / this.scrollWidth;
        this.bar.style.transform = this.transform(offset);
        let barCenter = offset + this.bar.offsetWidth / 2;
        let barEnd = this.bar.offsetWidth / 2 + 4;
        this.styleFun(barCenter, barEnd);
    }




    
    target = 0;
    animId;
    animId2;
    incr = 0;

cancelCarAnim = (() => {
    this.stoptt = true;
    clearInterval(this.intervalAnim);
    cancelAnimationFrame(this.animId);
    cancelAnimationFrame(this.animId2);
    delEvt(this.scrollarea, "touchstart", this.cancelCarAnim);
    delEvt(this.scrollarea, "mousedown", this.cancelCarAnim);
    delEvt(this.scrollbar, "mousedown", this.cancelCarAnim);
}).bind(this)

 #autoScroll() {
    if (this.target == this.scrollWidth - this.renderWidth) {
        this.#scrollAnimTo0();
        return;
    }
    let steps = this.scrollarea.childElementCount;
    let nextStep = this.scrollWidth / steps;
    let scrollPos = this.scrollarea.scrollLeft; //a quel pt l'élément a été scroll
    this.target = scrollPos + nextStep;
    if (this.target > this.scrollWidth - this.renderWidth) {
        this.target = this.scrollWidth - this.renderWidth;
    }
    this.incr = nextStep / 77;
    this.#scrollAnim();
}
#scrollAnim() {
    if (this.stoptt) {
        return;
    }
    if (this.scrollarea.scrollLeft < this.target) {
        this.scrollarea.scrollTo(this.scrollarea.scrollLeft + this.incr, 0);
        this.animId = requestAnimationFrame((this.#scrollAnim).bind(this));
    }
}
#scrollAnimTo0() {
    if (this.stoptt) {
        return;
    }
    if (this.target > 0) {
        this.target = this.target - this.decr;
        this.scrollarea.scrollTo(this.target, 0);
        this.animId2 = requestAnimationFrame((this.#scrollAnimTo0).bind(this));
    }
}
}