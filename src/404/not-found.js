import { PolymerElement, html } from '@@polymer/polymer/polymer-element.js';
import { sharedStyle } from '../shared-style/shared-style.js';
class NotFound extenfds PolymerElement{
  static get template(){
    return html `
    ${sharedStyle}
    <div>
      <iron-icon icon="error"></iron-icon>
      <h1>Sorry, we couldn't find that page</h1>
    </div>
    <button class="btn btn-primary btn-lg">
      <a href="/">Go to the home page</a>
    </button>
    `;
  }
}

customElements.define('not-found', NotFound);
