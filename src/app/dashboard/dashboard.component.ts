import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../api.service';
import { UIChart } from "primeng/chart/chart";
import * as moment from 'moment';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: UIChart;
  id: any;
  data: any;
  datasets: any[];
  totalThisYear;
  total: any;
  Gname: any;
  totalLeads: any;
  overAlltotalLeads: any;
  allLeadsTemp: any[];
  leads: any[];
  groupsTemp: any;
  groups: any[];
  dataTemp: any = [];
  filterDropdown: any = 'all_time';
  filterDropdownLabel: any = 'All Time';
  name;
  dateVariable;
  monthsArray;
  hasLeads:boolean = false
  group_listing: any = [{label:'All groups',value:1},{label:'Facebook',value:2}]
  dataLoaded:boolean = false;
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'september', 'October', 'November', 'December']
  }

  ngOnInit(): void {
    this.apiService.getGroupOverview().subscribe((response) => {
      if(response.hasOwnProperty("groupsList")){
        this.groupsTemp = response.groupsList;
      }
      if(response.hasOwnProperty("totalLeads")){
        this.overAlltotalLeads = response.totalLeads;
        this.hasLeads = this.overAlltotalLeads > 0 ? true : false;
      }
  
      if(this.groupsTemp != undefined && this.overAlltotalLeads != undefined){
        this.dataLoaded = true;
     
      }
    })

    this.filterGraphData();
  }

  filterGraphData(){
    this.spinner.show();
    var tokenTemp = localStorage.getItem("token");
    let groupIdParam = this.activatedRoute.snapshot.queryParamMap.get('group_id');
    let groupId = groupIdParam ? groupIdParam : 0;
    let parameters = {groupId:groupId,filter:this.filterDropdown};

      this.apiService.getGraphData(tokenTemp,parameters).subscribe((response:any) => {
        this.dateVariable = "";
        this.data = {
          labels: response.labels,
          datasets: [
            {
              label: 'Leads',
              data: response.values,
              fill: false,
              borderColor: '#565656'
            }
          ]
        }
        this.spinner.hide();
      
      })
   
  }

  onChange(e, name) {
    
    $("li").removeClass("link");
    if(e.target.attributes.data_filter.value){
      this.filterDropdown = e.target.attributes.data_filter.value;
      this.filterDropdownLabel = e.target.text;
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
      this.filterGraphData();
    }
    return false;
    
  }
}
