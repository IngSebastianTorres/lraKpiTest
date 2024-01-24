import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/user.component';
import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { KpiBatchGlobalComponent } from 'app/kpi-batch-global/kpi-batch-global.component';
import { KpiBatchCoreComponent } from 'app/kpi-batch-core/kpi-batch-core.component';
import { KpiBatchGeneralSummaryComponent } from 'app/kpi-batch-general-summary/kpi-batch-general-summary.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'estadisticasOnline',      component: HomeComponent },
    { path: 'user',           component: UserComponent },
    { path: 'table',          component: TablesComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'estadisticasBatchGlobal',  component: KpiBatchGlobalComponent, title: 'Estadisticas Batch Global' },
    { path: 'estadisticasBatchCore',   component: KpiBatchCoreComponent , title: 'Estadisticas Batch Core'},
    { path: 'summaryReport',   component: KpiBatchGeneralSummaryComponent , title: 'KPI LRA'},

];
    