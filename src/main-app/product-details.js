import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class ProductDetails extends PolymerElement{
    static get template(){
        return html `
            <h1>Details</h1>
        `
    }
}

customElements.define('product-details', ProductDetails);