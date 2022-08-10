import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    var pathname = this.router.url.split("?")[0];
    if (pathname == "/groupList" || pathname =="/groupLeads") {
      $("li#groupList").addClass("active");
    }
    else if (pathname == "/getSupport") {
      $("li#getsupport").addClass("active");
    }
    else if (pathname == "Become an Affiliate") {
      $("li#becomeAnAffiliate").addClass("active");
    }
    else if (pathname == "/dashboard") {
      $("li#dashboard").addClass("active");
    }
  }

  onChange(e) {
    if (e.target.text) {
      $("li").removeClass("active");
      if (e.target.text.trim() == "Group List") {
        $("li#groupList").addClass("active");
      }
      else if (e.target.text.trim() == "Get Support") {
        $("li#getsupport").addClass("active");
      }
      else if (e.target.text.trim() == "Become an Affiliate") {
        $("li#becomeAnAffiliate").addClass("active");
      }
      else if (e.target.text.trim() == "Dashboard") {
        $("li#dashboard").addClass("active");
      }
    }
  }
}
