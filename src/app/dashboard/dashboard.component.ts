import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms'
import { ApiService } from '../shared/api.service';
import { dashboardModel } from './dashboard-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  formValue !:FormGroup;
  
  dashboardModelObj:dashboardModel= new dashboardModel();
  dashboardData !:any;
  emailh :any;
  showAdd !: boolean;
  showUpdate !:boolean;
  showEmail : boolean=true;
  constructor(private formBuilder:FormBuilder,private api:ApiService) { }

  ngOnInit(): void {
    this.formValue=this.formBuilder.group({
      firstName:[''],
      lastName: [''],
      email:new FormControl('',[Validators.required,Validators.email]),  
      phoneNo:new FormControl('',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
    })
    this.getDetails();
  }

  get emailId(){
    return this.formValue.get('email');
  }

  submitData(){
    console.log(this.formValue.value);
  }

  clickAddPerson(){
    this.formValue.reset();
    this.showAdd=true;
    this.showUpdate=false;
    
  }

  postDetails(){
    this.dashboardModelObj.firstName=this.formValue.value.firstName;
    this.dashboardModelObj.lastName=this.formValue.value.lastName;
    this.dashboardModelObj.email=this.formValue.value.email;
    this.dashboardModelObj.phoneNo=this.formValue.value.phoneNo;
    
    this.api.postDetail(this.dashboardModelObj).subscribe(res=>{
      console.log(res);
      alert("Detail added successfully ");
      let ref=document.getElementById("cancel");
      ref?.click();
      this.formValue.reset();
      this.getDetails();
    },
    err=>{
      alert("Something went wrong");
    })
  }
  
  getDetails(){
    this.api.getDetail(0).subscribe(res=>{
      this.dashboardData=res;
    })
  }

  deleteDetails(row:any){
    this.api.deleteDetail(row.id).subscribe(res=>{
      this.getDetails();
    })
  }

  editDetails(row:any){
    this.showAdd=false;
    this.showUpdate=true;
    this.dashboardModelObj.id=row.id;

    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phoneNo'].setValue(row.phoneNo);
  }

  updateDetails(){
    this.dashboardModelObj.firstName=this.formValue.value.firstName;
    this.dashboardModelObj.lastName=this.formValue.value.lastName;
    this.dashboardModelObj.email=this.formValue.value.email;
    this.dashboardModelObj.phoneNo=this.formValue.value.phoneNo;

    this.api.updateDetail(this.dashboardModelObj,this.dashboardModelObj.id).subscribe(res=>{
      alert("Updated Successfully");
      let ref=document.getElementById("cancel");
      ref?.click();
      this.formValue.reset();
      this.getDetails();
    })
  }
}
