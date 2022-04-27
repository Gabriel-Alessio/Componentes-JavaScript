var id = 0;

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

    setLabel(nome){
        this.label.innerText = nome;
        return this;
    }

    setFieldModel(field){
        this.#fieldModel = field;
        return this;
    }
    getFieldModel(){
        return this.#fieldModel;
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
    
    setFieldValue(value) {
        this.#fieldValue = value;
        return this;
    }
    getFieldValue(){
        return this.#fieldValue;
    }

    setFieldText(text) {
        this.#fieldText = text;
        return this;
    }
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

export {TextBox, MaskBox, ComboBox, TextArea};