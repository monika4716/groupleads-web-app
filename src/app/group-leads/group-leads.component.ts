import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/* import {ConfirmationService} from 'primeng/primeng'; */
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from '../api.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import * as $ from 'jquery';
/* import Swal from 'sweetalert2/dist/sweetalert2.js'; */
/* import 'sweetalert2/src/sweetalert2.scss'; */
import sweetAlert from 'sweetalert2';

@Component({
  selector: 'app-group-leads',
  templateUrl: './group-leads.component.html',
  styleUrls: ['./group-leads.component.css']
})
export class GroupLeadsComponent implements OnInit {

  id: any = 0;
  valid: any;
  leads: any[];
  allLeads: any[];
  allLeadsTemp: any[];
  filterDropdown;
  Gname;
  token;
  cols: any[];
  selectedRows: number = 0;
  exportButton: boolean = false;
  firsttime: boolean = false;
  csvName:string = 'Leads';
  FromGPFilter;
  FbGroupIdFilter;
  // first = 1;


  totalRecords:any = 0;
  rowsPerPage:any = 10;
  filter:any;
  skip:any = 0;
  take:any = 0;
  sortField:any = '';
  sortOrder:any = '';
  first: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    /* private confirmService: ConfirmationService, */
    private location: Location,
    private apiService: ApiService
  ) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.id = params['group_id'];
      this.filter = params['filter_name'];
      // console.log('subscribe',this.filter)
      if(this.filter == undefined){
        this.filter = 'All Time';
      }
      this.skip = 0;
      this.take = this.rowsPerPage;
      // this.getLeadsData();
    });
    

    this.cols = [
      { field: 'profile_url', header: 'Profile Url' },
      { field: 'full_name', header: 'Full Name' },
      { field: 'first_name', header: 'First Name' },
      { field: 'last_name', header: 'Last Name' },
      { field: 'joined_date', header: 'Joined Facebook' },
      { field: 'ques_one', header: 'Question 1' },
      { field: 'ans_one', header: 'Answer 1' },
      { field: 'ques_two', header: 'Question 2' },
      { field: 'ans_two', header: 'Answer 2' },
      { field: 'ques_three', header: 'Question 3' },
      { field: 'ans_three', header: 'Answer 3' },
      { field: 'created_at', header: 'Date Added' }
    ];
    
  }

  ngOnInit(): void {
    
  }

  lazyLoadLeads(event){

    console.log(event)
    this.skip = event.first;
    this.take = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.getLeadsData();
    console.log('getLeadsData called from lazy load')
  }

  getLeadsData(){
    // this.exportCSV();
    this.spinner.show('sp5');
    let token = localStorage.getItem("token");
    console.log('getLeadsData called');
    let params = {skip: this.skip, take: this.take, group_id: this.id, filter:this.filter, sortField:this.sortField, sortOrder:this.sortOrder};
    this.apiService.getLeadsData(token, params).subscribe((data:any) => {
      if(data.status == 200){
        if(data.totalRecords != '-1'){
          this.totalRecords = data.totalRecords
        }
        this.leads = data.data;
        if(this.skip == 0){
          this.first = 0;
        }
        setTimeout(() => {
          this.spinner.hide('sp5');
        }, 150);
      }
    })
  }

  onChange(e, name) { 
    console.log('onChange called');
    $("li").removeClass("link");
    this.filter = name ? name : e.target.text ? e.target.text.trim() : "";

    console.log(this.filter);

    if (this.filter) {
        const urlTree: any = this.router.createUrlTree([], {
          queryParams: { group_id: this.id, filter_name: this.filter },
          queryParamsHandling: 'merge',
          preserveFragment: true
        });
        this.location.go(urlTree);

        if (this.filter == "Today") {
          $("li#today").addClass("link");
        }
        else if (this.filter == "This month") {
          $("li#thisMonth").addClass("link");
        }
        else if (this.filter == "Last 30 Days") {
          $("li#last30Days").addClass("link");
        }
        else if (this.filter == "Last 90 Days") {
          $("li#last90Days").addClass("link");
        }
        else if (this.filter == "This Year") {
          $("li#thisYear").addClass("link");
        }
        else if (this.filter == "All Time") {
          $("li#allTime").addClass("link");
        }
        else if (this.filter == "Current Period") {
          $("li#currentPeriod").addClass("link");
        }

        this.skip = 0;
        this.take = this.rowsPerPage;
        console.log('getLeadsData called from on change event')
        this.getLeadsData();
    }
  }

  deleteLeads(id, index){
    console.log('delete leads', id, index);

    sweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.token = localStorage.getItem("token");
        this.apiService.deleteLeads({"id":id},this.token).subscribe((response: any) => {
          if (response["status"] == 404) {
            this.spinner.hide();
         
          } else if (response["status"] == 200) {
            this.leads.splice(index, 1);
            sweetAlert.fire(
              'Deleted!',
              'Your Lead has been deleted.',
              'success'
            )
          }
        }, (err) => {
          console.log(err);
        })
      }
    })
  }

  exportCSV(){
    let token = localStorage.getItem("token");
    let token_array = token.split('.');
    let exportUrl = "https://api.groupleads.net/api/export-csv?t="+token_array[1]+"&fbgid="+this.id+"&filter="+this.filter;
    window.open(exportUrl);
  }  
}
