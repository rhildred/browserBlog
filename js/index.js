import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js";
import "https://cdnjs.cloudflare.com/ajax/libs/marked/1.1.1/marked.js";
import "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js";
import aPages from "../pages/index.js";
import aItems from "../items/index.js";

class Page {
    constructor(){
        this.sName = "Richard Hildred";
        this.sUrlToEmailer = "https://dry-bayou-18746.herokuapp.com/send/";
        const sBase = document.location.pathname;
        if(sBase[sBase.length - 1] == "/"){
            this.sBase = sBase.substr(0, sBase.length -1);
        }else{
            const sFile = '/' + document.location.pathname.split('/').pop();
            this.sBase = sBase.substr(0, sBase.length - sFile.length); 
        }
    }
    getImageSrc(sImage){
        if(sImage.match(/\:\/\//)){
            return sImage;
        }else{
            return this.sBase + sImage;
        }
    }
    render() {
        console.log("render called on page");
    }
}

class Items extends Page{
    constructor(oItems) {
        super();
        this.oItems = oItems;
        this.nCurrentItem = 0;
        $("article#items").click((evt) =>{
            evt.preventDefault();
            const nItem = evt.target.id[4];
            if(nItem){
                this.nCurrentItem = evt.target.id[4];
                $("article#current").html("");
                $("section#itemsInner").html("");
                this.render(); 
            }
        });
    }
    render(){
        $.get(`${this.sBase}/items/${this.oItems[this.nCurrentItem].fname}`, (sMarkdown) => {
            $("article#current").append(`
                <div class="itemImage"><img src="${this.getImageSrc(this.oItems[this.nCurrentItem].specialImage)}" /></div>
            `);
            $("article#current").append(`
                <div class="markdownItem">${marked(sMarkdown)}</div>
            `)

        })
        for(let n = 0; n < this.oItems.length; n++){
            if(n != this.nCurrentItem){
                $("section#itemsInner").append(`
                <div class="item">
                    <a class="itemLink" href="#"><img id="item${n}" src="${this.getImageSrc(this.oItems[n].specialImage)}" /></a>
                    <a id="btnn${n}" class="itemLink btn btn-primary btn-block" href="#">Learn More</a>
                </div>
                `);
           }
        }
    }

}

class Section extends Page {
    constructor(oOptions) {
        super();
        this.oOptions = oOptions;
    }
    render() {
        $.get(`${this.sBase}/pages/${this.oOptions.fname}`, (sMarkdown) => {
            $(`#${this.oOptions.title}`).prepend(`
                <div class="markDownPage">${marked(sMarkdown)}</div>
            `);
            if (this.oOptions.specialImage) {
                $(`#${this.oOptions.title}`).prepend(`
                <div class="pageImage"><img src="${this.getImageSrc(this.oOptions.specialImage)}" /></div>
                `);
            }    

        })
    }
}

class Article extends Page {
    render() {
        for (let n = 0; n < aPages.length; n++) {
            $("article#pages").append(
                `<section id="${aPages[n].title}"></section>`
            );
            new Section(aPages[n]).render();
        }
    }
}

class Footer extends Page {
    render() {
        const yToday = new Date().getFullYear();
        $("footer").html(
            `&copy; ${yToday} ${this.sName}`
        );
    }
}

class Contact extends Page{
    render() {
        $("#Contact").append(`
        <form action="${this.sUrlToEmailer}" method="POST">
            <div class="form-group">
                <label>Name: <input name="name" placeholder="name" class="form-control" required /></label>
            </div>
            <div class="form-group">
                <!-- Add required to make the user enter something. Add type="email" to make it have an @ symbol-->
                <label>Email:<input name="email" placeholder="email" type="email" class="form-control"
                        required /></label>
            </div>
            <div class="form-group">
                <label>Message:<textarea name="message" placeholder="type your message here" class="form-control"
                        required></textarea></label>
            </div>
            <button type="submit">Send Message</button>

        </form>    
        `);
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
                <a class="navbar-brand" href="#">Portfolio of ${this.sName}</a>
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
        this.items = new Items(aItems);
        this.article = new Article();
        this.footer = new Footer();
        this.contact = new Contact();
    }
    render() {
        this.header.render();
        this.nav.render();
        this.items.render();
        this.article.render();
        this.footer.render();
        this.contact.render();
    }
}

$(document).ready(() => {
    new Portfolio().render();
    $('.right-button').click((evt) => {
        evt.preventDefault();
        $('section#itemsInner').animate({
            scrollLeft: "+=200px"
        }, "fast");
    });

    $('.left-button').click((evt) => {
        evt.preventDefault();
        $('section#itemsInner').animate({
            scrollLeft: "-=200px"
        }, "fast");
    });

});

