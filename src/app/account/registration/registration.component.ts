import { CargoAgentRM } from './../../_models/request-models/register/cargo-agent-rm.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  returnUrl = 'account';
  public registrationForm!: FormGroup;
  countryList: SelectList[] = [];
  baseAirpots: SelectList[] = [];
  keyword = 'value';




  constructor(private accountService: AccountService,
    private countryService: CountryService,
    private airportService: AirportService,
    private toastr: ToastrService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    this.loadAirports();
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.baseAirpots = res;
        }
      });
  }

  loadCountries(){
    this.countryService.getCountryList()
      .subscribe(res => {
        if(res.length > 0) {
          this.countryList = res;
        }
      });
  }


  initializeForm() {
    this.registrationForm = new FormGroup({
      agentName: new FormControl(null, [Validators.required]),
      userName: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      primaryTelephoneNumber: new FormControl(null,[Validators.required]),
      secondaryTelephoneNumber: new FormControl(null),
      email: new FormControl(null,[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      cargoAccountNumber: new FormControl(null),
      countryId: new FormControl(null,[Validators.required]), 
      baseAirportId:new FormControl(null,[Validators.required]),
      city: new FormControl(null,[Validators.required]),
      agentIATACode: new FormControl(null),
      password: new FormControl(null,[Validators.required,Validators.minLength(8)]),
      confirmPassword: new FormControl(null,[Validators.required,Validators.minLength(8)]),
    });
  }

  selectedCountry(value: any){
    this.registrationForm.get('countryId')?.patchValue(value.id);
  }

  onClearCountry() {
    this.registrationForm.get('countryId')?.patchValue(null);
  }

  selectedBaseAirport(value: any) {
    this.registrationForm.get('baseAirportId')?.patchValue(value.id);
  }

  onClearBaseAirport() {
    this.registrationForm.get('baseAirportId')?.patchValue(null);
  }

  register(){

    if(this.registrationForm.get('countryId')?.value === null || this.registrationForm.get('countryId')?.value === ""){
       this.toastr.error('Please select country.');
    }

    if(this.registrationForm.get('baseAirportId')?.value === null || this.registrationForm.get('baseAirportId')?.value === ""){
      this.toastr.error('Please select base airport.');
   }

    if(this.registrationForm.valid){  
      var agent: CargoAgentRM = this.registrationForm.value;
      this.accountService.register(agent).subscribe({
        next:(res)=>{
          this.toastr.success('Successfully registered.');
          this.router.navigate([this.returnUrl]);
        },
        error:(err)=>{

        }
      })
    }else{
      this.registrationForm.markAllAsTouched();
    }
  }

  cancelSignUp(){
    this.router.navigate([this.returnUrl]);
  }
 

}
