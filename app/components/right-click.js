import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RightClickComponent extends Component {
  @tracked suggestionItems = [];

  @tracked targetElement = null;

  get menuEle() {
    return document.getElementById('menu')
  }

  get clickableEle() {
    return document.getElementById('clickable')
  }

  get outClickEle() {
    return document.getElementById('out-click')
  }

    @action
    initRightClick() {
        const outClick = this.outClickEle;

        this.clickableEle.addEventListener('contextmenu', e => {
          e.preventDefault()
          this.targetElement = e.target;

          this.canShowRightMenu(e);
          outClick.style.display = "block"
        })
        
        outClick.addEventListener('click', () => {
         this.resetOnClick();
        })
    }

    @action
    resetOnClick() {
      this.menuEle.classList.remove('show')
      this.outClickEle.style.display = "none"
    }

    @action
    canShowRightMenu(e) {
      if (e.target.tagName === 'U') {
        this.showRightMenu(e);
      }
    }
    
    @action
    showRightMenu(e) {
      document.getElementById('myEditor').blur()
      const menu = this.menuEle;
      this.getSuggestionFor(e);
      
      menu.style.top = `${e.clientY}px`
      menu.style.left = `${e.clientX}px`
      menu.classList.add('show');

    }


    getSuggestionFor(e) {
      const targetWord = e.target.innerText,
        suggestions = this.args.suggestionMap[targetWord];

        this.suggestionItems = suggestions;
    }


    @action
    replaceText(rightWord) {
      if (this.targetElement) {
        this.targetElement.replaceWith(document.createTextNode(rightWord));
        this.resetOnClick();
      }
    }
    

    
}
