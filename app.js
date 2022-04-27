import {TextBox, MaskBox, ComboBox, TextArea} from "./classes.js";
// import styles from './styles.css' assert { type: "css" };
//         document.adoptedStyleSheets = [styles];
debugger;

window.onload = () => {
    const model = {
        nome: '',
        quantidade: 0,
        cidadeId: 0,
        descricao: ''
    }
    const textBox = new TextBox(model);
    const maskBox = new MaskBox(model);
    const comboBox = new ComboBox(model);
    const textArea = new TextArea(model);
    document.getElementById('container')
        .append(textBox)
        .append(maskBox)
        .append(comboBox)
        .append(textArea);

    textBox.setFieldModel('nome').setLabel('TextBox');
    maskBox.setFieldModel('quantidade').setLabel('MaskBox');

    comboBox
        .setLabel('ComboBox')
        .setFieldModel('cidadeId')
        .setFieldValue('id')
        .setFieldText('name')
        .setUrl(`https://makeup-api.herokuapp.com/api/v1/products.json`);
    
    textArea.setFieldModel('descricao').setLabel('TextArea');
        
    const button = document.getElementById('button');
    const button2 = document.getElementById('button2');
    button.onclick = () => {
        textBox.setLabel('Novo valor da label TextBox!!!');
        maskBox.setLabel('Novo valor da label MaskBox!!!');
        comboBox.setLabel('Novo valor da label ComboBox!!!')
        textArea.setLabel('Novo valor da label TextArea!!!');
    }
    button2.onclick = () => {
        console.log(model); 
    }
}