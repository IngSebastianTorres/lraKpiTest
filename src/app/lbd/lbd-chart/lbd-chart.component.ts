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
        new Chartist.Line(`#${this.chartId}`, this.chartData, this.chartOptions, this.chartResponsive).on("draw", function(data) {
          if (data.type === "point") {
            var title = "";
            for (var i = 0; i < series.length; i++)
              if (i > 0) 
                title += "<br>KPI Estimado "  + ": " + series[i][data.index];
              else 
                title += "KPI Real " + ": " + series[i][data.index];
           
            data.element._node.setAttribute("title", title);
            data.element._node.setAttribute("data-chart-tooltip", "chartLine");
            
            // optional grid highlight
            var grid = document.querySelector<HTMLElement>("#chartLine .ct-horizontal:nth-child(" + (data.index + 1) + ")");
            data.element._node.addEventListener("mouseenter", function(event) {
              grid.style.stroke = "rgba(0,0,255,.6)";
            })
            data.element._node.addEventListener("mouseleave", function(event) {
              grid.style.stroke = "rgba(0,0,0,.2)";
            });
          }
        }).on("created", function() {
          // Initiate Tooltip
          // CAST TO JQUERY ON JAVASCRIPT
          ($("#chartLine") as any).tooltip({
            selector: '[data-chart-tooltip="chartLine"]',
            container: "body",
            html: true
          });
        });
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
