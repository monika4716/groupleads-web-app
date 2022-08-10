import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../api.service";
import { CookieService } from "ngx-cookie-service";
import { NgxSpinnerService } from "ngx-spinner";
import { countriesObject } from "../../assets/typeScript/countries";
import { DropdownModule } from "primeng/dropdown";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-admin-bio",
  templateUrl: "./admin-bio.component.html",
  styleUrls: ["./admin-bio.component.css"],
})
export class AdminBioComponent implements OnInit {
  token;
  name;
  userDetails: any;
  selectedCountry: any;
  fullName: any;
  firstName: any;
  lastName: any;
  slug: any;
  linkedGroups: any;
  socialLinks: any = [];
  countryCode: any;
  achiveCount = 0;
  fields: any = "";
  acviveBtnFlag: any;
  isButtonVisible: any = true;
  isiconVisible: any = true;
  adminBioForm: FormGroup;
  socialName: any;
  socialHeading: any;
  socialPlaceholder: any;
  showAddProfileBtn: any = true;
  public countryList: any = countriesObject;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private DOMSR: DomSanitizer,
    private fb: FormBuilder
  ) {
    this.name = localStorage.getItem("name");
    this.token = localStorage.getItem("token");
    // this.adminBioForm = this.fb.group({
    //   firstName: [""],
    //   lastName: [""],
    //   achievements: this.fb.array([]),
    // });

    this.adminBioForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      achievements: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getAdminBioDetails();
  }

  logout() {
    this.cookie.deleteAll();
    window.localStorage.clear();
    setTimeout(() => {
      // let clearData = {};
      this.apiService.updateGroupOverview({}); // to clear behaviour variable. (to fix if different user is login then it display old user data in behaviour subject)
    }, 100);
    this.router.navigate(["login"]);
  }

  getAdminBioDetails() {
    this.apiService.getAdminBio(this.token).subscribe((response: any) => {
      console.log(response);
      if (response.status == 200) {
        this.userDetails = response.user_details;
        this.linkedGroups = response.Linked_groups;
        if (this.userDetails.name.indexOf(" ") > -1) {
          let nameArray = this.userDetails.name.split(" ");
          this.firstName = this.capitalizeFirstLetter(nameArray[0]);
          this.lastName = this.capitalizeFirstLetter(
            nameArray[nameArray.length - 1]
          );
          this.fullName =
            this.capitalizeFirstLetter(this.firstName) +
            " " +
            this.capitalizeFirstLetter(this.lastName);

          this.slug = this.firstName + this.lastName + this.userDetails.id;
        } else {
          this.firstName = this.capitalizeFirstLetter(this.userDetails.name);
          this.fullName = this.capitalizeFirstLetter(this.firstName);
          this.slug = this.firstName + this.userDetails.id;
        }
      }
    });
  }

  // saveAdminBioDetails(){
  //   let parm = {};
  //   this.apiService.saveAdminBio(this.token,parm).subscribe((response: any) => {
  //     console.log(response);
  //   })
  // }
  selectCountryOnChange(event) {
    // console.log();
    this.countryCode = event.value.code;
    console.log(this.countryCode);
  }

  // createAcheivementClick() {
  //   console.log("clicked");
  //   this.achiveCount++;
  //   if (this.achiveCount <= 3) {
  //     this.fields +=
  //       `<div class="input-group achievement_field mb-2" data-achieve-id =` +
  //       this.achiveCount +
  //       `><input type="text" class="form-control" placeholder="Enter an achievement">
  //         <span class="input-group-text" data-achieve-id ="` +
  //       this.achiveCount +
  //       `"(click)="deleteAchievement()"><img src="assets/images/Cancel.png" /></span>
  //     </div>`;
  //   }
  // }

  public get htmlProperty(): SafeHtml {
    return this.DOMSR.bypassSecurityTrustHtml(this.fields);
  }

  achievements(): FormArray {
    return this.adminBioForm.get("achievements") as FormArray;
  }

  newAchievement(): FormGroup {
    return this.fb.group({
      achieve: "",
    });
  }

  addAchievement() {
    this.achiveCount++;
    this.achievements().push(this.newAchievement());

    console.log(this.achiveCount);
    if (this.achiveCount == 3) {
      this.isButtonVisible = false;
    }
  }

  removeAchievement(i: number) {
    this.achiveCount--;
    this.achievements().removeAt(i);
    console.log(i);
    if (i <= 3) {
      this.isButtonVisible = true;
    }
  }

  onSubmit() {
    console.log(this.adminBioForm.value);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  openSocialModel(socialName) {
    if (socialName == "Facebook" || socialName == "LinkedIn") {
      this.isiconVisible = false;
      this.socialHeading = "Profile URL";
      this.socialPlaceholder = "Paste profile URL here...";
    } else if (socialName == "Instagram") {
      this.isiconVisible = true;
      this.socialHeading = "Instagram handle";
      this.socialPlaceholder = "Your instagram handle";
    } else if (socialName == "Twitter") {
      this.isiconVisible = true;
      this.socialHeading = "Twitter handle";
      this.socialPlaceholder = "Your twitter handle";
    } else if (socialName == "Youtube") {
      this.isiconVisible = false;
      this.socialHeading = "Profile URL";
      this.socialPlaceholder = "Paste channel URL here...";
    } else if (socialName == "Website") {
      this.isiconVisible = false;
      this.socialHeading = "Profile URL";
      this.socialPlaceholder = "Paste URL here...";
    }

    this.socialName = socialName;
    let socialProfileModal = document.getElementById("add_social_profileModal");
    let element: HTMLElement = socialProfileModal.getElementsByClassName(
      "cancel_btn"
    )[0] as HTMLElement;
    element.click();
  }

  onEnterSocialLink(socialLink) {
    this.showAddProfileBtn = true;
    if (socialLink != "") {
      this.showAddProfileBtn = false;
    }
  }

  AddSocialLink(socialLink) {
    let objectSocial = {};
    if (this.socialName == "Twitter") {
      socialLink = "http://twitter.com/" + socialLink;
    } else if (this.socialName == "Instagram") {
      socialLink = "https://www.instagram.com/" + socialLink;
    }

    objectSocial = {
      name: this.socialName,
      link: socialLink,
    };
    this.socialLinks.push(objectSocial);
    console.log(this.socialLinks);

    setTimeout(() => {
      let socialLinkModal = document.getElementById("social_linkModal");
      let element: HTMLElement = socialLinkModal.getElementsByClassName(
        "cancel_btn"
      )[0] as HTMLElement;
      element.click();
    }, 5000);
  }

  copyAdminProfile() {
    console.log("copy");
  }
}
