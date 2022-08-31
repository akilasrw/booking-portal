import { AWBCreateRM } from './../../../_models/request-models/awb/awb-create-rm.model';
import { AirportService } from './../../../_services/airport.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-awb-create',
  templateUrl: './awb-create.component.html',
  styleUrls: ['./awb-create.component.scss']
})
export class AwbCreateComponent implements OnInit {

  public awbForm!: FormGroup;
  public isUpdate:boolean= false;
  public updateIndex :number=0;
  public keyword = 'value';
  public destinationAirpots: SelectList[] = [];
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitDetail = new EventEmitter<any>();
  @Input() awbModel:AWBCreateRM = new AWBCreateRM(); 


  constructor(private airportService: AirportService) { }

  ngOnInit(): void {
    this.initializeAWBForm();
    this.loadAirports();
    if(this.awbModel != null){
      this.editAWBForm(this.awbModel);
    }
  }

  initializeAWBForm() {
    this.awbForm = new FormGroup({
      shipperName: new FormControl(null, [Validators.required]),
      shipperAccountNumber: new FormControl(null),
      shipperAddress: new FormControl(null),
      consigneeName: new FormControl(null,[Validators.required]),
      consigneeAccountNumber: new FormControl(null),
      consigneeAddress: new FormControl(null),
      agentName: new FormControl(null,[Validators.required]),
      agentCity: new FormControl(null), 
      agentAITACode: new FormControl(null),
      agentAccountNumber: new FormControl(null),
      agentAccountInformation: new FormControl(null),
      requestedRouting: new FormControl(null),
      routingAndDestinationTo: new FormControl(null),
      routingAndDestinationBy: new FormControl(null),
      requestedFlightDate: new FormControl(null),
      destinationAirportId:new FormControl(null),
      destinationAirportName:new FormControl(null),
      shippingReferenceNumber:new FormControl(null),
      currency:new FormControl(null),
      declaredValueForCarriage:new FormControl(null),
      declaredValueForCustomer:new FormControl(null),
      amountOfInsurance:new FormControl(null),
      rateCharge:new FormControl(null),
      natureAndQualityOfGoods:new FormControl(null),
    });
  }

  editAWBForm(awb: AWBCreateRM) {
    this.awbForm.get('shipperName')?.patchValue(awb.shipperName);
    this.awbForm.get('shipperAccountNumber')?.patchValue(awb.shipperAccountNumber);
    this.awbForm.get('shipperAddress')?.patchValue(awb.shipperAddress);
    this.awbForm.get('consigneeName')?.patchValue(awb.consigneeName);
    this.awbForm.get('consigneeAccountNumber')?.patchValue(awb.consigneeAccountNumber);
    this.awbForm.get('consigneeAddress')?.patchValue(awb.consigneeAddress);
    this.awbForm.get('agentName')?.patchValue(awb.agentName);
    this.awbForm.get('agentCity')?.patchValue(awb.agentCity);
    this.awbForm.get('agentAITACode')?.patchValue(awb.agentAITACode);
    this.awbForm.get('agentAccountNumber')?.patchValue(awb.agentAccountNumber);
    this.awbForm.get('agentAccountInformation')?.patchValue(awb.agentAccountInformation);
    this.awbForm.get('requestedRouting')?.patchValue(awb.requestedRouting);
    this.awbForm.get('routingAndDestinationTo')?.patchValue(awb.routingAndDestinationTo);
    this.awbForm.get('routingAndDestinationBy')?.patchValue(awb.routingAndDestinationBy);
    this.awbForm.get('requestedFlightDate')?.patchValue(formatDate(awb.requestedFlightDate!.toString(), 'MM-dd-yyyy', 'en-US'));
    this.awbForm.get('destinationAirportId')?.patchValue(awb.destinationAirportId);
    this.awbForm.get('destinationAirportName')?.patchValue(awb.destinationAirportName);
    this.awbForm.get('shippingReferenceNumber')?.patchValue(awb.shippingReferenceNumber);
    this.awbForm.get('currency')?.patchValue(awb.currency);
    this.awbForm.get('declaredValueForCarriage')?.patchValue(awb.declaredValueForCarriage);
    this.awbForm.get('declaredValueForCustomer')?.patchValue(awb.declaredValueForCustomer);
    this.awbForm.get('amountOfInsurance')?.patchValue(awb.amountOfInsurance);
    this.awbForm.get('rateCharge')?.patchValue(awb.rateCharge);
    this.awbForm.get('natureAndQualityOfGoods')?.patchValue(awb.natureAndQualityOfGoods);
  }

  loadAirports(){
    this.airportService.getSelectList()
      .subscribe(res => {
        if(res.length > 0) {
          this.destinationAirpots = res;
        }
      });
  }

  selectedDestination(value: any){
    this.awbForm.get('destinationAirportId')?.patchValue(value.id);
    this.awbForm.get('destinationAirportName')?.patchValue(value.value.substring(4));
  }

  saveAWBDetails(){
    if(this.awbForm.valid){
      var awb: AWBCreateRM = this.awbForm.value;
      awb.requestedFlightDate = new Date(formatDate(awb.requestedFlightDate!.toString(), 'yyyy-MM-dd', 'en-US'));
      awb.id=this.awbModel.id;
      awb.isEditAWB = this.awbModel.isEditAWB;
      this.submitDetail.emit(awb);
      this.closeModal();
    }else{
      this.awbForm.markAllAsTouched();
    }
 
  }

  closeModal() {
    this.closePopup.emit();
  }

}
