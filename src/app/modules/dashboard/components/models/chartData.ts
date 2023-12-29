export interface chartsData {
    asistenciaDiariaSexo: chartData
    asistenciaJudicialEmpleadorEstado: chartData,
    asistenciaJudicialTipoEmpleador: chartData,
    asistenciaJudicialTipoSolicitante: chartData,
    asistenciaJudicialTrabajadorEstado: chartData,
    expedienteEstado: chartData,

    asistenciaDiariaTipoSolicitanteTrabajadorSexo: chartData,
    asistenciaJudicialEmpleadorMotivoDemanda: chartData,
    asistenciaJudicialTrabajadorMotivoDemanda: chartData,



}


export interface chartData {
    labels: string[],
    data: number[],
    colors: string[],
    total: number,
    totalFooter: string
}
