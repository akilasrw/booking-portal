import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AWBDetail } from 'src/app/_models/view-models/awb/awb-detail.model';

@Component({
  selector: 'app-booking-lookup-print',
  templateUrl: './booking-lookup-print.component.html',
  styleUrls: ['./booking-lookup-print.component.scss']
})
export class BookingLookupPrintComponent implements OnInit {

  ambPrintData! : AWBDetail;
  @ViewChild('aws') invoiceElement!: ElementRef;

  @Input() set printLookup(value: AWBDetail) {
    if(value) {
      this.ambPrintData = value
      this.generatePDF();
    }      
  }

  constructor() { }

  ngOnInit(): void {
  }

  generatePDF(): void {console.log('print-generatePDF');
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {debugger
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
      PDF.save('aws.pdf');
    });
  }
}
