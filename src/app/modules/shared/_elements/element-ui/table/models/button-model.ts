export interface ButtonModel {
    class?: string;
    function: (record: any) => any;
    icon?: string;
    color?: string;
    tooltip?: string;
    label?: string;
    disabled?: string;
    validateShow?: (record: any) => any;
}
