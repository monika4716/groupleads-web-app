import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  planDetails: any;
  planFeatures: any[];
  token;
  billingIdBollean: boolean = false;
  showUpGradeBtn: boolean = true;
  billingId;
  expireDate;
  dayleft;
  upgradeURL;
  trial;
  price:string;
  type:string = '';
  planDetail: any = {};
  leftRowsCount:any;

  billingCycleSection: boolean =  true;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.token = localStorage.getItem("token");   
  }

  ngOnInit(): void {
    this.spinner.show();
    this.apiService.billingDetails(this.token).subscribe((response: any) => {
      console.log(response)
      this.upgradeURL = "https://groupleads.net/plans/?hash="+response.hash;
      if (response["status"] == 404) {
      } else if (response["status"] == 200) {

     
        this.planFeatures = response.userDetails.features;
        this.leftRowsCount = Math.ceil(this.planFeatures.length/2);
        this.price = response.userDetails.price;
        this.type = response.type;
        this.planDetail = response;
        this.trial = this.planDetail.userDetails.trial;
        
        if(this.planDetail.userDetails.expired_on == null){
          this.billingCycleSection = false;
        }        

        this.billingId = response["userDetails"].plan_id;

        if(response["userDetails"].expired_on != null){
          this.expireDate = moment(response["userDetails"].expired_on).format('MMMM Do YYYY');
          var expireDate = moment(response["userDetails"].expired_on).format('MM/DD/YYYY');
          var todaydate = moment(new Date).format('MM/DD/YYYY');
          this.dayleft = moment(expireDate).diff(moment(todaydate), 'days');
        }

        if(response.reseller_id > 0 || response.type == "life_time" ){//admin
          this.showUpGradeBtn = false;
        } else {
          this.showUpGradeBtn = true;
        }

      }
      this.spinner.hide();
    }, (err) => {
      console.log(err);
    })
  }

}
