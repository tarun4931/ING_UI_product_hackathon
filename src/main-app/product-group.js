import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../components/grid-component.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '../shared-style/shared-style.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { sharedStyle } from '../shared-style/shared-style.js';
class ProductGroup extends PolymerElement{
    constructor(){
        super();
        this.url = config.baseURL + '/groups';
        this.method = "get";
        this.pagination = false;
    }
    static get properties(){
        return {
            allProducts:{
                type: Array,
                values: []
            },
            loadingData:{
                type: Boolean,
                value: true
            },
            productId:{
                type: String
            },
            productsURL:{
                type: String,
                value: config.baseURL
            },
            subProducts:{
                type: Array,
                value: []
            }
        }
    }
    getProductGroupURL(){
     return config.baseURL + '/groups';
    }
    handleResponse(event){
        console.log(event.detail.response);
        if(event.detail.response.length>0){
            this.allProducts  = event.detail.response;
            console.log(this.allProducts);
        }else{
          this.toastMessage = "Users are not available";
        }
      }
      handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
      }
      getProducts(event){
        this.productId = event.model.product.id;
        this.$.getProducts.generateRequest();
      }
      
      handleProducts(event){
          if(event.detail.response.length > 0){
            this.subProducts = event.detail.response;
          }
      }

    static get template(){
        return html `
        ${sharedStyle}
            <h1>Product group </h1>
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <div class="col-sm-6 col-md-6 offset-sm-2 offset-md-2">
            <vaadin-accordion>
            <template is="dom-repeat" items="{{allProducts}}" as="product">
                <vaadin-accordion-panel>
                  <div slot="summary" on-click="getProducts">{{product.name}}</div>
                  <vaadin-vertical-layout>
                    <div class="col-sm-12">
                        <ul class="list-unstyled">
                            <template is="dom-repeat" items="{{subProducts}}">
                                <li><a href="#/details/[[item.id]]">{{item.name}}</a></li>
                            </template>
                        </ul>
                    </div>
                  </vaadin-vertical-layout>
                </vaadin-accordion-panel>
              </template>
            </vaadin-accordion>
            </div>
            <iron-ajax
            auto
            url="[[getProductGroupURL()]]"
            method="get"
            content-type="application/json"
            on-response="handleResponse"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
      <iron-ajax
            id="getProducts"
            url="[[productsURL]]/products/[[productId]]"
            method="get"
            content-type="application/json"
            on-response="handleProducts"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
        `;
    }

    
}

customElements.define('product-group', ProductGroup);