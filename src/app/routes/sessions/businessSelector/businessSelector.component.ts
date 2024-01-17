import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@core/authentication';
import { Business } from '../../../core/business/interface';
import { LocalStorageService } from '@shared';
import { BusinessService } from '../../../core/business/business.service';

export const key = 'ng-business-selected';
@Component({
  selector: 'app-business-selector',
  templateUrl: './businessSelector.component.html',
  styleUrls: ['./businessSelector.component.scss'],
})
export class BusinessSelectorComponent {
  businesss: Business[] = []
  private isSubmitting = false;
    constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private tokenService: TokenService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    if(!this.tokenService.valid()) 
    {
      this.router.navigateByUrl('/login');
    }
    if (this.localStorage.has(key)) {
      this.redirectToDashBoard()
    }
    this.loadRecord()
  }
 async loadRecord() {
    await this.businessService.getAllByUserId(this.tokenService.getUserId() || '').subscribe((response) => {
      switch (response.length) {
        case 0:
        case 1:
          if (response.length = 1) this.setSelectedBusiness(response[0])
          this.redirectToDashBoard()
        break;        
        default:
          this.businesss = response
          break;
      }
    })
  }

  selectBusiness(business: Business) {
    this.isSubmitting = true;
    if (this.setSelectedBusiness(business))
    {
      this.redirectToDashBoard()
    }
  }

  setSelectedBusiness(business: Business) {
    return this.localStorage.set(key, business)
  }

  redirectToDashBoard() {
    this.router.navigateByUrl('/dashboard');
  }

  closeModal() {

  }
}
