import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { KpiService } from 'app/services/kpi.service';
import { KpiCurrentDay } from 'app/model/kpi-current-day';


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

    /** Variables Current day KPI ONLINE */
    public currentDayKpi:number;
    public historicHostExecutions:number;
    public historicEtherExecutions:number;

    public kpiCUrrent:KpiCurrentDay[]; 
    public kpiYear:any[]; 
    seriesFromBackendReal:number[] =[];
    seriesFromBackendEstimado:number[] =[];
    dateKpi:string;

  constructor(private kpiOnlineService:KpiService) { 
    
  }

  async ngOnInit() {
      this.getKpiCurrentDayData();
      
      /** Llamada al servicio de KPI Anual */
      this.kpiYear= await this.kpiOnlineService.getKpiYear();
        for (var i=0; i<this.kpiYear.length; i++){
          this.seriesFromBackendReal.push(this.kpiYear[i].kpireal);
          this.seriesFromBackendEstimado.push(this.kpiYear[i].kpiestimado );
        }
      this.generateLineGraphic();  
      this.generateBarGraphic();
      this.generateTable();
    }


    public async getKpiCurrentDayData(){
      try{
        this.kpiCUrrent=await this.kpiOnlineService.getCurrentDayKpi();
        this.currentDayKpi = this.kpiCUrrent[0].kpi_online.hist_kpiReal*100;
        //Aproximación del KPI 
        this.currentDayKpi=Math.round(this.currentDayKpi*100)/100
        this.historicHostExecutions = this.kpiCUrrent[0].kpi_online.hist_EjecHost;
        this.historicEtherExecutions = this.kpiCUrrent[0].kpi_online.hist_EjecEther;
        this.dateKpi= this.kpiCUrrent[0].date;
        console.log(this.kpiCUrrent);
      }catch(error){
        console.error(error);
      }
    }


     generateLineGraphic():void{
      this.hoursChartType = ChartType.Line;
      
      this.hoursChartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'],
        series: [
          this.seriesFromBackendReal, // real
          this.seriesFromBackendEstimado
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
    }

    generateBarGraphic():void{
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
    }

    generateTable():void{
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
