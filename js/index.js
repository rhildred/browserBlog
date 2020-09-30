import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/marked/1.1.1/marked.js";
import "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js";
import aPages from "../pages/index.js";

const sName = "Alex Cruickshank";

class Page {
    constructor() {
        this.sName = "Alex Cruickshank";
        const sBase = document.location.pathname;
        if (sBase[sBase.length - 1] == "/") {
            this.sBase = sBase.substr(0, sBase.length - 1);
        } else {
            const sFile = '/' + document.location.pathname.split('/').pop();
            this.sBase = sBase.substr(0, sBase.length - sFile.length);
        }
    }
    getImageSrc(sImage) {
        if (sImage.match(/\:\/\//)) {
            return sImage;
        } else {
            return this.sBase + sImage;
        }
    }
    render() {
        console.log("render called on page");
    }
}

class Section extends Page {
    constructor(oOptions) {
        super();
        this.oOptions = oOptions;
    }
    render() {
        if (this.oOptions.specialImage) {
            $(`#${this.oOptions.title}`).append(`
            <div class="pageImage"><img src="${this.getImageSrc(this.oOptions.specialImage)}" /></div>
            `);
        }
        $.get(`${this.sBase}/pages/${this.oOptions.fname}`, (sMarkdown) => {
            $(`#${this.oOptions.title}`).append(`
                <div class="markDownPage">${marked(sMarkdown)}</div>
            `)

        })
    }
}

class Article extends Page {
    render() {
        for (let n = 0; n < aPages.length; n++) {
            $("article").append(
                `<section id="${aPages[n].title}"></section>`
            );
            /* const sPage = aPages[n];
            if (sPage.specialImage) {
                $("article").append(`
                <img src="${sPage.specialImage}"/>
                `)
            }*/
            new Section(aPages[n]).render();
        }
    }
}



class Footer extends Page {
    render() {

        const yToday = new Date().getFullYear();
        $("footer").html(
            `&copy; ${yToday} ${sName}`
        );
    }
}

class Nav extends Page {
    render() {
        let sMenu = "";
        for (let n = 0; n < aPages.length; n++) {
            const sMenuItem = aPages[n].title;
            if (sMenuItem != "index") {
                sMenu += `<li><a href="#${sMenuItem}">${sMenuItem}</a></li>`;
            }
        }
        $("nav").html(`
                <div class="navbar navbar-inverse navbar-static-top" role="navigation">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">Portfolio of ${sName}</a>
                    </div>
                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">                       
                            ${sMenu}                        
                        </ul>
                    </div>
                </div>
            `);
    }
}

class Portfolio extends Page {
    constructor() {
        super();
        this.header = new Page();
        this.nav = new Nav();
        this.article = new Article();
        this.footer = new Footer();
    }
    render() {
        this.header.render();
        this.nav.render();
        this.article.render();
        this.footer.render();
    }
}

$(document).ready(() => {
    new Portfolio().render();
});