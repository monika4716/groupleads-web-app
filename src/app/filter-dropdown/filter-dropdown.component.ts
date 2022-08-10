import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupLeadsComponent } from '../group-leads/group-leads.component';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css']
})
export class FilterDropdownComponent implements OnInit {

  id: any;
  leads;
  leadstemp;
  token;
  FbGroupIdFilter;

  constructor(
    private activatedRoute: ActivatedRoute,
    private groupLeadsComponent: GroupLeadsComponent,
    private router: Router,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
  ) {
    this.token = localStorage.getItem("token");
    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['group_id'];
      this.FbGroupIdFilter =  params['fb_group_id'];
    });
  }

  ngOnInit(): void {
    this.getAllLeads();
  }

  getAllLeads() {
    this.spinner.show();
    var id = this.id ? this.id : 0
    this.apiService.getParticularGroupLeads(id, this.token, this.FbGroupIdFilter).subscribe((response: any) => {
      if (response["status"] == 404) {
        this.spinner.hide();
    
      } else if (response["status"] == 200) {
        let leads = response["allLeads"];
        this.leads = leads;
        this.leadstemp = leads;
        $("li#thisMonth").addClass("link");
        this.fiterGroupdata("This month");
        this.spinner.hide();
  
      }
    }, (err) => {
      console.log(err);
    })
  }

  fiterGroupdata(filterName) {
    var array = this.leadstemp
    var date = new Date();
    var groupId = localStorage.getItem("groupId");
    var groupname = localStorage.getItem("groupName");
    if (groupname == "All Groups") {
      return this.groupLeadsComponent.leads = array;
    }
    if (filterName == "Today") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
        if (groupId == item.group_id) {
          var today = moment(date).format("DD");
          var todayFromData = moment(item.created_at).format("DD");
          return today == todayFromData;
        }
      })
    }
    else if (filterName == "This month") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
        if (groupId == item.group_id) {
          var thisMonth = moment(date).format("MM");
          var thisMonthFromData = moment(item.created_at).format("MM");
          return thisMonth == thisMonthFromData;
        }
      })
    }
    else if (filterName == "Last 30 Days") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
        if (groupId == item.group_id) {
          var last30Day = moment(date).subtract(30, 'days').format("MM/DD/YYYY");
          var last30DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last30DayFromData).diff(moment(last30Day), 'days');
          var comparison = diff < 30
          return comparison == true;
        }
      })
    }
    else if (filterName == "Last 90 Days") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
        if (groupId == item.group_id) {
          var last90Day = moment(date).subtract(90, 'days').format("MM/DD/YYYY");
          var last90DayFromData = moment(item.created_at).format("MM/DD/YYYY");
          var diff = moment(last90DayFromData).diff(moment(last90Day), 'days');
          var comparison = diff < 90
          return comparison == true;
        }
      })
    }
    else if (filterName == "This Year") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
        if (groupId == item.group_id) {
          var thisYear = moment(date).format("YYYY");
          var thisYearFromData = moment(item.created_at).format("YYYY");
          return thisYear == thisYearFromData;
        }
      })
    }
    else if (filterName == "All Time") {
      this.groupLeadsComponent.leads = this.leadstemp.filter(function (item) {
         return groupId == item.group_id;
      })
    }
    else if (filterName == "Current Period") {

    } else {
      this.groupLeadsComponent.leads;
    }

  }

  onChange(e,name) {
    $("li").removeClass("link");
    var filterDropdown = name?name:e.target.text?e.target.text.trim():"";
    if (filterDropdown) {
      localStorage.setItem("filterdropdown",filterDropdown)
      if (filterDropdown == "Today") {
        $("li#today").addClass("link");
      }
      else if (filterDropdown == "This month") {
        $("li#thisMonth").addClass("link");
      }
      else if (filterDropdown == "Last 30 Days") {
        $("li#last30Days").addClass("link");
      }
      else if (filterDropdown == "Last 90 Days") {
        $("li#last90Days").addClass("link");
      }
      else if (filterDropdown == "This Year") {
        $("li#thisYear").addClass("link");
      }
      else if (filterDropdown == "All Time") {
        $("li#allTime").addClass("link");
      }
      else if (filterDropdown == "Current Period") {
        $("li#currentPeriod").addClass("link");
      }
      this.fiterGroupdata(filterDropdown);
    } else {
      this.groupLeadsComponent.leads = this.leadstemp;
    }
  }
}
