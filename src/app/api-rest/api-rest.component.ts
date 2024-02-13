import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-rest',
  templateUrl: './api-rest.component.html',
  styleUrls: ['./api-rest.component.css']
})
export class ApiRestComponent implements OnInit {

  renderModalBackdrop:boolean;

  constructor() { 
    this.renderModalBackdrop=false;
  }

  ngOnInit(): void {
    
  }

  /*
    Se generan metodos para controlar los comportamientos de apertura y cierre de modal en el componente
  */
  onClickShowModal(id:string){
    
    document.getElementById(id).className= "modal fade in";
    document.getElementById(id).style.display='block';
    document.getElementById(id).style.overflowY= 'auto';
    document.getElementById('app-main-body').style.overflowY='hidden';
    document.getElementById('main-panel-application').className='openModalNoScrolling';
    this.renderModalBackdrop=true;
  }

  closeModal(id:string){
    document.getElementById(id).className= "modal fade";
    document.getElementById(id).style.display='none';
    document.getElementById('app-main-body').style.overflowY='auto';
    document.getElementById('main-panel-application').className='main-panel ps ps--active-y';
    this.renderModalBackdrop=false;
  }
  
}
