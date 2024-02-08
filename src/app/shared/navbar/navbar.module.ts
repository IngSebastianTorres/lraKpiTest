import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { InfouserService } from 'app/services/infouser.service';


@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
    providers: [InfouserService]
})

export class NavbarModule {}
