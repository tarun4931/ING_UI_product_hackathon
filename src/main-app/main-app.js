import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/iron-image/iron-image.js';
import '../components/analytic-data.js';

/**
 * @customElement
 * @polymer
 */
class MainApp extends PolymerElement {
  constructor(){
    super();
    this.limit = 5;
    this.url= "https://jsonplaceholder.typicode.com/posts";
    this.method = "GET";
    this.pagination = true;
  }
  static get template() {
    return html`
    <style>
    :host {
--paper-font-common-base: {
font-family: Raleway, sans-serif;
};
    }
    iron-image {
        width: 153px;
        height: 153px;
        margin-left: 20%;
    }
    paper-item {
height: 54px;
    }
    paper-item > a {
width: 100%;
height: 100%;
line-height: 54px;
text-align: center;
text-decoration: none;
color: black;
    }
    paper-icon-button {
        color: white;
    }
app-toolbar {
background-color: #ff6200;
color: black;
}
paper-progress {
display: block;
width: 100%;
--paper-progress-active-color: rgba(255, 255, 255, 0.5);
--paper-progress-container-color: transparent;
}
app-header {
@apply(--layout-fixed-top);
color: #ff6200;
--app-header-background-rear-layer: {
  background-color: green;
};
        }
        paper-icon-button + [main-title] {
            margin-left: 18%;
            font-family:var(--lumo-font-family);
            color:white;
        }
</style>
<app-location use-hash-as-path route="{{route}}"></app-location>
<app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
<app-toolbar>
  <paper-icon-button on-click="_toggleDrawer" aria-label="Icon Button" icon="menu"></paper-icon-button>
  <div main-title>ING Products</div>
</app-toolbar>
<app-drawer-layout has-scrolling-region responsive-width="940px">
    <app-drawer swipe-open slot="drawer">
        <app-header-layout has-scrolling-region>
           <!-- <iron-image sizing="cover" preload src="../images/ING_logo.png"></iron-image>
            -->
        </<app-header-layout>
    </app-drawer>
    <!-- <analytic-data></analytic-data> -->
    <iron-pages selected="[[page]]" attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
      <product-group name="products"></product-group>
      <product-details name="details"></product-group>
    </iron-pages>
</app-drawer-layout>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'main-app'
      },
      page:{
        type: String,
        observer:'_pageChanged'
      }
    };
  }
  static get observers() {
    return ['_routeChanged(routeData.page)']
}

_routeChanged(page) {
    this.page = page || 'products';
}

_pageChanged(currentPage, oldPage) {
switch (currentPage) {
  case 'products':
      import('./product-group.js');
      break;
  case 'products':
      import('./product-details.js');
      break;
  default:
      this.page = 'products';
    }
}
  _toggleDrawer() {
    var drawer = this.shadowRoot.querySelector('app-drawer');
    drawer.toggle();
  }
}

window.customElements.define('main-app', MainApp);
