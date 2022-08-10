import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  API_URL = "https://api.groupleads.net/api/";
  // API_URL = 'http://localhost/group-leads-admin/api/';
  // API_URL = 'https://groupleads.net/group-leads-admin/api/';
  groupOverview: BehaviorSubject<any>;

  constructor(private httpClient: HttpClient) {
    this.groupOverview = new BehaviorSubject({});
  }

  updateGroupOverview(message) {
    this.groupOverview.next(message);
  }

  getGroupOverview(): Observable<any> {
    return this.groupOverview.asObservable();
  }

  getGroupOverviewValue() {
    return this.groupOverview.value;
  }

  loginUser(data) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    return this.httpClient.post(this.API_URL + "app-login-v2", data, {
      headers: headers,
    });
  }

  forgetpassword(email) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    return this.httpClient.post(this.API_URL + "app-forgot-password", email, {
      headers: headers,
    });
  }

  resetpassword(data) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    return this.httpClient.post(this.API_URL + "app-reset-password", data, {
      headers: headers,
    });
  }

  allLeads(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(
      this.API_URL + "app-get-group-leads?group_id=0",
      { headers: headers }
    );
  }

  allLeadsForChat(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(
      this.API_URL + "app-get-group-leads?group_id=0",
      { headers: headers }
    );
  }

  getGroupsList(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(this.API_URL + "app-get-group-list", {
      headers: headers,
    });
  }

  getParticularGroupLeads(id, token, fb_group_id) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(
      this.API_URL +
        "app-get-group-leads?group_id=" +
        id +
        "&fb_group_id" +
        fb_group_id,
      { headers: headers }
    );
  }

  getParticularGroupLeads2(id, token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(
      this.API_URL + "app-get-group-leads-2?group_id=" + id,
      { headers: headers }
    );
  }

  refreshToken(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(this.API_URL + "app-refresh-token", {
      headers: headers,
    });
  }

  billingDetails(token) {
    let headers: HttpHeaders = new HttpHeaders();

    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);

    return this.httpClient.post(
      this.API_URL + "app-get-user-details",
      {},
      { headers: headers }
    );
  }

  deleteLeads(id, token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.post(this.API_URL + "app-delete-lead", id, {
      headers: headers,
    });
  }

  getAllLeadsCount(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(this.API_URL + "app-get-all-leads-count", {
      headers: headers,
    });
  }

  getGraphData(token, params) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.post(this.API_URL + "app-get-graph-data", params, {
      headers: headers,
    });
  }

  getGridDataByFilter(token, params) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.post(
      this.API_URL + "app-get-group-data-by-filter",
      params,
      { headers: headers }
    );
  }

  getLeadsData(token, params) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.post(this.API_URL + "app-get-leads-data", params, {
      headers: headers,
    });
  }

  getAdminBio(token) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Accept", "application/json");
    headers = headers.append("Authorization", "Bearer " + token);
    return this.httpClient.get(this.API_URL + "get-admin-bio", {
      headers: headers,
    });
  }

  // saveAdminBio(token, params){
  // 	let headers: HttpHeaders = new HttpHeaders();
  // 	headers = headers.append('Accept', 'application/json');
  // 	headers = headers.append('Authorization', "Bearer "+token);
  // 	return this.httpClient.get(this.API_URL + 'save-admin-bio',params,{ headers: headers });
  // }
}
