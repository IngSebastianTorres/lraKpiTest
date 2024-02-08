import { Component, OnInit, ElementRef, Input, OnDestroy } from '@angular/core';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { InfouserService } from 'app/services/infouser.service';
import { InfoUser } from 'app/model/info-user';
import { Subscription } from 'rxjs';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES_NAV: RouteInfo[] = [
    { path: '/estadisticasOnline', title: 'Estadisticas KPI',  icon: 'pe-7s-graph1', class: '' },
    { path: '/summaryReport', title: 'Informe General',  icon: 'pe-7s-graph1', class: ''},
    { path: '/estadisticasBatchGlobal', title: 'Estadisticas KPI',  icon: 'pe-7s-graph1', class: ''},
    { path: '/estadisticasBatchCore', title: 'Estadisticas KPI',  icon: 'pe-7s-graph1', class: ''}
];

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit,OnDestroy{
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;
    public infoUser:InfoUser;
    subscription:Subscription;
    

    constructor(location: Location,  private element: ElementRef, private auth:AuthService, private router:Router, private infoUserService:InfouserService) {
      this.location = location;
          this.sidebarVisible = false;
          this.infoUserService.dataObserver.subscribe(data => {
            this.infoUser = data;
            localStorage.setItem("infoUserEmail",this.infoUser.email);
            localStorage.setItem("profilePhoto",this.infoUser.profilePhoto);
        
      });
         
    }

    ngOnInit(){
      this.listTitles = ROUTES_NAV.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
      
      this.infoUser = new InfoUser(localStorage.getItem("infoUserEmail"),localStorage.getItem("profilePhoto"));
      
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    async onClick(){
        try{
            let response= this.auth.logout();
            console.log(response);
            this.router.navigate(['/login'])
            location.reload();
        }catch(err){
            console.error(err);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        localStorage.removeItem('infoUserEmail');
        localStorage.removeItem('profilePhoto');
    }
}
