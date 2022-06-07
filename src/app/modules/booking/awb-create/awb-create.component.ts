import { AirportService } from './../../../_services/airport.service';
import { AWBProductRM } from './../../../_models/request-models/awb/awb-product-rm.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { ToastrService } from 'ngx-toastr';
import { SelectList } from 'src/app/shared/models/select-list.model';


@Component({
  selector: 'app-awb-create',
  templateUrl: './awb-create.component.html',
  styleUrls: ['./awb-create.component.scss']
})
export class AwbCreateComponent implements OnInit {

  public awbForm!: FormGroup;
  public productForm!:FormGroup;
  public productList: AWBProductRM[] = []
  public isUpdate:boolean= false;
  public updateIndex :number=0;
  public keyword = 'value';
  public destinationAirpots: SelectList[] = [];
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitDetail = new EventEmitter<any>();


  constructor(private toastr: ToastrService,private airportService: AirportService) { }

  ngOnInit(): void {
    this.initializeAWBForm();
    this.initializeProductForm();
    this.loadAirports();
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
      destinationAirportCode:new FormControl(null),
      shippingReferenceNumber:new FormControl(null),
      currency:new FormControl(null),
      declaredValueForCarriage:new FormControl(null),
      declaredValueForCustomer:new FormControl(null),
      amountOfInsurance:new FormControl(null),
    });
  }

  initializeProductForm() {
    this.productForm = new FormGroup({
      productRefNumber: new FormControl(null),
      productName: new FormControl(null, [Validators.required]),
      productType: new FormControl(null),
      quantity: new FormControl(null),
    });
  }

  getAWBProductType(type: number) {
    return CoreExtensions.GetAWBProductType(type);
  }

  addProduct(){
    if(this.productForm.valid){
      var product: AWBProductRM = this.productForm.value;
      product.productType=Number(this.productForm.value.productType);
      if(this.isUpdate){
        this.productList[this.updateIndex]=product;
      }else{
        this.productList.push(product);
      }
      
    }
    this.resetProduct();
  }

  resetProduct(){
    this.productForm.reset();
    this.isUpdate= false;
  }

  removeProduct(item :AWBProductRM){
    this.productList.splice(this.productList.indexOf(item),1);
  }

  editProduct(product:AWBProductRM){
    this.isUpdate= true;
    this.updateIndex = this.productList.indexOf(product);
    this.productForm.get('productRefNumber')?.patchValue(product.productRefNumber);
    this.productForm.get('productName')?.patchValue(product.productName);
    this.productForm.get('quantity')?.patchValue(product.quantity);
    this.productForm.get('productType')?.patchValue(product.productType);

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
    this.awbForm.get('destinationAirportCode')?.patchValue(value.value);
  }

  saveAWBDetails(){
    if(this.awbForm.valid){
      var awb: AWBCreateRM = this.awbForm.value;
      if(this.productList.length == 0){
        this.toastr.error('Please add product items.');
        return;
      }
      awb.packageProducts = this.productList;

      this.submitDetail.emit(awb);
      this.closeModal(true);
    }else{
      this.awbForm.markAllAsTouched();
    }
 
  }

  closeModal(item: any) {
    this.closePopup.emit(item);
  }

}
