/*jslint browser:true */
"use strict";

function addMonths(elem){
var annualUseKw = 0, dailyUseKw = 0, i = 0, x=0;
var months = document.getElementById(elem).getElementsByTagName('input');

    for (i = 0; i < months.length; i ++) {
        x = Number(months[i].value);
        annualUseKw += x;
    }
    dailyUseKw = annualUseKw / 365;
    return dailyUseKw
}
function sunHours(){
    var hrs;
    var theZone = document.forms.solarForm.zone.selectedIndex;
    theZone += 1;
    switch(theZone) {
        case 1:
            hrs = 6;
            break
        case 2:
            hrs = 5.5;
            break
        case 3:
            hrs = 5;
            break
        case 4:
            hrs = 4.5;
            break
        case 5:
            hrs = 4.2;
            break   
        case 6:
            hrs = 3.5;
            break
        default: 
            hrs = 0;
    }
  return(hrs);
}
function calculatePanel(){
    var userChoice = document.forms.solarForm.panel.selectedIndex
    var panelOptions = document.forms.solarForm.panel.options;
    var power = panelOptions[userChoice].value;
    var name = panelOptions[userChoice].text;
    var x = [power, name];
    return x;
}
function resetForm() {
    document.getElementById("solarForm").reset();
    document.getElementById("feedback").innerHTML = "<p>Enter your information above to calculate your solar needs.</p>";
    updateProgress(0); // Reset progress bar
}

function updateProgress(value) {
    const progressElement = document.querySelector('.progress');
    const progressText = document.getElementById('progressText');

    if (value >= 0 && value <= 100) {
        progressElement.style.width = value + '%';
        progressText.innerText = value + '% Complete';
    } else {
        console.error('Progress value must be between 0 and 100.');
    }
}

function calculateFormCompletion() {
    const fields = document.querySelectorAll("input, select");
    const filledFields = Array.from(fields).filter((field) => field.value.trim() !== "");
    const completionPercentage = Math.round((filledFields.length / fields.length) * 100);
    updateProgress(completionPercentage);
}

document.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", calculateFormCompletion);
});

function calculateSolar(){
    var dailyUseKw = addMonths('mpc');
    //console.log(dailyUseKw);

    var sunHoursPerDay = sunHours();
    //console.log(sunHoursPerDay);
    
    var minKwNeeds = dailyUseKw / sunHoursPerDay;
   // console.log(minKwNeeds);
    var realKwNeeds = minKwNeeds * 1.25;
   // console.log(realKwNeeds);
    var realWattNeeds = realKwNeeds * 1000;
   // console.log(realWattNeeds);

    var panelInfo = calculatePanel();
    var panelOutput = panelInfo[0];
    var panelName = panelInfo[1];
   // console.log(panelOutput);
    // console.log(panelName);

    var panelsNeeded = Math.ceil(realWattNeeds / panelOutput);  
    // console.log(panelsNeeded);

    var feedback = "";
    feedback += "<p>Based on your average daily use of "+ Math.round(dailyUseKw) +" kWh, you will need to purchase "+ panelsNeeded + " "+ panelName + " " + "solar panels to offset 100% of your electricity needs.</p>";
    feedback += "<h2>Additional Details</h2>";
    feedback += "<p>Your average daily electricity comsumption: " + Math.round(dailyUseKw) + " Kwh per day.</p>";
    feedback += "<p>Your average daily sunshine hours: "+ sunHoursPerDay +" hours per day.</p>";
    feedback += "<p>Realistic watts needed: "+ Math.round(realWattNeeds) +" watts/hours.</p>";
    feedback += "<p>The "+ panelName + " panel you selected generates about "+ panelOutput + " watts per hour.</p>";
    document.getElementById('feedback').innerHTML=feedback;
}