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
  public httpBackend:HttpBackendResponse;
  public kpiYear:KpiYear;
  public kpiMonth:KpiMonths;
  public monthsFromYear=new Map<number, string>();
  public KpiYearObject:KpiYear;
  seriesFromBackendReal:number[] =[];
  seriesFromBackendEstimado:number[] =[];
  public lastKpiExecutions: KpiCurrentDay[] =[];

  public httpResponse:HttpBackendResponse;

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
    
    this.httpResponse = await this.kpiBatchService.getCurrentDayKpi();
    this.KpiYearObject= this.httpResponse.response;
    this.kpiMonth = this.KpiYearObject[0];
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
          var realKpiValue = this.kpiCUrrent[i].kpi_core.hist_kpiReal*100;
          var estimatedKpiValue = this.kpiCUrrent[i].kpi_core.hist_kpiEstimado*100;
          this.seriesFromBackendReal.push(Math.round(realKpiValue*100)/100 != 0 ? Math.round(realKpiValue*100)/100 : null  );
          this.seriesFromBackendEstimado.push(Math.round(estimatedKpiValue*100)/100 != 0 ? Math.round(estimatedKpiValue*100)/100 : null   ); 
          //Llenado de series de grafica Barras
          this.kpiCUrrent[i].kpi_core.hist_kpiReal=this.kpiCUrrent[i].kpi_core.hist_kpiReal*100
          this.lastKpiExecutions.push(this.kpiCUrrent[i]);
      }else {
        this.kpiCUrrent[i].kpi_core.hist_kpiReal=this.kpiCUrrent[i].kpi_core.hist_kpiReal*100
        this.lastKpiExecutions.push(this.kpiCUrrent[i]);
      }
    }
  }


  generateTable():void{
    this.tableData2 = {
      headerRow: [ 'Fecha', 'KPI Real' ],
      dataRows: [
        [this.lastKpiExecutions[this.lastKpiExecutions.length-7].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-6].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-5].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-4].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-3].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-2].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_core.hist_kpiReal*100)/100).toString()],
        [this.lastKpiExecutions[this.lastKpiExecutions.length-1].date,  (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_core.hist_kpiReal*100)/100).toString()]  
      ]
    };
  }

  generateBarGraphic():void{
    this.kpiLastDaysCharType = ChartType.Bar;
    this.kpiLastDaysCharData = {
      labels:  [ this.lastKpiExecutions[this.lastKpiExecutions.length-7].date,  this.lastKpiExecutions[this.lastKpiExecutions.length-6].date,  this.lastKpiExecutions[this.lastKpiExecutions.length-5].date,  
      this.lastKpiExecutions[this.lastKpiExecutions.length-4].date,  this.lastKpiExecutions[this.lastKpiExecutions.length-3].date,
      this.lastKpiExecutions[this.lastKpiExecutions.length-2].date, this.lastKpiExecutions[this.lastKpiExecutions.length-1].date],
      series: [
        [Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_core.hist_kpiReal*100)/100, 
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_core.hist_kpiReal*100)/100,
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_core.hist_kpiReal*100)/100,  
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_core.hist_kpiReal*100)/100,  
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_core.hist_kpiReal*100)/100, 
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_core.hist_kpiReal*100)/100,  
        Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_core.hist_kpiReal*100)/100]
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
  }


  public async getKpiCurrentDayData(){
    try{
      this.httpBackend= await this.kpiBatchService.getCurrentDayKpi();
      this.kpiYear= this.httpBackend.response;
      this.kpiCUrrent = this.kpiYear[0];
      this.kpiMonth= this.kpiYear[0];
      this.kpiCUrrent= this.kpiMonth.febrero;
      
      this.currentDayKpi = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_kpiReal*100;
      //Aproximación del KPI 
      this.currentDayKpi=Math.round(this.currentDayKpi*100)/100
      //Se trae valor de ultima posición entendiendo que sera el mas reciente calculado
      this.historicHostExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_EjecHost;
      this.historicEtherExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_EjecEther;
      this.dateKpi= this.kpiCUrrent[this.kpiCUrrent.length-1].date;
    }catch(error){
      console.error(error);
    }
  }


}


