import { CargoAgentRM } from './../../_models/request-models/register/cargo-agent-rm.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from 'src/app/_services/country.service';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  returnUrl = 'account';
  public registrationForm!: FormGroup;
  countryList: SelectList[] = [];
  keyword = 'value';




  constructor(public accountService: AccountService,
    public countryService: CountryService,
    private toastr: ToastrService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
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
      email: new FormControl(null,[Validators.required]),
      cargoAccountNumber: new FormControl(null),
      countryId: new FormControl(null,[Validators.required]), 
      city: new FormControl(null,[Validators.required]),
      agentIATACode: new FormControl(null),
      password: new FormControl(null,[Validators.required]),
      confirmPassword: new FormControl(null,[Validators.required]),
    });
  }

  selectedCountry(value: any){
    this.registrationForm.get('countryId')?.patchValue(value.id);
  }


  register(){
    if(this.registrationForm.valid){
      var agent: CargoAgentRM = this.registrationForm.value;
      this.accountService.register(agent).subscribe(
        res => {
          this.toastr.success('Successfully registered.');
          this.router.navigate([this.returnUrl]);
        },
        err => {

        })
    }else{
      this.registrationForm.markAllAsTouched();
    }
  }

  cancelSignUp(){
    this.router.navigate([this.returnUrl]);
  }
 

}
