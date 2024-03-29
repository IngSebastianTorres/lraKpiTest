import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';


import { KpiBatchGlobalComponent } from 'app/kpi-batch-global/kpi-batch-global.component';
import { KpiBatchCoreComponent } from 'app/kpi-batch-core/kpi-batch-core.component';
import { KpiBatchGeneralSummaryComponent } from 'app/kpi-batch-general-summary/kpi-batch-general-summary.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'estadisticasOnline',      component: HomeComponent , ...canActivate(()=> redirectUnauthorizedTo(['/login']))},
    { path: 'estadisticasBatchGlobal',  component: KpiBatchGlobalComponent, title: 'Estadisticas Batch Global' ,...canActivate(()=> redirectUnauthorizedTo(['/login']))},
    { path: 'estadisticasBatchCore',   component: KpiBatchCoreComponent , title: 'Estadisticas Batch Core',...canActivate(()=> redirectUnauthorizedTo(['/login']))},
    { path: 'summaryReport',   component: KpiBatchGeneralSummaryComponent , title: 'KPI LRA',...canActivate(()=> redirectUnauthorizedTo(['/login']))},

];
    