import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { GroupListComponent } from '../group-list/group-list.component';
import { GroupLeadsComponent } from '../group-leads/group-leads.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';


@Component({
  selector: 'app-header-after-login',
  templateUrl: './header-after-login.component.html',
  styleUrls: ['./header-after-login.component.css']
})
export class HeaderAfterLoginComponent implements OnInit {

  token;
  groups;
  groupId;
  partocularGroup;
  particularGroupName;
  groupDropdown;
  filtername;
  name;
  billinURl:boolean=false;
  allLeadsCount:Number = 0;
  selectedGroup:any = {group_id:0};
  group_listing: any = [];//[{"group_id": "0", "group_name": "All Groups"}];
  totalLeads:any = '00';
  totalLeadsTitle:any = '00';
  selectedGroupLeads:any = '00';
  constructor(
    private groupComponent: GroupListComponent,
    private spinner: NgxSpinnerService,
    private groupLeadsComponent: GroupLeadsComponent,
    private dashboardComponent: DashboardComponent,
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.name = localStorage.getItem("name");
    this.particularGroupName = '';
    this.token = localStorage.getItem("token");
    this.activatedRoute.queryParams.subscribe(params => {
      this.groupId = params['group_id'];
      this.filtername = params['filter_name'];
      localStorage.setItem("groupId",this.groupId);
    });
  }

  ngOnInit(): void {

    setInterval(() => {
      this.verifyUserToken();
    }, 7 * 60000);  
  
    this.apiService.getGroupOverview().subscribe((response) => {
    
      if(Object.keys(response).length === 0 && response.constructor === Object){
        if(localStorage.getItem("token") != null){  // to not trigger the api when we clear subject data after user logout
          this.spinner.show();
          this.getGroupsList(); 
          this.getAllLeadsCount();
        }
      }else{
        if(response.hasOwnProperty("groupsList")){
          this.group_listing = response.groupsList;
          this.groups = response.groupsList;
          let index   = response.groupsList.findIndex(x => x.group_id == this.groupId);
          if(index >= 0){
            this.selectedGroup = this.group_listing[index];
          }
        }

        if(response.hasOwnProperty("totalLeads")){
          this.totalLeadsTitle = response.totalLeads; 
          this.totalLeads = response.totalLeads;
        
        }
        // once all data loaded then hide loader
        if(response.hasOwnProperty("groupsList") && response.hasOwnProperty("totalLeads")){
          this.spinner.hide();
        }
      }
    });

  }


  verifyUserToken(loadList = false){
    this.spinner.show();
    var tokenTemp = localStorage.getItem("token");

      this.apiService.refreshToken(tokenTemp).subscribe((response: any) => {
        if (response["status"] == 404) {
          localStorage.removeItem("token");
          this.router.navigate(['login']);
          this.spinner.hide();
       
        } else if (response["status"] == 200) {
          this.token = response["token"];
          localStorage.removeItem("token");
          localStorage.setItem("token",this.token);
          this.spinner.hide();
     
          if(loadList){
            // this.groupList();
          }
        }
      }, (err) => {
        console.log(err);
      })
  }

  getGroupsList(){
    //this.spinner.show();
    var id = this.groupId;
    this.apiService.getGroupsList(this.token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
      } else if (response["status"] == 200) {
        var temp = response["groupList"];
        temp.unshift({"group_id": "0", "group_name": "All Groups"}); 
        this.groups = temp;
        let data = this.apiService.getGroupOverviewValue();
        data.groupsList = temp;
        this.apiService.updateGroupOverview(data);
      }
    }, (err) => {
      console.log(err);
    })
  }

  getAllLeadsCount(){
    this.apiService.getAllLeadsCount(this.token).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
      } else if (response["status"] == 200) {
        let temp = this.apiService.getGroupOverviewValue();
        temp.totalLeads = response.totalLeads;
        this.apiService.updateGroupOverview(temp);
      }
    })
  }

 

  onChange(e, name) {
    if (e) {
      this.partocularGroup = this.groups.filter(function (item) {
        // return item.group_id == e.target.value;
        return item.group_id == e.value.group_id;
      })
      var groupName = this.partocularGroup[0].group_name;
      var groupId = e.value.group_id;
      
      var parameters = {};
      if(groupId != '0'){
        // querryParam = { queryParams: { group_id: groupId} }
        parameters = { group_id: groupId}
      }

      // console.log(parameters)
      
      var pathname = this.router.url.split("?")[0];

      if(pathname == '/dashboard'){
        this.router.navigate([],{
          relativeTo: this.activatedRoute,
          queryParams:parameters,
          // queryParamsHandling: 'merge',
          // skipLocationChange: true
        })
        setTimeout(() => {
          this.dashboardComponent.filterGraphData();   
        }, 100);
        
      }else if('/groupLeads' == pathname){
        this.router.navigate([],{
          relativeTo: this.activatedRoute,
          queryParams:parameters,
          // queryParamsHandling: 'merge',
          // skipLocationChange: true
        })
        setTimeout(() => {
          console.log('getLeadsData called from header')
          this.groupLeadsComponent.getLeadsData();
        }, 100);
       
      }

    
    }

    
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    setTimeout(() => {
      // let clearData = {};
      this.apiService.updateGroupOverview({}); // to clear behaviour variable. (to fix if different user is login then it display old user data in behaviour subject)
    }, 100);
    
    this.router.navigate(['login']);
  }

}
