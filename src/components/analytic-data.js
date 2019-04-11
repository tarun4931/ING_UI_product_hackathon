import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import * as d3 from 'd3';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import { sharedStyle } from '../shared-style/shared-style.js';
class AnalyticData extends PolymerElement{
  static get properties(){
    return {
      analyticsData:{
        type: Array,
        value: []
      },
      loadingData:{
        type: Boolean,
        value: true
      },
      toastMessage:{
        type: String
      }
    }
  }
  static get template(){
    return html `
      ${sharedStyle}
      <style>
      .line {
          fill: none;
          stroke: #ffab00;
          stroke-width: 3;
      }

      .overlay {
        fill: none;
        pointer-events: all;
      }

      /* Style the dots by assigning a fill and stroke */
      .dot {
          fill: #ffab00;
          stroke: #fff;
      }

        .focus circle {
        fill: none;
        stroke: steelblue;
      }
      </style>
      <h1>Analytics Data</h1>
      <div class="col-sm-12 d-flex justify-content-center align-content-center">
        <paper-spinner active="{{loadingData}}"></paper-spinner>
      </div>
      <svg id="lineChart" width="300" height="200"> </svg>
      <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
      <iron-ajax
            auto
            url="http://localhost:3000/stocks"
            method="get"
            on-response="handleResponse"
            on-error="handleError"
            content-type="application/json"
            handle-as="json"
            loading="{{loadingData}}"></iron-ajax>
    `;
  }
  handleResponse(event){
    if(event.detail.response){
      this.analyticsData = event.detail.response;
      let data = this.analyticsData.map((stock) => {
        return{
          name: stock.timestamp,
          volume: stock.volume
        }
      })
      this.drawLineChart(data);
    }
  }
  handleError(event){
    if(event){
      this.toastMessage = "Unable to process the request";
      this.$.toast.open();
    }
  }

  drawLineChart(data){
    console.log(data);

    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select(this.$.lineChart).attr("width", svgWidth).attr("height", svgHeight);
    var g = svg.append("g")
               .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")"
               );
    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var line = d3.line()
                 .x(function(d) { return x(d.name)})
                 .y(function(d) { return y(d.volume)})
                 x.domain(d3.extent(data, function(d) { return d.name }));
                 y.domain(d3.extent(data, function(d) { return d.volume }));
     g.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
              .select(".domain")
              .remove();
    g.append("g")
             .call(d3.axisLeft(y))
             .append("text")
             .attr("fill", "#000")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", "0.71em")
             .attr("text-anchor", "end")
             .text("Volume");
    g.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-linejoin", "round")
           .attr("stroke-linecap", "round")
           .attr("stroke-width", 1.5)
           .attr("d", line);
  }
}

customElements.define('analytic-data', AnalyticData);
