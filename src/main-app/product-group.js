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
            },
            subProductID:{
              type: String
            }
        }
    }
    getProductGroupURL(){
     return config.baseURL + '/groups';
    }
    handleResponse(event){
        if(event.detail.response.length>0){
            this.allProducts  = event.detail.response;
            this.getProducts();
        }else{
          this.toastMessage = "Products Groups are not available";
          this.$.toast.open();
        }
      }
      handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
      }
      getProducts(event){
        if(event){
          this.productId = event.model.product.id;
        }else{
          this.productId = this.allProducts[0].id;
        }
        this.$.getProducts.generateRequest();
      }
      
      handleProducts(event){
          if(event.detail.response.length > 0){
            this.subProducts = event.detail.response;
          }else{
            this.toastMessage = "No Products to display";
            this.$.toast.open();
          }
      }
      getProdID(event){
        this.subProductID = event.model.item.id;
        if(this.subProductID){
          this.$.getProDetails.generateRequest();
        }
      }
      handleProductDetails(event){
          if(event.detail.response.status){
            this.set('route.path', '/details/' + this.productId + '/' + this.subProductID);
          }else{
            this.toastMessage = "No Product Details to Display";
            this.$.toast.open();
          }
      }

    static get template(){
        return html `
        ${sharedStyle}
            <h1>Product group </h1>
            <paper-toast id="toast" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <div class="col-sm-6 col-md-6 offset-sm-2 offset-md-2 border">
            <vaadin-accordion>
            <template is="dom-repeat" items="{{allProducts}}" as="product">
                <vaadin-accordion-panel>
                  <div slot="summary" on-click="getProducts">{{product.name}} | {{product.count}}</div>
                  <vaadin-vertical-layout>
                    <div class="col-sm-12">
                        <ul class="list-group">
                            <template is="dom-repeat" items="{{subProducts}}">
                                <li class="list-group-item" on-click="getProdID">{{item.name}}</li>
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
      <iron-ajax
            id="getProDetails"
            url="[[productsURL]]/product/[[subProductID]]"
            method="get"
            content-type="application/json"
            on-response="handleProductDetails"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
        `;
    }

    
}

customElements.define('product-group', ProductGroup);