import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { SecurityTokenService } from 'app/services/security-token.service';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { KpiService } from 'app/services/kpi.service';
import { KpiYear } from 'app/model/kpi-year';
import { KpiMonths } from 'app/model/kpi-months';
import { HttpBackendResponse } from 'app/model/http-backend-response';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-kpi-batch-general-summary',
  templateUrl: './kpi-batch-general-summary.component.html',
  styleUrls: ['./kpi-batch-general-summary.component.css']
})
export class KpiBatchGeneralSummaryComponent implements OnInit {

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
  public tableKpiOnline: TableData;
  public tableKpiCore: TableData;
  public tableKpiGlobal: TableData;
  public lastKpiExecutions: KpiCurrentDay[] =[];
  public kpiYear:KpiYear;
  public kpiMonth:KpiMonths;
  public httpResponse:HttpBackendResponse;
  public monthsFromYear=new Map<number, string>();
  public kpiCUrrent:KpiCurrentDay[]; 
  dateKpi:string;
  public httpBackendResponse:HttpBackendResponse;
  public realKpiOnline:number;
  public realKpiGlobal:number;
  public realKpiBatch:number;
  public estimatedKpiOnline:number;
  public estimatedKpiGlobal:number;
  public estimatedKpiBatch:number;
  public historicHostExecutions:number;
  public historicEtherExecutions:number;
  public currentDate = new Date();

  constructor(private securityToken:SecurityTokenService, private kpiService:KpiService) { 
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

  public async getKpiCurrentDayData(){
   
    try{
      this.httpBackendResponse= await this.kpiService.getCurrentDayKpi();
      this.kpiYear= this.httpBackendResponse.response;
      this.kpiMonth= this.kpiYear[0];
      this.setCurrentMonth();
      this.realKpiOnline = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_online.hist_kpiReal*100;
      this.realKpiGlobal = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_kpiReal*100;
      this.realKpiBatch = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_kpiReal*100;

      this.estimatedKpiOnline = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_online.hist_kpiEstimado*100;
      this.estimatedKpiGlobal = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_kpiEstimado*100;
      this.estimatedKpiBatch = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_kpiEstimado*100;

      //Aproximación del KPI 
      this.realKpiOnline=Math.round(this.realKpiOnline*100)/100
      this.realKpiGlobal=Math.round(this.realKpiGlobal*100)/100
      this.realKpiBatch=Math.round(this.realKpiBatch*100)/100

      this.estimatedKpiOnline=Math.round(this.estimatedKpiOnline*100)/100
      this.estimatedKpiGlobal=Math.round(this.estimatedKpiGlobal*100)/100
      this.estimatedKpiBatch=Math.round(this.estimatedKpiBatch*100)/100


      this.historicHostExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_EjecHost;
      this.historicEtherExecutions = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_global.hist_EjecEther;
      this.dateKpi= this.kpiCUrrent[this.kpiCUrrent.length-1].date;

    }catch(error){
      console.error(error);
    }
  }

  async generateTokenToServices(){
    var email = {email:'juancarlos.coronado@bbva.com'}
    try {
        let response = await this.securityToken.generateToken(email);
        localStorage.setItem('tokenServices',response.token);
        console.log(response);
    }catch (err){
        console.log(err);
    }
  }

  public setCurrentMonth(){
    
    let month = this.currentDate.getMonth();
    
    switch (month){
      case 0:
        this.kpiCUrrent= this.kpiMonth.enero;
        break;
      case 1:
        this.kpiCUrrent=this.kpiMonth.febrero;
        break;
      case 2:
        this.kpiCUrrent=this.kpiMonth.marzo;
        break;
      case 3:
        this.kpiCUrrent=this.kpiMonth.abril;
        break;
      case 4:
        this.kpiCUrrent=this.kpiMonth.mayo;
        break;
      case 5:
        this.kpiCUrrent=this.kpiMonth.junio;
        break;
      case 6:
        this.kpiCUrrent=this.kpiMonth.julio;
        break;
      case 7:
        this.kpiCUrrent=this.kpiMonth.agosto;
        break;
      case 8:
        this.kpiCUrrent=this.kpiMonth.septiembre;
        break;
      case 9:
        this.kpiCUrrent=this.kpiMonth.octubre;
        break;
      case 10:
        this.kpiCUrrent=this.kpiMonth.noviembre;
        break;
      case 11: 
        this.kpiCUrrent=this.kpiMonth.diciembre;
    }
    
  }

  async ngOnInit() {
    this.getKpiCurrentDayData();
    this.generateTokenToServices();
    this.httpResponse = await this.kpiService.getCurrentDayKpi();
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
     
    this.generateTables();
   
  }

  public setSeriesPerMonth(){
    for (var i=0; i<this.kpiCUrrent.length; i++){
        //Llenado de valores para tablas
        this.kpiCUrrent[i].kpi_online.hist_kpiReal=this.kpiCUrrent[i].kpi_online.hist_kpiReal*100
        this.kpiCUrrent[i].kpi_core.hist_kpiReal=this.kpiCUrrent[i].kpi_core.hist_kpiReal*100
        this.kpiCUrrent[i].kpi_global.hist_kpiReal=this.kpiCUrrent[i].kpi_global.hist_kpiReal*100
        this.lastKpiExecutions.push(this.kpiCUrrent[i]);    

    }
  }

  generateTables():void{
  this.tableKpiOnline = {
    headerRow: [ 'Fecha', 'KPI' ],
    dataRows: [
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-6].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-5].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-4].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-3].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-2].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_online.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-1].date,  (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_online.hist_kpiReal*100)/100).toString()]
        
    ]
  };

  this.tableKpiCore = {
    headerRow: [ 'Fecha', 'KPI' ],
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
  
  this.tableKpiGlobal = {
    headerRow: [ 'Fecha', 'KPI' ],
    dataRows: [
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-6].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-5].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-4].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-3].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-2].date, (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_global.hist_kpiReal*100)/100).toString()],
      [this.lastKpiExecutions[this.lastKpiExecutions.length-1].date,  (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_global.hist_kpiReal*100)/100).toString()]
        
    ]
  }
}


}
