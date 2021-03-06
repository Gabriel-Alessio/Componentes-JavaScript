var id = 0;
var grupoId = 0;
var navUl = [];

class ElementoBase {
    constructor(model){
        this.model = model;
    }
    model = null;
    #fieldModel = '';

    containerInput = document.createElement('div')
    containerLabel = document.createElement('div')
    container = document.createElement('div')
    
    input = (() => {
        const text = document.createElement('input');
        text.id = `id${id++}`
        return text;
    })()
    
    label = (() => {
        const label = document.createElement('label');
        label.id = 'labelId';
        label.className = 'label';
        return label;
    })()


    /**
     * @returns {HTMLElement}
     */
    render(){
       
        this.containerLabel.appendChild(this.label);
        this.containerInput.appendChild(this.input);
        
        this.container.appendChild(this.containerLabel);
        this.container.appendChild(this.containerInput);
        return this.container;
    }
    /**
     * @param {string} nome 
     * @returns {this}
     */
    setLabel(nome){
        this.label.innerText = nome;
        return this;
    }
    /**
     * @param {string} field 
     * @returns {this} 
     */
    setFieldModel(field){
        this.#fieldModel = field;
        return this;
    }
    /**
     * @returns {string}
     */
    getFieldModel(){
        return this.#fieldModel;
    }
}

class ElementoNavBar extends ElementoBase{
    containerNav = document.createElement('div')
    container = document.createElement('div')

    navBar = (() => {
        const nav = document.createElement('nav')
        return nav;
    })()

    /**
     * @returns {HTMLElement}
     */
     render(){
        this.containerNav.appendChild(this.navBar);
        this.container.appendChild(this.containerNav);
        return this.container;
    }
}

class TextBox extends ElementoBase{
    input = (()=> {
        const text = document.createElement('input');
        text.id = `id${id++}`;
        text.className = 'textBox';   
        text.addEventListener('input', () => {
            this.model[this.getFieldModel()] = text.value;
        });
        text.type = 'text';
        return text;
    })()
}

class MaskBox extends ElementoBase{
    input = (()=> {
        const formatter = new Intl.NumberFormat('pt-BR');
        const numRegex = /\D/g;
        const mask = document.createElement('input');
        mask.id = `id${id++}`;
        mask.className = 'maskBox';
        mask.addEventListener('input', () => {
            let valor = parseInt(mask.value.replace(numRegex, '') || 0,10);
            mask.value = formatter.format(valor);
            this.model[this.getFieldModel()] = valor;
        });
        mask.type = 'text';
        return mask;
    })()
}

class ComboBox extends ElementoBase{
    input = (() => {
        const comboBox = document.createElement('select');
        comboBox.id = `id${id++}`;
        comboBox.className = 'comboBox';
        comboBox.addEventListener('change', () => {
            this.model[this.getFieldModel()] = comboBox.value;
        });
        return comboBox;
    })()
 
    #fieldValue = '';
    #fieldText = '';
    
    /**
     * 
     * @param {string} value 
     * @returns {this}
     */
    setFieldValue(value) {
        this.#fieldValue = value;
        return this;
    }
    /**
     * @returns {string}
     */
    getFieldValue(){
        return this.#fieldValue;
    }
    /**
     * @param {string} text
     * @returns {this} 
     */
    setFieldText(text) {
        this.#fieldText = text;
        return this;
    }
    /**
     * @returns {string}
     */
    getFieldText(){
        return this.#fieldText;
    }
    
    async setUrl(url){
        const response = await fetch(url);
        const data = await response.json();
        this.setData(data);
    }

    setData(data) {
        for (let index = 0; index < data.length; index++) {
            const option = document.createElement('option');
            option.value = data[index][this.getFieldValue()];
            option.text = data[index][this.getFieldText()];
            this.input.appendChild(option);
        }
    }
}

class TextArea extends ElementoBase{
    input = (() => {
        const textArea = document.createElement('textarea');
        textArea.id = `id${id++}`;
        textArea.className = 'textArea';
        textArea.addEventListener('input', () => {
            this.model[this.getFieldModel()] = textArea.value;
        });
        return textArea;
    })()
}

class NavBar extends ElementoNavBar{
    #navBarId = ''; 
    navBar = (() => {
        const navElem = document.createElement("nav");
        navElem.id = 'navId';

        return navElem;
    })()

    grupoNavBar(nome){
        const header = document.createElement("header");
        header.classList = 'header';
        header.innerText = nome;

        const navList = document.createElement("ul");
        navList.id = `grupoId${grupoId++}`;
        this.#navBarId = navList.id;
        navList.classList = 'grupoNav';

        header.addEventListener("click", () => {
            if(navList.style.display != 'block'){
                for (let index = 0; index < navUl.length; index++) {
                    if(navList.id != navUl[index].id && navUl[index].style.display == 'block'){
                        navUl[index].style.display = 'none';
                    }
                    else {
                        navUl[index].style.display = 'block';
                    }
                }
            }
        });

        header.append(navList);
        const navElem = document.getElementById("navId");
        navElem.append(header);

        navUl = [].slice.call(document.getElementsByClassName('grupoNav'));
        navUl.map((x, index) => { index == 0 ? x.style.display = 'block': x.style.display = 'none'});
    }

    itemNavBar(href, text){
        const navItem = document.createElement("li");
        navItem.classList = 'li';
        const navLink = document.createElement("a");
        navLink.classList = 'a';
        
        navLink.href = href;
        navLink.innerHTML = text;
        
        navItem.appendChild(navLink);
        const navList = document.getElementById(this.#navBarId);
        navList.appendChild(navItem);
    }
}

const _append = HTMLElement.prototype.append;

HTMLElement.prototype.append = function() {
    for (let index = 0; index < arguments.length; index++) {
        const element = arguments[index];

        if(element instanceof ElementoBase) {
            _append.call(this, element.render());
        }
        else {  
            _append.call(this, element);
        }
    }

    return this;
};

export {TextBox, MaskBox, ComboBox, TextArea, NavBar};