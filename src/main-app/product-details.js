import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { sharedStyle } from '../shared-style/shared-style.js';

class ProductDetails extends PolymerElement{
    static get properties(){
        return {
            productDetails:{
                type:Object,
                value: {}
            },
            detailsUrl:{
                type: String,
                value: config.baseURL
            },
            allProducts:{
                type: Array,
                value: []
            },
            groupName:{
                type: Array
            }
            
        }
    }
    handleResponse(event){
        console.log('RES - ',event.detail.response);
        this.$.getAllGroups.generateRequest();
        if(event.detail.response){
            this.productDetails  = event.detail.response;
        }else{
          this.toastMessage = "Products are not available";
          this.$.toast.open();
        }
    }
    handleProductGroups(event){
        if(event.detail.response.length > 0){
            this.productGroups = event.detail.response.filter((obj) => {
                return obj.id !== parseInt(this.routeData.productId);
            });
        }
    }
    handleGroup(event){
        if(event.detail.response){
            this.allProducts  = event.detail.response;
            this.groupName = event.detail.response.filter((prod) => {
                console.log(prod.id, this.routeData.groupId);
                return prod.id === parseInt(this.routeData.groupId);
            })
        }else{
          this.toastMessage = "Products are not available";
          this.$.toast.open();
        }
    }
    handleError(event){
        // this.$.getAllGroups.generateRequest();
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
      }
    static get template(){
        return html `
        ${sharedStyle}
            <h1>Product Details</h1>
            <h3>Group Name: {{groupName.0.name}}</h3>
            <h3 class="text-primary">Product Name: {{productDetails.name}}</h3>
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <app-route route="{{route}}" pattern="/:groupId/:productId" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <div class="col-sm-12 col-md-12">
                {{productDetails.name}}
                <h3>Other Products</h3>
                <ul style="list-unstyled">
                    <template is="dom-repeat" items="{{productGroups}}">
                        <li><a href="#/details/[[routeData.groupId]]/[[item.id]]">{{item.name}}</a></li>
                    </template>
                </ul>
            </div>
            <iron-ajax
                auto
                id="getAllGroups"
                url="[[detailsUrl]]/products/[[routeData.groupId]]"
                method="get"
                content-type="application/json"
                on-response="handleProductGroups"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}"
            >
            <iron-ajax
                auto
                url="[[detailsUrl]]/product/[[routeData.productId]]"
                method="get"
                content-type="application/json"
                on-response="handleResponse"
                on-error="handleError"
                handle-as="json"
                loading="{{loadingData}}"
                >
      </iron-ajax>
      <iron-ajax
            auto
            url="[[detailsUrl]]/groups"
            method="get"
            content-type="application/json"
            on-response="handleGroup"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
     
        `
    }
}

customElements.define('product-details', ProductDetails);