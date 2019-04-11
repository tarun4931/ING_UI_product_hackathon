import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
class ReviewComponent extends PolymerElement{
  static get properties(){
    return {
      id:{
        type: Object
      },
      route:{
        type: Object
      },
      data:{
        type: Object,
        value: {}
      }
    }
  }
  static get template(){
    return html `
      <h1>Review</h1>
      <app-route route="{{route}}" pattern="/:id" data="{{routeData}}" tail="{{subroute}}"></app-route>
      <div class="col-sm-12 d-flex justify-content-center align-content-center">
        <paper-spinner active="{{loadingData}}"></paper-spinner>
      </div>
      <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
      <iron-ajax
              auto
              url="https://jsonplaceholder.typicode.com/posts/[[routeData.id]]"
              method="GET"
              on-response="handleResponse"
              on-error="handleError"
              handle-as="json"
              content-type="application/json"
              loading="{{loadingData}}"></iron-ajax>
      [[data.title]]
    `;
  }

  handleResponse(event){
    if(event.detail.response){
      this.set('data', event.detail.response);
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
}

customElements.define('review-comp', ReviewComponent);
