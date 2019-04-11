import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
class GridComponent extends PolymerElement{

  connectedCallback(){
    super.connectedCallback();
  }

  static get properties(){
    return {
      users:{
        type: Array,
        value: []
      },
      allUsers:{
        type: Array,
        value:[]
      },
      pages:{
        type: Array,
        value: []
      },
      loadingData:{
        type: Boolean,
        value: true
      },
      toastMessage:{
        type: String
      },
      pagination:{
        type: Boolean
      }
    }
  }

  static get template(){
    return html `
    ${sharedStyle}
      <style>
        :host{
          color: var(--myColor);
        }

      </style>
      <div class="container mt-4">

        <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
        <template is="dom-if" if="[[!loadingData]]">
          <div class="col-sm-12 col-md-12 col-xs-12 border">
          [[allUsers.length]]
          <vaadin-accordion>
            <template is="dom-repeat" items="[[allUsers]]" as="product">
                <vaadin-accordion-panel>
                  <div slot="summary">[[product.name]]</div>
                  <vaadin-vertical-layout>
                    <div class="col-sm-12">
                        Body  
                    </div>
                  </vaadin-vertical-layout>
                </vaadin-accordion-panel>
              </template>
            </vaadin-accordion>
          </div>
          <template is="dom-if" if="[[pagination]]">
            <ul class="list-group list-group-horizontal d-flex justify-content-center mt-2">
              <template is="dom-repeat" items={{pages}}>
                <li class="list-group-item"> <a href="javascript:void(0);" on-click="paginateMe">{{item}}</a></li>
              </template>
            </ul>
          </template>
        </template>
        <div class="col-sm-12 d-flex justify-content-center align-content-center">
          <paper-spinner active="{{loadingData}}"></paper-spinner>
        </div>
      </div>
      <iron-ajax
            auto
            url="[[url]]"
            method="[[method]]"
            content-type="application/json"
            on-response="handleResponse"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
    `
  }
  handleResponse(event){
    console.log(event.detail.response);
    if(event.detail.response.length>0){
      console.log('IN ');
      this.set('allUsers',event.detail.response);
      if(this.pagination){
        this.paginate(this.allUsers.length, this.limit);
      }
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
  paginateMe(event){
    let index = event ? event.model.index : 0;
    let myUsers = [];
    let start = index * this.limit;
    for(let i=start; i<(this.limit+start); i++){
      myUsers.push(this.users[i]);
    }
    this.set('allUsers', myUsers);
  }

  clickMe(event){
    event.model.set('user.id', event.model.user.id+1)
  }


  paginate(length, limit){
    let totalPages = length/limit;
    let j = 0;
    let myPages = [];
    for(let i=0; i<totalPages; i++){
        myPages.push(i+1);
    }
    this.set('pages', myPages);
    this.paginateMe();
  }

}
customElements.define('grid-component', GridComponent);
