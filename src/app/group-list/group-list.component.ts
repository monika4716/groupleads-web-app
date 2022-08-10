import { Component, NgZone, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import * as moment from 'moment';
import * as $ from 'jquery';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  groupsData: any = [];
  groupsTemp: any[];
  leads: any[];
  allLeadsTemp: any[];
  cols: any[];
  search: any;
  Gname;
  Nogroup:boolean=false;
  id;
  filterDropdown;
  token;
  fbGroupIdFilter;
  subscription:any;
  listingUpdated:boolean = false;
  enableFilters:boolean = false;
  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private _ngZone: NgZone
  ) {
    this.token = localStorage.getItem("token");
    this.cols = [
      { field: 'group_name', header: 'Group name' },
      { field: 'count', header: 'Total leads captured' },
      { field: 'lastUpdate', header: 'Date last captured' },
    ];
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['group_id'];
      this.fbGroupIdFilter = params['fb_group_id'];
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    var token = localStorage.getItem("token");
  
    this.subscription = this.apiService.getGroupOverview().subscribe((response) => {
      
      if(response.hasOwnProperty("groupsList") && !this.listingUpdated){ 
        this.listingUpdated = true;
        let tempGroups = JSON.parse(JSON.stringify(response.groupsList));
        if(tempGroups[0].group_id == 0){
          // tempGroups.splice(0,1);
        }
        this.groupsTemp = tempGroups;
        this.groupsData = this.groupsTemp; 
        console.log(this.groupsData);
        if(!this.groupsTemp){
          this.Nogroup = true;
          $(".main").addClass('no-groups');
        } else {
          $(".main").removeClass('no-groups');
        }
        // this.allLeads();
        this.spinner.hide();
      }
    })
    // this.subscription.unsubscribe();
  }

  fiterdata(array) {
    this.spinner.show();
    var groupname = this.Gname ? this.Gname : "All Groups";
    if (this.groupsData) {
      if (groupname == "All Groups") {
        for (let i = 0; i < this.groupsData.length; i++) {
          this.groupsData[i].count = "0";
          var count = 0;
          for (let j = 0; j < array.length; j++) {
            if (this.groupsData[i].group_id == array[j].group_id) {
              count += 1;
              this.groupsData[i].count = count.toString();
            }
          }
        }
        this.spinner.hide();
      } else {
        for (let i = 0; i < this.groupsData.length; i++) {
          this.groupsData[i].count = "0";
          for (let j = 0; j < array.length; j++) {
            var count = 0;
            count += j + 1;
            this.groupsData[i].count = count.toString();
          }
        }
      }
    } 
    
    // let temp1 = this.apiService.getGroupOverviewValue();
    // for(let row1 of temp1.groupsList){
    //   console.log(row1);
    // }   
    this.spinner.hide();
  }

  allLeads() {
    this.apiService.getParticularGroupLeads(this.id, this.token, this.fbGroupIdFilter).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
       // console.log(response);
      } else if (response["status"] == 200) {
        this.allLeadsTemp = response["allLeads"];
        this.enableFilters = true;
        $("li#allTime").addClass("link");
        this.onChange("","All Time");
        this.spinner.hide();
       // console.log(response);
      }
    }, (err) => {
      console.log(err);
    })
  }

  filterGroup(groupname) {
    var name = groupname;
    this.Gname = name
    var array = this.groupsTemp
    this.groupsData = this.groupsTemp.filter(function (item) {
      if (name == "All Groups") {
        return array;
      }
      return item.group_name == name;
    })
   // console.log(this.groups);
  }

  fiterGroupdata(filterName) {

    var array = this.allLeadsTemp
  

    var date = new Date();
   

    var groupId = this.id;
    var groupname = this.Gname ? this.Gname : "All Groups";
    if (filterName == "Today") {
      this.leads = this.allLeadsTemp.filter(function (item) {
        if (groupname == "All Groups") {
          var today = moment(date).format("DDMMYYYY");
          var todayFromData = moment(item.created_at).format("DDMMYYYY");
          return today == todayFromData;
        }
        else if (groupId == item.group_id) {
          var today = moment(date).format("DDMMYYYY");
          var todayFromData = moment(item.created_at).format("DDMMYYYY");
          return today == todayFromData;
        }
      })
    }
    
    else if (filterName == "This month") {
      this.leads = this.allLeadsTemp.filter(function (item) {
        if (groupname == "All Groups") {
          var thisMonth = moment(date).format("MMYYYY");
          var thisMonthFromData = moment(item.created_at).format("MMYYYY");
          return thisMonth == thisMonthFromData;
        }
        else if (groupId == item.group_id) {
          var thisMonth = moment(date).format("MMYYYY");
          var thisMonthFromData = moment(item.created_at).format("MMYYYY");
          return thisMonth == thisMonthFromData;
        }
      })
    }
    else if (filterName == "Last 30 Days") {
      this.leads = this.allLeadsTemp.filter(function (item) {
        if (groupname == "All Groups") {
          var last30Day = moment(date).subtract(30, 'days').format("MM/DD/YYYY");
          var last30DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last30DayFromData).diff(moment(last30Day), 'days');
          var comparison = diff < 30 && diff > 0;
          return comparison == true;
        }
        else if (groupId == item.group_id) {
          var last30Day = moment(date).subtract(30, 'days').format("MM/DD/YYYY");
          var last30DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last30DayFromData).diff(moment(last30Day), 'days');
          var comparison = diff < 30 && diff > 0
          return comparison == true;
        }
      })
    }
    else if (filterName == "Last 90 Days") {
      this.leads = this.allLeadsTemp.filter(function (item) {
        if (groupname == "All Groups") {
          var last90Day = moment(date).subtract(90, 'days').format("MM/DD/YYYY");
          var last90DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last90DayFromData).diff(moment(last90Day), 'days');
          var comparison = diff < 90 && diff > 0
          return comparison == true;
        }
        else if (groupId == item.group_id) {
          var last90Day = moment(date).subtract(90, 'days').format("MM/DD/YYYY");
          var last90DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last90DayFromData).diff(moment(last90Day), 'days');
          var comparison = diff < 90 && diff > 0
          return comparison == true;
        }
      })
    }
    else if (filterName == "This Year") {
      this.leads = this.allLeadsTemp.filter(function (item) {
        if (groupname == "All Groups") {
          var thisYear = moment(date).format("YYYY");
          var thisYearFromData = moment(item.created_at).format("YYYY");
          return thisYear == thisYearFromData;
        }
        else if (groupId == item.group_id) {
          var thisYear = moment(date).format("YYYY");
          var thisYearFromData = moment(item.created_at).format("YYYY");
          return thisYear == thisYearFromData;
        }
      })
    }
    else if (filterName == "All Time") {
      if (groupname == "All Groups") {
        this.leads = this.allLeadsTemp;
      }
      else {
        this.leads = this.allLeadsTemp.filter(function (item) {
          return groupId == item.group_id;
        })
      }
    }
    else if (filterName == "Current Period") {

    } 
    else {
      if (groupname == "All Groups") {
        this.leads = this.allLeadsTemp;
      }
      else {
        this.leads = this.allLeadsTemp.filter(function (item) {
          return groupId == item.group_id;
        })
      }
    }
 
    
    this.fiterdata(this.leads);
  }

  onChange(e,name) {
    $("li").removeClass("link");
    if(e.target.attributes.data_filter.value){
      this.filterDropdown = e.target.attributes.data_filter.value;
     // this.filterDropdownLabel = e.target.text;
      if (this.filterDropdown == "today") {
        $("li#today").addClass("link");
      }
      else if (this.filterDropdown == "this_month") {
        $("li#thisMonth").addClass("link");
      }
      else if (this.filterDropdown == "last_30_days") {
        $("li#last30Days").addClass("link");
      }
      else if (this.filterDropdown == "last_90_days") {
        $("li#last90Days").addClass("link");
      }
      else if (this.filterDropdown == "this_year") {
        $("li#thisYear").addClass("link");
      }
      else if (this.filterDropdown == "all_time") {
        $("li#allTime").addClass("link");
      }


     this.filterGridData(this.filterDropdown);
    }
    return false;
  }

  filterGridData(filterType){
    this.spinner.show();
    // return false;
    var tokenTemp = localStorage.getItem("token");
    // let groupIdParam = this.activatedRoute.snapshot.queryParamMap.get('group_id');
    // let groupId = groupIdParam ? groupIdParam : 0;
    // let parameters = {groupId:groupId,filter:this.filterDropdown};

    // console.log(parameters);
    // this.spinner.hide();
    // setTimeout(() => {
      this.apiService.getGridDataByFilter(tokenTemp,{ "filter":filterType}).subscribe((response:any) => {
      
        this.groupsData = response.groupcountlist;
        this.spinner.hide();
      })
    // }, 2000); // 
  }


}
