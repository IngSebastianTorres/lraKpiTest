import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import { KpiCurrentDay } from 'app/model/kpi-current-day';
import { KpiService } from 'app/services/kpi.service';
import { HttpBackendResponse } from 'app/model/http-backend-response';
import { KpiMonthFromYear } from 'app/model/kpi-month-from-year';
import { KpiMonths } from 'app/model/kpi-months';
import { kpis } from 'app/model/kpis';
import { KpiYear } from 'app/model/kpi-year';

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
  public currentDayKpi:number=0;
  public historicHostExecutions:number=0;
  public historicEtherExecutions:number=0;

  public httpBackend:HttpBackendResponse;
  public kpiYear:KpiMonthFromYear;
  public kpiMonth:KpiMonths;
  public monthsFromYear=new Map<number, string>();
  public KpiYearObject:KpiMonthFromYear;
  seriesFromBackendReal:number[] =[];
  seriesFromBackendEstimado:number[] =[];
  public lastKpiExecutions: KpiCurrentDay[] =[];
  public currentDate = new Date();
  public kpis:kpis;
  public kpiYearModel:KpiYear;
  dateEstimatedKpi:string;
  public estimatedKpiBatch:number;
  dateRealKpiCore:string;

  /**VARIABLES TO GET LAST DATA FROM LAST YEAR */
  public kpiCurrentFromLastYear:KpiCurrentDay[]; 
  public kpiMonthFromLastYear:KpiMonths;
  seriesFromBackendLastPastYear:number[]=[];
  public kpiYearModelLastYear:KpiYear;
  /**VARIABLES TO GET LAST DATA FROM LAST YEAR */
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
    let day:any;
    let month:any;
    let year:any;

    day= this.currentDate.toLocaleDateString().substring(0,2);
    day= parseInt(day);
    day=day-1;
    if(this.currentDate.toLocaleDateString().length == 9){
      month = this.currentDate.toLocaleDateString().substring(3,4);
      year = this.currentDate.toLocaleDateString().substring(5);
    } else {
      month = this.currentDate.toLocaleDateString().substring(4,5);
      year = this.currentDate.toLocaleDateString().substring(6);
    }
    this.dateRealKpiCore=month+"/"+day+"/"+year;
   }

   async ngOnInit() {

    this.getKpiCurrentDayData();
     /** Llamada al servicio de KPI Anual */
    this.httpResponse = await this.kpiBatchService.getCurrentDayKpi();
    this.kpis=this.httpBackend.response;
     //Ultimo año anterior
    let lastYear = this.currentDate.getFullYear()-1;
    this.setCurrentYear(lastYear);
    this.kpiMonth = this.kpiYearModel.kpi_annual;
    this.kpiMonthFromLastYear = this.kpiYearModelLastYear.kpi_annual;
    // Logica para pintar grafica con ultimo valor calculado del KPI de cada mes
    for (let m of this.monthsFromYear.values()){
      this.calculateMonthsDataCurrentYear(m);
    }

    switch (this.currentDate.getMonth()+1){
      case 1:
        this.setSeriesPerMonthToTable(this.kpiMonth.enero,null);
        break;
      case 2:  
        this.setSeriesPerMonthToTable(this.kpiMonth.febrero,this.kpiMonth.enero);
        break;
      case 3:
        this.setSeriesPerMonthToTable(this.kpiMonth.marzo,this.kpiMonth.febrero);
        break;
      case 4:
        this.setSeriesPerMonthToTable(this.kpiMonth.abril,this.kpiMonth.marzo);
        break;
      case 5:
        this.setSeriesPerMonthToTable(this.kpiMonth.mayo,this.kpiMonth.abril);
        break;
      case 6:
        this.setSeriesPerMonthToTable(this.kpiMonth.junio,this.kpiMonth.mayo);
        break;
      case 7:
        this.setSeriesPerMonthToTable(this.kpiMonth.julio,this.kpiMonth.junio);
        break;
      case 8:
        this.setSeriesPerMonthToTable(this.kpiMonth.agosto,this.kpiMonth.julio);
        break;
      case 9:
        this.setSeriesPerMonthToTable(this.kpiMonth.septiembre,this.kpiMonth.agosto);
        break;
      case 10:
        this.setSeriesPerMonthToTable(this.kpiMonth.octubre,this.kpiMonth.septiembre);
        break;
      case 11:
        this.setSeriesPerMonthToTable(this.kpiMonth.noviembre,this.kpiMonth.octubre);
        break;
      case 12:
        this.setSeriesPerMonthToTable(this.kpiMonth.diciembre,this.kpiMonth.noviembre);
        break;
    } 

    this.generateLineGraphic(); 
    this.generateTable();
    this.generateBarGraphic();    
    
  }

  public setSeriesPerMonthToPrintCharts(){
    for (var i=0; i<this.kpiCUrrent.length; i++){
      if( i == this.kpiCUrrent.length-1){
          var realKpiValue = this.kpiCUrrent[i].kpi_core.hist_kpiReal*100;
          var estimatedKpiValue = this.kpiCUrrent[i].kpi_core.hist_kpiEstimado*100;
          
          this.seriesFromBackendReal.push(Math.round(realKpiValue*100)/100 != 0 ? Math.round(realKpiValue*100)/100 : null  );
          this.seriesFromBackendEstimado.push(Math.round(estimatedKpiValue*100)/100 != 0 ? Math.round(estimatedKpiValue*100)/100 : null   ); 
        }
    }
    for (var i=0; i<this.kpiCurrentFromLastYear.length; i++){
      if( i == this.kpiCurrentFromLastYear.length-1){
        var realKpiFromLastYear = this.kpiCurrentFromLastYear[i].kpi_core.hist_kpiReal*100;
        this.seriesFromBackendLastPastYear.push(Math.round(realKpiFromLastYear*100)/100 != 0 ? Math.round(realKpiFromLastYear*100)/100 : null  );
      }
    }
  }

  public setCurrentMonth(){
    
    var currentMonthHaveRealKPIBatch=false;
    let month = this.currentDate.getMonth();  
    do{  
      switch (month){
        case 0:
          this.kpiCUrrent= this.kpiMonth.enero;
          break;
        case 1:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.febrero.length > 0 ? this.kpiMonth.febrero : this.kpiMonth.enero;
          break;
        case 2:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.marzo.length > 0 ? this.kpiMonth.marzo : this.kpiMonth.febrero;
          break;
        case 3:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.abril.length > 0 ? this.kpiMonth.abril : this.kpiMonth.marzo;
          break;
        case 4:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.mayo.length > 0 ? this.kpiMonth.mayo : this.kpiMonth.abril;
          break;
        case 5:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.junio.length > 0 ? this.kpiMonth.junio : this.kpiMonth.mayo;
          break;
        case 6:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.julio.length > 0 ? this.kpiMonth.julio : this.kpiMonth.junio;
          break;
        case 7:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.agosto.length > 0 ? this.kpiMonth.agosto : this.kpiMonth.julio ;
          break;
        case 8:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.septiembre.length > 0 ? this.kpiMonth.septiembre : this.kpiMonth.agosto ;
          break;
        case 9:
          //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA  
          this.kpiCUrrent=this.kpiMonth.octubre.length  > 0 ? this.kpiMonth.octubre : this.kpiMonth.septiembre ;
          break;
        case 10:
            //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA
          this.kpiCUrrent=this.kpiMonth.noviembre.length  > 0 ? this.kpiMonth.noviembre : this.kpiMonth.octubre ;
          break;
        case 11:
            //CONTROL PARA PRIMER DIA DE CADA MES CON EXPRESION TERNARIA 
          this.kpiCUrrent=this.kpiMonth.diciembre.length  > 0 ? this.kpiMonth.diciembre : this.kpiMonth.noviembre ;
          break;
      }
      if(this.dateEstimatedKpi==null){
        this.dateEstimatedKpi = this.kpiCUrrent[this.kpiCUrrent.length-1].date;
      }
      // Se mantiene kpi estimado mas reciente en la ultima posición de la data
      if (this.estimatedKpiBatch==null){
        this.estimatedKpiBatch = this.kpiCUrrent[this.kpiCUrrent.length-1].kpi_core.hist_kpiEstimado*100;
        this.estimatedKpiBatch=Math.round(this.estimatedKpiBatch*100)/100
      }  
      let i=this.kpiCUrrent.length-1;
      while (i>=0){ 
        if(this.kpiCUrrent[i].kpi_core.hist_kpiReal > 0){
          if(!currentMonthHaveRealKPIBatch){
            currentMonthHaveRealKPIBatch=true;
            this.dateRealKpiCore= this.kpiCUrrent[i].date;
            this.currentDayKpi = this.kpiCUrrent[i].kpi_core.hist_kpiReal*100;
            this.historicHostExecutions = this.kpiCUrrent[i].kpi_core.hist_EjecHost;
            this.historicEtherExecutions = this.kpiCUrrent[i].kpi_core.hist_EjecEther;
          }
        }
        i--;
      }

      // Si el mes es enero, no se buscara KPI Del año anterior, unicamente de los meses posteriores a Enero se aplica esta logica */
      if(month>0){
      month--;
      } else if(month==0) {
        break;
      }
    } while(this.currentDayKpi==undefined)
    
  }

  calculateMonthsDataCurrentYear(m:string){
    // Llenado de los ultimos dias del KPI 
    switch (m){
      case 'enero':
        this.kpiCUrrent = this.kpiMonth.enero;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.enero;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'febrero':  
        this.kpiCUrrent = this.kpiMonth.febrero;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.febrero;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'marzo':
        this.kpiCUrrent = this.kpiMonth.marzo;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.marzo;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'abril':
        this.kpiCUrrent = this.kpiMonth.abril;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.abril;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'mayo':
        this.kpiCUrrent = this.kpiMonth.mayo;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.mayo;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'junio':
        this.kpiCUrrent = this.kpiMonth.junio;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.junio;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'julio':
        this.kpiCUrrent = this.kpiMonth.julio;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.julio;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'agosto':
        this.kpiCUrrent = this.kpiMonth.agosto;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.agosto;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'septiembre':
        this.kpiCUrrent = this.kpiMonth.septiembre;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.septiembre;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'octubre':
        this.kpiCUrrent = this.kpiMonth.octubre;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.octubre;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'noviembre':
        this.kpiCUrrent = this.kpiMonth.noviembre;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.noviembre;
        this.setSeriesPerMonthToPrintCharts();
        break;
      case 'diciembre':
        this.kpiCUrrent = this.kpiMonth.diciembre;
        this.kpiCurrentFromLastYear = this.kpiMonthFromLastYear.diciembre;
        this.setSeriesPerMonthToPrintCharts();
        break;

    }
  }


  generateTable():void{
    this.tableData2 = {
      headerRow: [ 'Fecha', 'KPI Real' ],
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
  }

  generateBarGraphic():void{
    this.kpiLastDaysCharType = ChartType.Bar;
    this.lastKpiExecutions.reverse();
    this.kpiLastDaysCharData = {
     
      labels: 
      [this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-7].date : "No Available Data",  
      this.lastKpiExecutions[this.lastKpiExecutions.length-6] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-6].date : "No Available Data", 
      this.lastKpiExecutions[this.lastKpiExecutions.length-5] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-5].date : "No Available Data",  
      this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-4].date : "No Available Data",
      this.lastKpiExecutions[this.lastKpiExecutions.length-3] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-3].date : "No Available Data",
      this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-2].date : "No Available Data",
      this.lastKpiExecutions[this.lastKpiExecutions.length-1] != undefined ? this.lastKpiExecutions[this.lastKpiExecutions.length-1].date : "No Available Data"],
      series:[ 
            [
             this.lastKpiExecutions[this.lastKpiExecutions.length-7] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-7].kpi_core.hist_kpiReal*100)/100: 0, 
             this.lastKpiExecutions[this.lastKpiExecutions.length-6] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-6].kpi_core.hist_kpiReal*100)/100: 0,
             this.lastKpiExecutions[this.lastKpiExecutions.length-5] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-5].kpi_core.hist_kpiReal*100)/100: 0,  
             this.lastKpiExecutions[this.lastKpiExecutions.length-4] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-4].kpi_core.hist_kpiReal*100)/100: 0,  
             this.lastKpiExecutions[this.lastKpiExecutions.length-3] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-3].kpi_core.hist_kpiReal*100)/100: 0, 
             this.lastKpiExecutions[this.lastKpiExecutions.length-2] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-2].kpi_core.hist_kpiReal*100)/100: 0,  
             this.lastKpiExecutions[this.lastKpiExecutions.length-1] != undefined ? Math.round(this.lastKpiExecutions[this.lastKpiExecutions.length-1].kpi_core.hist_kpiReal*100)/100: 0
            ]
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
        this.seriesFromBackendLastPastYear,        
        this.seriesFromBackendEstimado,
        this.seriesFromBackendReal
      ]
    };
    this.hoursChartOptions = {
      low: 0,
      high: 60,
      showArea: true,
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
    var yearLeyend=this.currentDate.getFullYear()-1;
    this.hoursChartLegendItems = [
      { title: 'KPI REAL', imageClass: 'fa fa-circle text-info' },
        { title: 'KPI ESTIMADO', imageClass: 'fa fa-circle text-danger' },
        { title: 'KPI REAL AÑO '+yearLeyend.toString(), imageClass:'fa fa-circle text-warning'}
    ];  
  }


  public async getKpiCurrentDayData(){
    try{
      this.httpBackend= await this.kpiBatchService.getCurrentDayKpi();
      this.kpis= this.httpBackend.response;
      //Establecer año actual
      this.setCurrentYear(0);
      this.kpiMonth = this.kpiYearModel.kpi_annual;;
      this.setCurrentMonth();
       //Aproximación del KPI 
      this.currentDayKpi=Math.round(this.currentDayKpi*100)/100
    }catch(error){
      console.error(error);
    }
  }

  public setCurrentYear(lastYear?:number){
    let year = this.currentDate.getFullYear();
    for (let j=0; j<this.kpis.data.length; j++){
      if(this.kpis.data[j].year==year){
        this.kpiYearModel = this.kpis.data[j];    
      }
    }
    if(lastYear!=0){
      for (let j=0; j<this.kpis.data.length; j++){
        if(this.kpis.data[j].year==lastYear){
          this.kpiYearModelLastYear = this.kpis.data[j];    
        }
      }
    }
  }


  public setSeriesPerMonthToTable(kpiCurrentMonth:KpiCurrentDay[], kpiLastMonth:KpiCurrentDay[]){
    
    if(kpiCurrentMonth!=null ){
      // Diferenciación del mes de enero para aplicar logica de ultimos 7 dias del KPI Real
      // El metodo getMonth() trae los meses de enero a diciembre desde 0 hasta 11
      if(this.currentDate.getMonth()!=0){
        if(kpiCurrentMonth.length<=7){
          if(kpiCurrentMonth.length==7){
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            }
            this.lastKpiExecutions.reverse();
          } else if(kpiCurrentMonth.length==6){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
            
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            }
            this.lastKpiExecutions.reverse();
          } else if(kpiCurrentMonth.length==5){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();

          } else if(kpiCurrentMonth.length==4){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();

          } else if(kpiCurrentMonth.length==3){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
          
          } else if(kpiCurrentMonth.length==2){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-5].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-5].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-5]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
           
          } else if(kpiCurrentMonth.length==1){
            // Format KPI last value of last month To percent
            kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-1].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-2].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-3].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-4].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-5].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-5].kpi_online.hist_kpiReal*100
            kpiLastMonth[kpiLastMonth.length-6].kpi_online.hist_kpiReal=kpiLastMonth[kpiLastMonth.length-6].kpi_online.hist_kpiReal*100
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-1]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-2]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-3]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-4]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-5]);
            this.lastKpiExecutions.push(kpiLastMonth[kpiLastMonth.length-6]);
            this.lastKpiExecutions.reverse();
            for (var i=0; i<kpiCurrentMonth.length; i++){
              //Llenado de valores para tablas
              kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
              this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
            } 
            this.lastKpiExecutions.reverse();
           
          } 
        } else {
          let limitIterationDays=kpiCurrentMonth.length-8;
          for (var i=kpiCurrentMonth.length-1; i>limitIterationDays; i--){
            //Llenado de valores para tablas cuando el array es mayor a los ultimos 7 dias del mes actual consultado
          
            kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
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
          kpiCurrentMonth[i].kpi_core.hist_kpiReal=kpiCurrentMonth[i].kpi_core.hist_kpiReal*100
          this.lastKpiExecutions.push(kpiCurrentMonth[i]);    
        }
      }
    } 
  }
}


