import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  @Input() title: string;
  @Input() hasFooter: boolean = false;
  @Input() totalTitle: string | number;
  @Input() data: number[]
  @Input() labels: string[]
  @Input() colors: string[]
  @Input() totalGeneral: any
  
  pieChartLabels: string[];
  dataset = {
    labels: ['2006', '2007'],
    datasets: [
      { data: [65, 59] },

    ]
  }
  chartColors: any[];
  pieChartData: any;
  chartOptions: any
  total: string | number
  dataT: any;
  constructor() { }
  Plugins: any;
  ngOnInit(): void {
    this.createChart()
  }

  createChart() {
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
    this.Plugins = [{
      beforeInit: function (chart, options) {
        chart.legend.afterFit = function () {
          this.height = this.height + 10;
        };
      }
    }]







    this.total = 1450

    this.chartColors = [{

      backgroundColor: this.colors
    }]


    this.chartOptions = {
      responsive: true,

      scales: {
        indexAxis: 'y',
        beginAtZero: true
        ,
        y: {
          beginAtZero: true

        },
        yAxes: [
          {

            scaleLabel: {
              display: true,
              labelString: "Numero de casos",
            },
          },
        ],
      },
      plugins: {
        legend: {
          display: false,
          position: 'right',
          align: 'center',
          labels: {
            pointStyle: 'circle',
            usePointStyle: true,
            padding: 25,
            textAlign: 'left',
          },
        },

      }

    }
  }

}
