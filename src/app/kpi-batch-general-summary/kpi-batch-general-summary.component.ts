import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { SecurityTokenService } from 'app/services/security-token.service';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { KpiService } from 'app/services/kpi.service';
import { KpiMonthFromYear } from 'app/model/kpi-month-from-year';
import { KpiMonths } from 'app/model/kpi-months';
import { HttpBackendResponse } from 'app/model/http-backend-response';
import { KpiYear } from 'app/model/kpi-year';
import { kpis } from 'app/model/kpis';
import { KpiCore } from 'app/model/kpi-core';
import {  KpiGlobal } from 'app/model/kpi-global';
import { KpiOnline } from 'app/model/kpi-online';

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
  public kpiYear:KpiMonthFromYear;
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
  public kpiYearModel:KpiYear;
  public kpis:kpis;

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
      this.kpis= this.httpBackendResponse.response;

      //Establecer año actual
      this.setCurrentYear();
      this.kpiMonth=this.kpiYearModel.kpi_annual;

      //Establecer el mes actual
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



  public setCurrentYear(){
    let year = this.currentDate.getFullYear();
    for (let j=0; j<this.kpis.data.length; j++){
      if(this.kpis.data[j].year==year){
        this.kpiYearModel = this.kpis.data[j];    
      }
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
    
    this.httpResponse = await this.kpiService.getCurrentDayKpi();
    this.kpis= this.httpBackendResponse.response;
    this.setCurrentYear();
    this.kpiMonth = this.kpiYearModel.kpi_annual;
    
    switch (this.currentDate.getMonth()){
      case 1:
        this.setSeriesPerMonth(this.kpiMonth.enero,null);
        break;
      case 2:  
        this.setSeriesPerMonth(this.kpiMonth.febrero,this.kpiMonth.enero);
        break;
      case 3:
        this.setSeriesPerMonth(this.kpiMonth.marzo,this.kpiMonth.febrero);
        break;
      case 4:
        this.setSeriesPerMonth(this.kpiMonth.abril,this.kpiMonth.marzo);
        break;
      case 5:
        this.setSeriesPerMonth(this.kpiMonth.mayo,this.kpiMonth.abril);
        break;
      case 6:
        this.setSeriesPerMonth(this.kpiMonth.junio,this.kpiMonth.mayo);
        break;
      case 7:
        this.setSeriesPerMonth(this.kpiMonth.julio,this.kpiMonth.junio);
        break;
      case 8:
        this.setSeriesPerMonth(this.kpiMonth.agosto,this.kpiMonth.julio);
        break;
      case 9:
        this.setSeriesPerMonth(this.kpiMonth.septiembre,this.kpiMonth.agosto);
        break;
      case 10:
        this.setSeriesPerMonth(this.kpiMonth.octubre,this.kpiMonth.septiembre);
        break;
      case 11:
        this.setSeriesPerMonth(this.kpiMonth.noviembre,this.kpiMonth.octubre);
        break;
      case 12:
        this.setSeriesPerMonth(this.kpiMonth.diciembre,this.kpiMonth.noviembre);
        break;
    }
    
     
    this.generateTables();
   
  }

  public setSeriesPerMonth(kpiCurrentMonth:KpiCurrentDay[], kpiLastMonth:KpiCurrentDay[]){
    console.log("month ",this.currentDate.getMonth());
    if(kpiCurrentMonth!=null ){
      // Diferenciación del mes de enero para aplicar logica de ultimos 7 dias del KPI Real
      if(this.currentDate.getMonth()!=1){
        if(kpiCurrentMonth.length<=7){
          if(kpiCurrentMonth.length==7){
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
            
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            }
            this.lastKpiExecutions.reverse();
          } else if(kpiCurrentMonth.length==6){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
            
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            }
            this.lastKpiExecutions.reverse();
          } else if(kpiCurrentMonth.length==5){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();

          } else if(kpiCurrentMonth.length==4){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();

          } else if(kpiCurrentMonth.length==3){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
          
          } else if(kpiCurrentMonth.length==2){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-5]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
           
          } else if(kpiCurrentMonth.length==1){
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-5]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-6]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
           
          } 
        } else {
          let limitIterationDays=kpiCurrentMonth.length-8;
          for (var i=kpiCurrentMonth.length-1; i>limitIterationDays; i--){
            //Llenado de valores para tablas cuando el array es mayor a los ultimos 7 dias del mes actual consultado
          
            kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
            kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
            kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
          }
          
        }
      } else {
        //Llenado de Enero a principios de cada año, cuando no se toma data de meses anteriores
        let limitIterationDays:number;
        switch(kpiCurrentMonth.length){
          case 6:
            limitIterationDays=kpiCurrentMonth.length-6;
            break;
          case 5:
            limitIterationDays=kpiCurrentMonth.length-5;
            break;
          case 4:
            limitIterationDays=kpiCurrentMonth.length-4;
            break;
          case 3:
            limitIterationDays=kpiCurrentMonth.length-3;
            break;  
          case 2:
            limitIterationDays=kpiCurrentMonth.length-2;
            break;
          case 1:
            limitIterationDays=kpiCurrentMonth.length-1;
            break;
          default:
            limitIterationDays=kpiCurrentMonth.length-7;
            break;                  
        }
        
        for (var i=kpiCurrentMonth.length-1; i>=limitIterationDays; i--){
          //Llenado de valores para tablas
          kpiCurrentMonth[i].kpi_online.hist_kpiReal=kpiCurrentMonth[i].kpi_online.hist_kpiReal*100
          kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
          kpiCurrentMonth[i].kpi_global.hist_kpiReal=kpiCurrentMonth[i].kpi_global.hist_kpiReal*100
          this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
        }
      }
  }
   
  
  }
  /**
   * Se controla con expresión ternaria la generación de registros que vienen con valores no definidos por data contenida en el archivo principalmente para el mes de ENERO hacia atras en la consulta,
   * fechas como 1,2,3,4,5,6 de enero en la consulta 7 dias hacia atras.
   */
  generateTables():void{
  this.tableKpiOnline = {
    headerRow: [ 'Fecha', 'KPI' ],
    dataRows: [
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-7].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_online.hist_kpiReal*100)/100).toString() : '0'],
    
      [this.lastKpiExecutions[this.lastKpiExecutions.length-6] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-6].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-6]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_online.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-5].date : 'No Available Data' ,
       this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_online.hist_kpiReal*100)/100).toString():'0'],

      [this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-4].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_online.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-3] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-3].date: 'No Available Data', 
      this.lastKpiExecutions[this.lastKpiExecutions.length-3] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_online.hist_kpiReal*100)/100).toString():'0'],
     
      [this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-2].date : 'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_online.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-1] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-1].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-1]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_online.hist_kpiReal*100)/100).toString(): '0']
        
    ]
  };

  this.tableKpiCore = {
    headerRow: [ 'Fecha', 'KPI' ],
    dataRows: [
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-7].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_core.hist_kpiReal*100)/100).toString() : '0'],
    
      [this.lastKpiExecutions[this.lastKpiExecutions.length-6] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-6].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-6]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_core.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-5].date : 'No Available Data' ,
       this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_core.hist_kpiReal*100)/100).toString():'0'],

      [this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-4].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_core.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-3] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-3].date: 'No Available Data', 
      this.lastKpiExecutions[this.lastKpiExecutions.length-3] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_core.hist_kpiReal*100)/100).toString():'0'],
     
      [this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-2].date : 'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_core.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-1] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-1].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-1]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_core.hist_kpiReal*100)/100).toString(): '0']
        
    ]
  };
  
  this.tableKpiGlobal = {
    headerRow: [ 'Fecha', 'KPI' ],
    dataRows: [
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-7].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_global.hist_kpiReal*100)/100).toString() : '0'],
    
      [this.lastKpiExecutions[this.lastKpiExecutions.length-6] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-6].date : 'No Available Data', 
       this.lastKpiExecutions[this.lastKpiExecutions.length-6]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_global.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-5].date : 'No Available Data' ,
       this.lastKpiExecutions[this.lastKpiExecutions.length-5] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_global.hist_kpiReal*100)/100).toString():'0'],

      [this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-4].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_global.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-3] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-3].date: 'No Available Data', 
      this.lastKpiExecutions[this.lastKpiExecutions.length-3] !=undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_global.hist_kpiReal*100)/100).toString():'0'],
     
      [this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-2].date : 'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_global.hist_kpiReal*100)/100).toString():'0'],
      
      [this.lastKpiExecutions[this.lastKpiExecutions.length-1] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-1].date :'No Available Data',
       this.lastKpiExecutions[this.lastKpiExecutions.length-1]!= undefined ? (Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_global.hist_kpiReal*100)/100).toString(): '0']
        
    ]
  }
}


}
