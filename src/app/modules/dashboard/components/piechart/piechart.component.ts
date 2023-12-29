import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { DropDownOptionModel } from 'src/app/modules/shared/_elements/element-ui/dropdown/models/dropdown-option-model';
import { HttpClientService } from 'src/app/modules/shared/_services/http-client/http-client.service';
Chart.register(...registerables);

@Component({
  selector: 'pie-chart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {
  @Input() title: string;
  @Input() hasFooter: boolean = false;
  @Input() totalTitle: string | number;
  @Input() data: number[]
  @Input() labels: string[]
  @Input() colors: string[];
  @Input() pieStatus: DropDownOptionModel[]
  @Input() fromDate: any
  @Input() toDate: any
  @Input() repLocalCode: any
  @Input() totalGeneral: any


  serviceCode = null;
  pieChartLabels: string[];
  chartColors: any[];
  pieChartData: any;
  chartOptions: ChartOptions
  total: string | number
   dataT: any;
  constructor(private http: HttpClientService) { }
  opt = [{ value: 1, text: 'tee' }]

  reloadData() {

    this.http.get<any>(`DashBoard/ServiceOrderPieStatus?FromDate=${this.fromDate}&ToDate=${this.toDate}&ProvinceCode=${this.repLocalCode}&ServiceTypeCode=${this.serviceCode}`).toPromise().then(
      data => {
        if (!(data.data.reduce((a, b) => { return a + b }, 0) == 0)) {

          this.data = data.data
          this.labels = data.labels
          this.totalGeneral = data.total
        }
        else {
          this.data = null
        }
      }
    )
  }
  ngOnInit(): void {
    if (this.data.reduce((a, b) => { return a + b }, 0) == 0) {
      this.data = null
    }


    this.dataT = {
      labels: this.labels,
      datasets: [{
        data: this.data,
        backgroundColor:this.colors,
      }],

    };

    // this.createChart()
  }

  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: 40
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    },

    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 13.5,
          padding: 20,
          textAlign: 'right',
        },
      },
      // tooltip: {
      //   callbacks: {
      //     label: function (context) {
      //       var data = context.dataset.data,
      //         label = context.label,
      //         currentValue = context.raw,
      //         total = 0;

      //       for (var i = 0; i < data.length; i++) {
      //         total += (data[i] as number);
      //       }
      //       var percentage = parseFloat(((currentValue as number) / total * 100).toFixed(1));

      //       return label + ": " + currentValue + ' (' + percentage + '%)';
      //     }
      //   }
      // }
    }
  }

}
