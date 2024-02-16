import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { KpiService } from 'app/services/kpi.service';
import { HttpBackendResponse } from 'app/model/http-backend-response';
import { KpiYear } from 'app/model/kpi-year';
import { KpiMonths } from 'app/model/kpi-months';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-kpi-batch-global',
  templateUrl: './kpi-batch-global.component.html',
  styleUrls: ['./kpi-batch-global.component.css']
})
export class KpiBatchGlobalComponent implements OnInit {
  
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
  public httpBackend:HttpBackendResponse;
  public kpiYear:KpiYear;
  public kpiMonth:KpiMonths;
  public httpResponse:HttpBackendResponse;
  public monthsFromYear=new Map<number, string>();
  seriesFromBackendReal:number[] =[];
  seriesFromBackendEstimado:number[] =[];

  constructor(private kpiBatchService:KpiService) {
    this.monthsFromYear.set(1,"enero");
    this.monthsFromYear.set(2,"febrero");
    this.monthsFromYear.set(3,"marzo");
    this.monthsFromYear.set(4,"abril");
    this.monthsFromYear.set(5,"mayo");
    this.monthsFromYear.set(6,"junio");
    this.monthsFromYear.set(7,"julio");
    this.monthsFromYear.set(8,"agosto");
    this.monthsFromYear.set(9,"septiembre");
    this.monthsFromYear.set(10,"octubre");
    this.monthsFromYear.set(11,"noviembre");
    this.monthsFromYear.set(12,"diciembre");
   }


  async ngOnInit() {

    this.getKpiCurrentDayData();
     /** Llamada al servicio de KPI Anual */
     this.httpResponse = await this.kpiBatchService.getCurrentDayKpi();
     this.kpiYear= this.httpResponse.response;
     this.kpiMonth = this.kpiYear[0];
     
     for (let m of this.monthsFromYear.values()){
       switch (m){
         case 'enero':
           this.kpiCUrrent = this.kpiMonth.enero;
           this.setSeriesPerMonth();
           break;
         case 'febrero':  
           this.kpiCUrrent = this.kpiMonth.febrero;
           this.setSeriesPerMonth();
           break;
         case 'marzo':
           this.kpiCUrrent = this.kpiMonth.marzo;
           this.setSeriesPerMonth();
           break;
         case 'abril':
           this.kpiCUrrent = this.kpiMonth.abril;
           this.setSeriesPerMonth();
           break;
         case 'mayo':
           this.kpiCUrrent = this.kpiMonth.mayo;
           this.setSeriesPerMonth();
           break;
         case 'junio':
           this.kpiCUrrent = this.kpiMonth.junio;
           this.setSeriesPerMonth();
           break;
         case 'julio':
           this.kpiCUrrent = this.kpiMonth.julio;
           this.setSeriesPerMonth();
           break;
         case 'agosto':
           this.kpiCUrrent = this.kpiMonth.agosto;
           this.setSeriesPerMonth();
           break;
         case 'septiembre':
           this.kpiCUrrent = this.kpiMonth.septiembre;
           this.setSeriesPerMonth();
           break;
         case 'octubre':
           this.kpiCUrrent = this.kpiMonth.octubre;
           this.setSeriesPerMonth();
           break;
         case 'noviembre':
           this.kpiCUrrent = this.kpiMonth.noviembre;
           this.setSeriesPerMonth();
           break;
         case 'diciembre':
           this.kpiCUrrent = this.kpiMonth.diciembre;
           this.setSeriesPerMonth();
           break;

       }

      }
    this.generateLineGraphic();    
    this.generateBarGraphic();
    this.generateTable();

   

  }

  
  public setSeriesPerMonth(){
    for (var i=0; i<this.kpiCUrrent.length; i++){
      if( i == this.kpiCUrrent.length-1){
          var realKpiValue = this.kpiCUrrent[i].kpi_online.hist_kpiReal*100;
          var estimatedKpiValue = this.kpiCUrrent[i].kpi_online.hist_kpiEstimado*100;
          
          this.seriesFromBackendReal.push(Math.round(realKpiValue*100)/100 != 0 ? Math.round(realKpiValue*100)/100 : null  );
          this.seriesFromBackendEstimado.push(Math.round(estimatedKpiValue*100)/100 != 0 ? Math.round(estimatedKpiValue*100)/100 : null ); 
      }
    }
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

  generateLineGraphic():void{
    this.hoursChartType = ChartType.Line;
    this.hoursChartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'],
      series: [
       this.seriesFromBackendReal,
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


  public async getKpiCurrentDayData(){
    try{
      this.httpBackend= await this.kpiBatchService.getCurrentDayKpi();
      this.kpiYear= this.httpBackend.response;
      this.kpiMonth= this.kpiYear[0];
      this.kpiCUrrent= this.kpiMonth.febrero;
      this.currentDayKpi = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_kpiReal*100;
      //Aproximación del KPI 
      this.currentDayKpi=Math.round(this.currentDayKpi*100)/100
      this.historicHostExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_EjecHost;
      this.historicEtherExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_EjecEther;
      this.dateKpi= this.kpiCUrrent[0].date;

    }catch(error){
      console.error(error);
    }
  }

}
