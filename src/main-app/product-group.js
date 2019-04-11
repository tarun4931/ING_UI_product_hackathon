import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../components/grid-component.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '../shared-style/shared-style.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/paper-dialog/paper-dialog.js';
import * as d3 from 'd3';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
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
            },
            selectedProduct:{
              type: String,
              value: '0',
              observe: '_productChanged'
            }
        }
    }
    _productChanged(newVal, oldVal){
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
      monitorView(){
        var data = [{'year':2014, 'value':45}, {'year':2015, 'value':50}, {'year':2016, 'value':80}];
        //this.getCharts(data);
        this.$.getAnalytics.generateRequest();
      }
      closeDialog(){
        this.$.dialog.close()
      }

      getCharts(data){
        var svg = d3.select(this.$.mySVG),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin
        svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("Product Group Details")

    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");  
        xScale.domain(data.map(function(d) { return d.name; }));
        yScale.domain([0, d3.max(data, function(d) { return d.count; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Product");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return  + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Viewd Count");

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.name); })
         .attr("y", function(d) { return yScale(d.count); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.count); });
      }
      handleAnalytics(event){
        if(event.detail.response.length > 0){
          let data = event.detail.response.map((obj) => {
            return {
              'name': obj.name,
              'count': obj.count
            }
          });
          this.$.dialog.open();
          this.getCharts(data);
        }else{
          this.toastMessage = 'No Data to display';
          this.$.toast.open();
        }
      }

    static get template(){
        return html `
        ${sharedStyle}
            <h1>Product group </h1>
            <paper-dialog id="dialog">
              <h2>Content</h2>
              <paper-dropdown-menu label="Dinosaurs">
                <paper-listbox slot="dropdown-content" attr-for-selected="name" class="dropdown-content" selected="{{selectedProduct}}">
                  <template is="dom-repeat" items="{{allProducts}}">
                  <paper-item name="{{item.name}}">{{item.name}}</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <div>
                <svg id="mySVG" width="600" height="500"></svg>              
              </div>
              <button class="btn btn-primary" on-click="closeDialog">close</button>
          </paper-dialog>
            <paper-toast id="toast" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            <div class="col-sm-12 d-flex justify-content-center align-content-center">
                <paper-spinner active="{{loadingData}}"></paper-spinner>
            </div>
            <button class="btn btn-primary" on-click="monitorView">Monitor View statistics</button>
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
      <iron-ajax
            id="getAnalytics"
            url="[[productsURL]]/count/1"
            method="get"
            content-type="application/json"
            on-response="handleAnalytics"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
        `;
    }

    
}

customElements.define('product-group', ProductGroup);