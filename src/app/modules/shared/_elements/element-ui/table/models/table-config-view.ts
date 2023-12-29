export class TableConfigView {
  constructor(
    public field: string,
    public header: string,
    public view?: { table: boolean; detail: boolean },
    public format?: string,
    public mainteneanceUrl?: string,
    public width?: number,
    public tooltip?: string,
    public fixedColumn?: boolean,
    public file?: boolean,
    public style?: string,
    public color?: string,
    public length?: number,
    public hasMulti?: boolean,
    public multiFilter?: {
      options: Array<any>;
      text: string;
    }
  ) { }
}
