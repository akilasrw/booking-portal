import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AWBDetail } from 'src/app/_models/view-models/awb/awb-detail.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-booking-lookup-print',
  templateUrl: './booking-lookup-print.component.html',
  styleUrls: ['./booking-lookup-print.component.scss']
})
export class BookingLookupPrintComponent implements OnInit {

  awbPrintData? : AWBDetail;
  @ViewChild('aws') invoiceElement!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  printData(value: any){
    this.awbPrintData = value;
    setTimeout(() => {
      this.generatePDF();
    }, 1000);
  }

  generatePDF(): void {
    console.log('print-generatePDF');
    console.log(this.awbPrintData);
    let data: any = this.invoiceElement?.nativeElement; 
    if(data != null)
    html2canvas(data, { scale: 1 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      var margin = 3;
      const imgWidth  = 210 - 2*margin;
      var pageHeight = 295;  
      var imgHeight = (canvas.height * imgWidth ) / canvas.width;
      var heightLeft = imgHeight;
      
      let PDF = new jsPDF('p', 'mm','a4',true);
      var position = 5;
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', margin, position, imgWidth , imgHeight,);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        PDF.addPage();
        PDF.addImage(imageGeneratedFromTemplate, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save('awb.pdf');
    });
  }

  getCargoType(type: number) {
    return CoreExtensions.GetCargoType(type);
  }
}
