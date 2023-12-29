export interface DropDownOptionModel {
  value: number | string | boolean;
  text: string;
  selected?: boolean;
}

export interface dependency {
  dependencyValue: number,
  route: string
}