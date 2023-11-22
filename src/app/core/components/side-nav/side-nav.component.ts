import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/_models/user.model';
import { RouteConstants } from '../../constants/constants';
import { MenuType } from '../../enums/common-enums';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit,OnDestroy {

  routeConstants = RouteConstants
  agentName: string = ''
  userName: string = ''
  agreement: string = ''
  email: string = '' 
  phoneNumber: number = 0
  agentForm: FormGroup | undefined;
  selectedMenu = MenuType.None
  currentUser?:User | null
  subscription?:Subscription;
  isProfileModalVisible:boolean = false
  isProfileModalAnimateVisible:boolean = false
  public showCollapseMenu:boolean=false;
  public showProfileCard:boolean=true;
  isEditModalVisible: boolean = false;
  isEditModalAnimateVisible: boolean = false;
  @Output() hideMenu = new EventEmitter<any>();
  @Output() showMsg = new EventEmitter<any>();


  constructor(
    private router: Router,
    private accountService: AccountService,
  ) {}




  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    let currentUrl = window.location.href.split('/').pop();
    if (currentUrl != null) {
      this.selectedMenu = this.getSelectedMenuType(currentUrl);
    }
    this.agentForm = new FormGroup({
      agentName: new FormControl(null),
      userName: new FormControl(null),
      phoneNumber: new FormControl(null),
      email: new FormControl(null)
    })

    this.accountService.getProfile().subscribe((x:any)=>{
        console.log(x, 'x')
        this.agentName = x.firstName
        this.userName = x.userName,
        this.email = x.email
        this.agreement = x.agreement
        this.phoneNumber = x.phoneNumber
        this.agentForm?.setValue({
           agentName:x.firstName,
           userName:x.userName,
           email:x.email,
           phoneNumber:x.phoneNumber
        })
    })
  }

  onSubmit() {
    // Create a new FormData object
    const formData = new FormData();
  
    // Append form control values to the FormData object if they exist

    if (this?.agentForm?.get('agentName')?.value != null) {
      formData.append('agentName', this.agentForm.get('agentName')!.value);
    }
  
    if (this?.agentForm?.get('userName')?.value != null) {
      formData.append('userName', this.agentForm.get('userName')!.value);
    }
  
    if (this?.agentForm?.get('phoneNumber')?.value != null) {
      formData.append('PrimaryTelephoneNumber', this.agentForm.get('phoneNumber')!.value);
    }

    if (this?.agentForm?.get('email')?.value != null) {
      formData.append('email', this.agentForm.get('email')!.value);
    }

    this.accountService.updateUser(formData).subscribe((x)=> window.location.reload())
  
   
    
   
  }

  openEditModal() {

    this.isEditModalVisible = true;
  
    setTimeout(() => (this.isEditModalAnimateVisible = true));
  }

  closeEditModel(){
    this.isEditModalVisible = false;
  }
  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }
openProfileModel(){
  this.isProfileModalVisible = true;
  setTimeout(() => (this.isProfileModalAnimateVisible = true));
}

closeProfileModel(){
  this.isProfileModalVisible = false;
}

  profileClick(){
    this.showProfileCard = !this.showProfileCard
  }

  signOut() {
    this.accountService.logout();
  }

  settings(){

  }

  edit(){

  }

  menuClickEvent(menu: MenuType) {
    if(MenuType.Message != menu)
        this.selectedMenu = menu;
    switch(menu){
      case MenuType.None:
        this.showCollapseMenu=!this.showCollapseMenu;
        this.hideMenu.emit(this.showCollapseMenu);
        if(!this.showCollapseMenu){
          this.showProfileCard = true;
        }else{
          this.showProfileCard = !this.showProfileCard;
        }
      break;
      case MenuType.DashBoard:
        this.router.navigate([RouteConstants.DashboardRoute])
      break;
      case MenuType.BookingInformation:
        this.router.navigate([RouteConstants.BookingInformationRoute])
      break;
      case MenuType.BookingLookup:
        this.router.navigate([RouteConstants.BookingLookupRoute])
      break;
      case MenuType.RateView:
        this.router.navigate([RouteConstants.RateViewRoute])
      break;
      case MenuType.TrackAWB:
        this.router.navigate([RouteConstants.TrackAWBRoute])
      break;
      case MenuType.Notifications:
        this.router.navigate([RouteConstants.NotificationsRoute])
      break;
      case MenuType.Message:
        this.showMsg.emit(true);
      break;
      default:
        this.router.navigate([RouteConstants.DashboardRoute]);
        break;
    }
  }

  getSelectedMenuType(url: string): number {
    let selectedType = MenuType.None
    switch (url) {
      case RouteConstants.DashboardRoute:
        selectedType = MenuType.DashBoard;
        break;
      case RouteConstants.BookingInformationRoute:
        selectedType = MenuType.BookingInformation;
        break;
      case RouteConstants.BookingLookupRoute:
        selectedType = MenuType.BookingLookup;
        break;
      case RouteConstants.RateViewRoute:
        selectedType = MenuType.RateView;
        break;
      case RouteConstants.TrackAWBRoute:
        selectedType = MenuType.TrackAWB;
        break;
      case RouteConstants.NotificationsRoute:
        selectedType = MenuType.Notifications;
        break;
    }
    return selectedType;
  }
}
