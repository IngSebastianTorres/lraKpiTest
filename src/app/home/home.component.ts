import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public emailChartType: ChartType;
    public emailChartData: any;
    public emailChartLegendItems: LegendItem[];

    public hoursChartType: ChartType;
    public hoursChartData: any;
    public hoursChartOptions: any;
    public hoursChartResponsive: any[];
    public hoursChartLegendItems: LegendItem[];

    public kpiLastDaysCharType: ChartType;
    public kpiLastDaysCharData: any;
    public kpiLastDaysCharOptions: any;
    public kpiLastDaysCharResponsive: any[];
    public kpiLastDaysCharLegendItems: LegendItem[];
    public tableData2: TableData;
  constructor() { }

  ngOnInit() {
      this.emailChartType = ChartType.Pie;
      this.emailChartData = {
        labels: ['62%', '32%', '6%'],
        series: [62, 32, 6]
      };
      this.emailChartLegendItems = [
        { title: 'Open', imageClass: 'fa fa-circle text-info' },
        { title: 'Bounce', imageClass: 'fa fa-circle text-danger' },
        { title: 'Unsubscribe', imageClass: 'fa fa-circle text-warning' }
      ];

      this.hoursChartType = ChartType.Line;
      this.hoursChartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'],
        series: [
          [50, 57, 60, 54, 49, 55, 53, 58, 53, 60,49,55],
          [50, 57, 60, 49, 45, 57, 52, 59.3, 53, 55,59,55]
        ]
      };
      this.hoursChartOptions = {
        low: 0,
        high: 60,
        showArea: false,
        height: '245px',
        axisX: {
          showGrid: true,
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 3
        }),
        showLine: true,
        showPoint: true
      };
      this.hoursChartResponsive = [
        ['screen and (max-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.hoursChartLegendItems = [
        { title: 'KPI REAL', imageClass: 'fa fa-circle text-info' },
        { title: 'KPI ESTIMADO', imageClass: 'fa fa-circle text-danger' }
      ];

      this.kpiLastDaysCharType = ChartType.Bar;
      this.kpiLastDaysCharData = {
        labels: ['12-01-2024', '13-01-2024', '14-01-2024', '15-01-2024', '16-01-2024','17-01-2024', '18-01-2024'],
        series: [
          [55.0, 56.2, 51.2, 49.8, 52.7, 54.2, 55.7]
        ]
      };
      this.kpiLastDaysCharOptions = {
        low:0,
        high:60,
        showArea: false,
        height: '230px',
        seriesBarDistance: 10,
        axisX: {
          showGrid: false
        }
      };
      this.kpiLastDaysCharResponsive = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.kpiLastDaysCharLegendItems = [
        { title: 'KPI Online Real', imageClass: 'fa fa-circle text-info' },        
      ];


      this.tableData2 = {
        headerRow: [ 'Fecha', 'KPI Real' ],
        dataRows: [
            ['12-01-2024', '55.0'],
            ['13-01-2024', '56.2'],
            ['14-01-2024', '51.2'],
            ['15-01-2024', '49.8'],
            ['16-01-2024', '52.7' ],
            ['17-01-2024', '54.2'],
            ['18-01-2024', '55.7' ]
            
        ]
    };

    }

}
