import { Component,  OnInit, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Settings} from "../../models/Settings.mode";
import { SettingsService} from "../../services/settings.service";


declare const L: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit{
  userInitial:Settings= new Settings();

  user: Settings = new Settings();
 //user: Se
  resgisterFomr!:FormGroup
  submitted = false;
  // Setting model object.
  setting: Settings;
  //data:DemodataService;

  ReadMore:boolean = true;
  //hiding info-card box
  visible:boolean = false;



  //onclick toggling both
  onclick()
  {
    this.ReadMore = !this.ReadMore; //not equal to
    this.visible = !this.visible //not equal to
    // Save setting data
    this.settingsService.insertOrUpdate(this.setting);
  }

  constructor(private settingsService: SettingsService) {
    this.setting = new Settings();
   // this.data = new SettingsService();

  }

  ngOnInit(){

    // Load setting data
    this.setting = this.settingsService.select();

    // Save data. you can run at any place.
    // this.settingsService.insertOrUpdate(this.setting); // <--
    //ask the user allow the location
    if(!navigator.geolocation){
      console.log('location is not provided');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
      const coords = position.coords;
      console.log(
        `lat: ${position.coords.latitude} , lon: ${position.coords.longitude}`
      );
      var map = L.map('map').setView([coords.latitude, coords.longitude], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   let marker = L.marker([coords.latitude, coords.longitude]).addTo(map);
    });
    //Call the method
    this.getLocation();
  }

  btnAdd_click() {
    // save setting object.
    this.settingsService.insertOrUpdate(this.setting, () => {
      alert("Updated Sucessefully");
    }, (error:any ) => {
      alert((error.message()))
    })

  }


  //Here I get the location from the user
  getLocation(){
    let clearLat =0;
    //let clearLong =0;
    let id = navigator.geolocation.watchPosition(
      (position) =>{
      console.log(
        `lat: ${position.coords.latitude}, long: ${position.coords.longitude}`
      );
      //keep tracking the location even if the user is in moviment
      if(position.coords.latitude === clearLat){
        navigator.geolocation.clearWatch(id);
      }
    },
    (err)=>{
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      timeout:5000,
      maximumAge:0
    })
  }
}
