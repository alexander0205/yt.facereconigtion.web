import { dependency, DropDownOptionModel } from '../../element-ui/dropdown/models/dropdown-option-model';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClientService } from '../../../_services/http-client/http-client.service';
import { ButtonModel } from '../table/models/button-model';


@Component({
  selector: 'el-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],

})
export class DropdownComponent implements ControlValueAccessor {
  onTouch: any = () => { }
  private onTouched = () => { };
  private onChanged = (_: any) => { };
  constructor(private http: HttpClientService, @Self() @Optional() public control: NgControl) {
    this.control.valueAccessor = this;


  }


  setDisabledState?(isDisabled: boolean): void {
  }
  @Input() disabled: boolean = false;
  @Input() dependency: dependency
  @Input() customClass: string;
  @Input() options: Array<DropDownOptionModel>;
  @Input() objectOptions: Array<any>
  @Output() onChange = new EventEmitter<boolean | string>()
  @Input() _selectedId = null;
  @Input() _selectedText = null
  @Input() button: ButtonModel;
  @Input() class
  @Input() stringOut: boolean = false;
  @Input() placeHolder: string;
  @Input() valueName: string;
  @Input() textName: string;
  @Input() customStyle: StyleSheet
  writeValue(value: any): void {

    this._selectedId = value;


  }

  // getDependencyOptions() {
  //   if (this.dependency) {
  //     this.http
  //   }
  // }

  get counterValue() {

    return this._selectedId;
  }



  changeValue(val) {
    if (val === 'true' || val === 'false') {

      if (val === 'true') {
        this.propagateChange(true)
        this.onChange.emit(true)
      } else {
        this.propagateChange(false);
        this.onChange.emit(false)
      }
    }
    else if (this.stringOut) {
      this._selectedId = val;

      this.propagateChange(this._selectedId);

      this.onChange.emit(val)
    }
    else {
      this._selectedId = +val;

      this.propagateChange(+this._selectedId);
      this.onChange.emit(val)
    }
  }



  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  ngOnChanges(): void {
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }


}
