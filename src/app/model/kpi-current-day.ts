import { KpiCore } from "./kpi-core";
import { KpiGlobal } from "./kpi-global";
import { KpiOnline } from "./kpi-online";

export class KpiCurrentDay {

    public date: string;
    public kpi_global:KpiGlobal;
    public kpi_core:KpiCore;
    public kpi_online:KpiOnline;
    
    public constructor(){

    }

}
