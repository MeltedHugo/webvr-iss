// define global variables
var earth_rotation = "0 0 0";
var latitude = 0;
var longitude = 0;
var oldlatitude = 0;
var oldlongitude = 0;
var iss_position = (latitude*(-1))+" "+(longitude+90)+" 0";

//get telemetry before DOM to get position data asap
telemetry();



function time(){
  //get current UTC time, to calculate earth rotation
  var d = new Date();
  var month = d.getMonth();
  var h = d.getUTCHours();
  var m = d.getUTCMinutes();
  var s = d.getUTCSeconds();
  console.log("Current UTC Time: "+(month+1)+"th month - "+h+":"+m+":"+s);

  //This rotates the earth according to the time
  earth_rotation = "0 "+ 15*(h + (m*0.0167) + (s*0.00027777) ) + " 0";
  console.log("Earth rotation at the moment: "+earth_rotation);
  document.getElementById("earth").setAttribute("rotation",earth_rotation);

  // Tilt the earth according to month. Not working yet.
  var earth_season = "0 0 0";
  earth_season = "0 " + month*30 + " 23.44";
  //document.getElementById("earth_orbit").setAttribute("rotation",earth_season);
};


function telemetry(){
  // Get ISS Telemetry
  $.getJSON('http://open-notify-api.herokuapp.com/iss-now.json?callback=?', function(data) {
    // data is the JSON string
    latitude = data["iss_position"]["latitude"];
    longitude = data["iss_position"]["longitude"];
  });

  // The console.log explains what this is.
  iss_position = (latitude*(-1))+" "+(longitude+90)+" 0";
  iss_position_old = (oldlatitude*(-1))+" "+(oldlongitude+90)+" 0";
  console.log("Moving\nfrom "+oldlatitude+" "+oldlongitude+"\nto   "+latitude+" "+longitude);


  if(oldlatitude==0&&oldlongitude==0){
    // This is the case if the page has just loaded. This will later be something to tell the window shields to be shut.
    document.getElementById("iss_orbit_animation").setAttribute("easing","ease");
    console.log("Inital positioning - please wait");
  }else{
    // This is the normal behavior.
    document.getElementById("iss_orbit_animation").setAttribute("easing","linear");
  }

  // Set position to last position and move from there to the newest position.
  document.getElementById("iss_orbit").setAttribute("rotation",iss_position_old);
  document.getElementById("iss_orbit_animation").setAttribute("from",iss_position_old);
  document.getElementById("iss_orbit_animation").setAttribute("to",iss_position);

  // Prepare for next cycle.
  oldlatitude=latitude;
  oldlongitude=longitude;

}

 // units in meters, maybe scale stuff down because limited draw distance makes these useless
 //var sun_diameter = 1400000000;
 //var sun_radius = sun_diameter/2;
 //var earth_orbit = 150000000000;
 //var earth_diameter = 12430000;
 //var earth_radius = earth_diameter/2;
