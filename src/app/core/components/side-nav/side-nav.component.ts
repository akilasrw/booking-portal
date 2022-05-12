import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from 'src/app/_models/user.model';
import { RouteConstants } from '../../constants/constants';
import { MenuType } from '../../enums/common-enums';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit,OnDestroy {

  routeConstants = RouteConstants

  selectedMenu = MenuType.None
  currentUser?:User | null
  subscription?:Subscription;
  public showCollapseMenu:boolean=false;
  public showProfileCard:boolean=true;
  @Output() hideMenu = new EventEmitter<any>();


  constructor(
    private router: Router,
    private accountService: AccountService,
  ) {}


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
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

  menuClickEvent(menu: MenuType){
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
      default:
        this.router.navigate([RouteConstants.DashboardRoute]);
        break;
    }

  }

}
