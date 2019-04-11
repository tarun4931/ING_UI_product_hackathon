import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class ProductGroup extends PolymerElement{
    static get template(){
        return html `
            <h1>Product Group</h1>
        `
    }
}

customElements.define('product-group', ProductGroup);