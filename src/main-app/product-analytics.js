import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { sharedStyle } from '../shared-style/shared-style.js';

class ProductAnalytics extends PolymerElement{
    static get properties(){
        return {
        }
    }
    static get template(){
        return html `
        ${sharedStyle}
            <h1>Product Details</h1>
            
        `
    }
}

customElements.define('product-analytics', ProductAnalytics);