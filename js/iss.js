// define global variables
var earth_rotation = "0 0 0";
var latitude = 0;
var longitude = 0;
var oldlatitude = 0;
var oldlongitude = 0;
var iss_position = (latitude*(-1))+" "+(longitude+90)+" 0";

//get telemetry before DOM to get position data asap. Will throw an error because it has can't find any HTML elements to change, but will at least get the coordinates.
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
  // Get ISS Telemetry via JSON
  $.getJSON('https://open-notify-api.herokuapp.com/iss-now.json?callback=?', function(data) {
    // "data" is the JSON string
    latitude = data["iss_position"]["latitude"];
    longitude = data["iss_position"]["longitude"];
  });

  // The console.log explains what this is.
  iss_position = (latitude*(-1))+" "+(longitude+90)+" 0";
  iss_position_old = (oldlatitude*(-1))+" "+(oldlongitude+90)+" 0";
  console.log("Moving\nfrom "+oldlatitude+" "+oldlongitude+"\nto   "+latitude+" "+longitude);


  if(oldlatitude==0&&oldlongitude==0){
    // This is the case if the page has just loaded. This could later be something to tell the window shields to be shut or something like that.
    document.getElementById("iss_orbit_animation").setAttribute("easing","ease"); // start the animation slowly
    console.log("Inital positioning - please wait");
  }else{
    // This is the normal behavior.
    document.getElementById("iss_orbit_animation").setAttribute("easing","linear"); // animate in a linear motion
  }

  // Set position to last position and move from there to the newest position.
  document.getElementById("iss_orbit").setAttribute("rotation",iss_position_old);
  document.getElementById("iss_orbit_animation").setAttribute("from",iss_position_old);
  document.getElementById("iss_orbit_animation").setAttribute("to",iss_position);

  // Prepare for next cycle.
  oldlatitude=latitude;
  oldlongitude=longitude;

}
