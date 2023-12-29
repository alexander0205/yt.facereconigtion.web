import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Input() toolbar: string
  @Output() selectedfiles = new EventEmitter<any[]>()
  supportedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'plain', 'csv', 'excel', 'xls', 'xlsx', 'docx', 'svg']
  constructor() { }
  files: any[] = []
  ngOnInit(): void {


  }
  test(event) {


    if (this.supportedTypes.includes(event[0].name.toLowerCase().split(".").pop())) {
      if (event[0].size < 6000000) {
        this.files.push(event[0])
      }
      this.selectedfiles.emit(this.files)

    }
  }


  remove(event) {

    const index: number = this.files.indexOf(event);
    if (index !== -1) {
      this.files.splice(index, 1);
    }
    this.selectedfiles.emit(this.files)
  }


}
