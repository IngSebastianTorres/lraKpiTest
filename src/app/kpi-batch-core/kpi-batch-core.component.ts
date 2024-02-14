import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { KpiService } from 'app/services/kpi.service';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-kpi-batch-core',
  templateUrl: './kpi-batch-core.component.html',
  styleUrls: ['./kpi-batch-core.component.css']
})
export class KpiBatchCoreComponent implements OnInit {

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

  public kpiCUrrent:KpiCurrentDay[]; 
  public currentDayKpi:number;
  public historicHostExecutions:number;
  public historicEtherExecutions:number;
  dateKpi:string;
  constructor(private kpiBatchService:KpiService) { }

  ngOnInit(): void {

    this.getKpiCurrentDayData();
    this.hoursChartType = ChartType.Line;
    this.hoursChartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'],
      series: [
        [45, 51, 50, 59, 47, 52, 50, 51, 55, 60, 53, 58],
        [55, 55, 55, 55, 57, 57, 57, 57, 57, 61, 52, 53],
       // [23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
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

  public async getKpiCurrentDayData(){
    try{
      
      this.kpiCUrrent=await this.kpiBatchService.getCurrentDayKpi();
      this.currentDayKpi = this.kpiCUrrent[0].kpi_core.hist_kpiReal*100;
      //Aproximación del KPI 
      this.currentDayKpi=Math.round(this.currentDayKpi*100)/100
      this.historicHostExecutions = this.kpiCUrrent[0].kpi_core.hist_EjecHost;
      this.historicEtherExecutions = this.kpiCUrrent[0].kpi_core.hist_EjecEther;
      this.dateKpi= this.kpiCUrrent[0].date;
    }catch(error){
      console.error(error);
    }
  }


}


