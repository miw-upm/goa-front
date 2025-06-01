export interface ProcedimientoLegal {
    id?: string;
    titulo: string;
    fechaInicio?: Date;
    fechaCierre?: Date;
    presupuesto?: number;
    ivaIncluido?: boolean;
    tareasLegales?: string[];
}