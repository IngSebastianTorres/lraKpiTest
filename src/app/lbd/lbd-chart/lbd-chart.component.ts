import {Component, Input, OnInit, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import * as Chartist from 'chartist';

export interface LegendItem {
  title: string;
  imageClass: string;
}

export enum ChartType {
  Pie,
  Line,
  Bar
}

@Component({
  selector: 'lbd-chart',
  templateUrl: './lbd-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LbdChartComponent implements OnInit, AfterViewInit {
  static currentId = 1;

  @Input()
  public title: string;

  @Input()
  public subtitle: string;

  @Input()
  public chartClass: string;

  @Input()
  public chartType: ChartType;

  @Input()
  public chartData: any;

  @Input()
  public chartOptions: any;

  @Input()
  public chartResponsive: any[];

  @Input()
  public footerIconClass: string;

  @Input()
  public footerText: string;

  @Input()
  public legendItems: LegendItem[];

  @Input()
  public withHr: boolean;

  public chartId: string;

  constructor() {
  }

  public ngOnInit(): void {
    this.chartId = `lbd-chart-${LbdChartComponent.currentId++}`;
  }

  public ngAfterViewInit(): void {

    switch (this.chartType) {
      case ChartType.Pie:
        new Chartist.Pie(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive);
        break;

      case ChartType.Line:
        var series = this.chartData.series;
        var idLine=0;
        var idArea=0;
        new Chartist.Line(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive).on("draw", function(data) {
          if (data.type === "point") {
        
            var title = "";
            for (var i = 2; i >= 0; i--)
              if (i == 1) 
                title += "<br>KPI Estimado "  + ": " + series[i][data.index] +"<div style='background-color:red'></div>";
              else if (i==2)
                title += "KPI Real " + ": " + series[i][data.index];
              else if (i==0)
              //Pendiente dejar año dinamico
                title += "<br>KPI Real año 2023 " + ": " + series[i][data.index];
                title += "<br>"
            data.element._node.setAttribute("title", title);
            data.element._node.setAttribute("data-chart-tooltip", "chartLine");
            
            // optional grid highlight
            var grid = document.querySelector<HTMLElement>("#chartLine .ct-horizontal:nth-child(" + (data.index + 1) + ")");
            data.element._node.addEventListener("mouseenter", function(event) {
              var tooltip=document.getElementsByClassName('tooltip fade top').item(0) as HTMLElement;
              tooltip.style.opacity="0.6";
              tooltip.style.marginLeft="5.2%";
              tooltip.style.marginTop="2.2%";
              var tooltipArroy=tooltip.childNodes.item(0) as HTMLElement;
              tooltipArroy.style.display="none";
           
              
              
              grid.style.stroke = "rgba(0,0,255,.6)";
              
              var pointsC= document.getElementsByClassName('ct-series ct-series-a').item(0) as HTMLElement ;
              pointsC.style.display="block";

              var line = document.querySelector<HTMLElement>("#lineCustomChart0")
              line.style.strokeDasharray="6";
              line.style.stroke="#FFA534";
              line.style.display="block";

              var area = document.querySelector<HTMLElement>("#areaCustom0");
              area.style.opacity="0.5";
              area.style.fill="#FFA534"
              area.style.display="block";
            })
            data.element._node.addEventListener("mouseleave", function(event) {
              grid.style.stroke = "rgba(0,0,0,.2)";

              var pointsA= document.getElementsByClassName('ct-series ct-series-a').item(0) as HTMLElement ;
              pointsA.style.display="none";
              var line = document.querySelector<HTMLElement>("#lineCustomChart0")
              line.style.strokeDasharray="6";
              line.style.display="none";

              var area = document.querySelector<HTMLElement>("#areaCustom0");
              area.style.opacity="0.5";
              area.style.display="none";
            });
            
          } else if(data.type === "line"){
            data.element._node.id="lineCustomChart"+idLine;
            if(idLine==0){
              var line = document.querySelector<HTMLElement>("#lineCustomChart0")
              line.style.strokeDasharray="6";
              line.style.display="none";
            } else if(idLine==2){
              var line = document.querySelector<HTMLElement>("#lineCustomChart2")
              line.style.stroke="#2DCCCD";
            }
            idLine++;
            
          } else if (data.type=== "area"){
            data.element._node.id="areaCustom"+idArea;
            if(idArea==0){
              var area = document.querySelector<HTMLElement>("#areaCustom0");
              area.style.display="none";
            }
            if(idArea==1){
              var area = document.querySelector<HTMLElement>("#areaCustom1");
              area.style.display="none";
            }
            if(idArea==2){
              var area = document.querySelector<HTMLElement>("#areaCustom2")
              area.style.display="none";
            }
            idArea++;
          }
          var pointsC= document.getElementsByClassName('ct-series ct-series-c');
          if(pointsC!=null && pointsC.length>=1){
              switch (pointsC.item(0).childNodes.length){
                  case 1:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 2:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 3:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 4:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 5:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 6:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 7:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 8:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 9:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 10:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 11:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement;
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
                  case 12:
                    var childNodesFromElement= pointsC.item(0) as HTMLElement; 
                    for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                      var pointC =childNodesFromElement.childNodes[i] as HTMLElement;
                      pointC.style.stroke="#2DCCCD"
                    }
                  break;
               }
          }  
          var pointsA= document.getElementsByClassName('ct-series ct-series-a');
          if(pointsA!=null && pointsA.length>=1){
            if(pointsA.item(0).childNodes.length==12){
              var childNodesFromElement= pointsA.item(0) as HTMLElement;
              childNodesFromElement.style.display="none";
              for (let i=0; i<childNodesFromElement.childNodes.length; i++){
                var pointA =childNodesFromElement.childNodes[i] as HTMLElement;
                pointA.style.stroke="#FFA534"
              }
             
            } 
          }

    
        }).on("created", function() {
          // Initiate Tooltip
          // CAST TO JQUERY ON JAVASCRIPT
          ($("#chartLine") as any).tooltip({
            selector: '[data-chart-tooltip="chartLine"]',
            container: "body",
            html: true
          });
          cleanIds();
        })
        
        function cleanIds(){
          idArea=0;
          idLine=0;
        }
        break;
        
      case ChartType.Bar:
        
        var series = this.chartData.series;
        new Chartist.Bar(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive).on("draw", function(data) {
          if (data.type === "bar") {
            var title = "";
            for (var i = 0; i < series.length; i++)
              if (i > 0) 
                title += "<br>KPI Estimado "  + ": " + series[i][data.index];
              else 
                title += "KPI Real " + ": " + series[i][data.index];
           
            data.element._node.setAttribute("title", title);
            data.element._node.setAttribute("data-chart-tooltip", "chartBar");
          }
        }).on("created", function() {
          // Initiate Tooltip
          // CAST TO JQUERY ON JAVASCRIPT
          ($("#chartBar") as any).tooltip({
            selector: '[data-chart-tooltip="chartBar"]',
            container: "body",
            html: true
          });
        });
        break;
    }
  }
}
