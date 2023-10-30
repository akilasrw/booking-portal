import { CargoAgentRM } from './../../_models/request-models/register/cargo-agent-rm.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from 'src/app/_services/country.service';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentStatus } from 'src/app/core/enums/common-enums';



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

  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onClearBaseAirport() {
    this.registrationForm.get('baseAirportId')?.patchValue(null);
  }

  register() {
    // Check if countryId and baseAirportId are selected
    if (this.registrationForm.get('countryId')?.value === null || this.registrationForm.get('countryId')?.value === "") {
      this.toastr.error('Please select a country.');
      return; // Return early to prevent further execution
    }
  
    if (this.registrationForm.get('baseAirportId')?.value === null || this.registrationForm.get('baseAirportId')?.value === "") {
      this.toastr.error('Please select a base airport.');
      return; // Return early to prevent further execution
    }
  
    // Check if the form is valid
    if (this.registrationForm.valid) {
      // Create a new FormData object
      const formData = new FormData();
  
      // Append the selected file to the FormData object
      if (this.selectedFile) {
        formData.append('agreementFile', this.selectedFile, this.selectedFile.name);
      }
  
      // Append individual form fields to the FormData object
      formData.append('agentName', this.registrationForm.get('agentName')?.value);
      formData.append('userName', this.registrationForm.get('userName')?.value);
      formData.append('address', this.registrationForm.get('address')?.value);
      formData.append('primaryTelephoneNumber', this.registrationForm.get('primaryTelephoneNumber')?.value);
      formData.append('secondaryTelephoneNumber', this.registrationForm.get('secondaryTelephoneNumber')?.value);
      formData.append('email', this.registrationForm.get('email')?.value);
      formData.append('cargoAccountNumber', this.registrationForm.get('cargoAccountNumber')?.value);
      formData.append('countryId', this.registrationForm.get('countryId')?.value);
      formData.append('baseAirportId', this.registrationForm.get('baseAirportId')?.value);
      formData.append('city', this.registrationForm.get('city')?.value);
      formData.append('agentIATACode', this.registrationForm.get('agentIATACode')?.value);
      formData.append('password', this.registrationForm.get('password')?.value);
      formData.append('confirmPassword', this.registrationForm.get('confirmPassword')?.value);
  
      // Set the status after appending all form fields
      formData.append('status', '1');
  
      // Submit the form data to the server
      this.accountService.register(formData).subscribe({
        next: (res) => {
          this.toastr.success('User creation request submitted successfully. Await approval.');
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          // Handle errors
        }
      });
    } else {
      // Mark all form fields as touched to show validation errors
      this.registrationForm.markAllAsTouched();
    }
  }
  
  
  

  cancelSignUp(){
    this.router.navigate([this.returnUrl]);
  }
 

}
