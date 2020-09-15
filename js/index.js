import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/marked/1.1.1/marked.js";
import aPages from "../pages/index.js";

class Page {
    render(){
        console.log("render called on page");
    }
}

class Section extends Page{
    constructor(oOptions){
        super();
        this.oOptions = oOptions;
    }
    render(){
        $.get(`/pages/${this.oOptions.fname}`, (sMarkdown)=>{
            $(`#${this.oOptions.title}`).html(
                marked(sMarkdown)
            )
    
        })
    }
}

class Article extends Page{
    render(){
        for(let n = 0; n < aPages.length; n++){
            $("article").append(
                `<section id="${aPages[n].title}"></section>`
            );
            new Section(aPages[n]).render();
        }
    }
}

class Footer extends Page{
    render(){
        const sName = "Richard Hildred";
        const yToday = new Date().getFullYear();
        $("footer").html(
            `&copy; ${yToday} ${sName}`
        );
    }
}

class Portfolio extends Page{
    constructor(){
        super();
        this.header = new Page();
        this.nav = new Page();
        this.article = new Article();
        this.footer = new Footer();
    }
    render(){
        this.header.render();
        this.nav.render();
        this.article.render();
        this.footer.render();
    }
}

$(document).ready(()=>{
    new Portfolio().render();
});

