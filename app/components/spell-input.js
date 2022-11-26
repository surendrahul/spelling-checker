import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class SpellInputComponent extends Component {

    @tracked suggestionMap = {};

    getElement() {
        return document.getElementById('myEditor');
    }

    getText() {
        return this.getElement().innerText;
    }

    getUrl(text) {
        const baseUri = 'https://api.textgears.com/spelling';
        
        return `${baseUri}?text=${text}&language=en-GB&whitelist=&dictionary_id=&ai=0&key=kGRCrpuTWEEfVFbw`;
    }

    @action
    inputCallback(e){

        
        let text = this.getText(),
            encodedText = text.replaceAll(' ', '+'),
            url = this.getUrl(encodedText),
            newText = '';

        fetch(url).then((response) => 
            response.json()
        ).then((jsondata) => {
            if (jsondata.response.errors.length) {
                this.constructSuggestionMap(jsondata);
                jsondata.response.errors.forEach((eachData, index)=>{
                    if(jsondata.response.errors.length-1 === index){
                        let abc = text.slice(newText.length - 7*index, eachData.offset) + "<u>" + text.slice(eachData.offset, eachData.length+eachData.offset)+ "</u>" + text.slice(eachData.length+eachData.offset);
                        newText += abc;
                    }else{
                        let abc = text.slice(newText.length - 7*index, eachData.offset) + "<u>" + text.slice(eachData.offset, eachData.length+eachData.offset)+ "</u>";
                        newText += abc;
                    }
                })
            } else {
                newText = text;
            }
            this.getElement().innerHTML = newText;
        });
    }

    constructSuggestionMap(response) {
        const errors = response.response.errors,
            resultMap = {};

        errors.map(error => {
            resultMap[error.bad] = error.better;
        });

        this.suggestionMap = resultMap;
    }

}
