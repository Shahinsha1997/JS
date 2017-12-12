var Today = new Date();
var obj = {};
var regx = /^[A-Za-z\s]{5,80}$/;
var idno, num, dayId, fiweek, spr1, yeaR2 ,patkey,patKey,doc,currnttime,hour,minutes;
var haemoglobin,pcvolume,glucose_fasting,glucose_post,total_choloes,triglycerides,hdlcoles,nonhdlcholes,ldlcholes,bmistatus,bmi;
var num1 = [];
var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var monTHs = [
    ["January", 31],
    ["February", 28, 29],
    ["March", 31],
    ["April", 30],
    ["May", 31],
    ["June", 30],
    ["July", 31],
    ["August", 31],
    ["September", 30],
    ["October", 31],
    ["November", 30],
    ["December", 31]
];
var yeaR = Today.getFullYear();
var montH = Today.getMonth();
var datE = Today.getDate();

/*Calendar*/
var emailRegex = /^([a-zA-Z0-9])+([\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*([\.][a-zA-Z0-9]{2,3})+$/;
var nameregex = /^[A-Za-z\s]{3,40}$/;
var clinicregex = /^[A_Za-z0-9\s]{3,50}$/;
var phoneregex = /^[0-9]{10}$/;
var gtCookie , addusers;
var userdata;
$(document).ready(function(){
    $('.forms,.invitediv,.signinform,.rightpop,.optli,.applyappointment,.patientapnts,.appointmentDiv,.editProfile,.consultdiv,.checkupdiv').hide();
    if (document.cookie !== ""){
        gtCookie = document.cookie.split(";")[0].split("=");
        $.get("/getDetail",{
           "id" : gtCookie[0] 
        },function(data,status){
            userdata = JSON.parse(data);
            $("#nameid").html(userdata[0]);
            $("#emailid").html(userdata[1]);
            if (userdata[3] == 'Doctor'){
                addusers = '/sendmailrec';
                $("#apply").hide();
                $("#appointments").click();
                $(".homepage,#appointments,#patientdetails,#health,#addreceptionist,#consult,#myDetails,.appointmentDiv").show();
                
            }
            else if (userdata[3] == 'Patient'){
                $("#appointments,#health,#apply,#consult,#myDetails,.homepage,.patientapnts").show();
                $(".patientdetails,#addreceptionist,.applyappointment,.appointmentDiv").hide();
                $("#appointments").click();
            }
            else if (userdata[3] == 'Receptionist'){
                addusers = "/sendmailpat";
                $("#health,#apply,#consult").hide();
                $("#add").html("Add Patient");
                $("#appointments").click();
                $(".homepage,#appointments,#patientdetails,#myDetails,#add,#addreceptionist,.appointmentDiv,#addcheckup").show();
            }
        });
    }
    
    $("#sign").click(function(){
        visblecheck('.forms');
        $(".secDiv,.signinform").hide();
        $(".firstDiv").show();
    });
    
    $("#log").click(function(){
       visblecheck('.signinform');
       $(".forms").hide();
    });
    
    $("#nextdetail").click(function(){
       $(".firstDiv").hide(400,function(){
           $(".secDiv").show(500);
       });
    });
    
    /*$("#today").click(function(){
       $.get("/appointments",{
          "" 
       },function(data,status){
           
       });
    });*/
    
    $("#loginbtn").click(function(){
        var email = $("#logemail").val();
        var paswd = $("#logpaswd").val();
        $.post("/login",{
          "Email"    : email,
          "Password" : paswd
        },function(data,status){
           if (data == 'false'){
               alert("Invalid Email or Password");
           }
           else{
               location.href = "/home";
           }
        });
    });
    
    $(".signoutbtn").click(function(){
       $.get("/logout",{
           "id" : gtCookie[0]
       },function(data,status){
           if (data == 'true'){
               location.href = "/";
           }
       });
    });
    
    $("#apply").click(function(){
       $(".applyappointment").show();
       $(".appointmentDiv,.appointments,.patientapnts").hide();
    });
    
    $("#appointments").click(function(){
        $(".apointdiv").empty();
        $("#appointments").prop('disabled',true);
        if (userdata[3] == "Patient"){
           $(".applyappointment,.consultdiv").hide();
           $(".patientapnts").show();
           $.get("/getmyApoint",{
               'Email' : userdata[1]
           },function(data,status){
                if (data === null){
                   $(".apointdiv").append("<di class=apointmnts >You have no Appointments</div>");
                }
                else{
                    patKey = JSON.parse(data);
                    $("#appointments").prop('disabled',false);
                    patkey = Object.keys(patKey);
                    for(i=0;i<patkey.length;i++){
                       var ans = patKey[patkey[i]];
                       $(".apointdiv").append("<div class=apointmnts ><span id=spn"+i+" class=patapnt>"+ans.Date+" "+ans.Month+", "+ans.Year+" "+ans.Time+"</span><button class=btn id=btn"+i+">Cancel</button></div>");
                    }
                }
                $(".apointdiv .btn").click(function(){
                        var btid      = $(this).attr('id').split("n")[1];
                        var canceltxt = $("#spn"+btid).text().split(",")[0];
                        if (patKey[canceltxt] !== undefined){
                            $.post("/cancelbook",{
                                "cancelid" : canceltxt,
                                "Time"     : patKey[canceltxt].Time
                            },function(data,status){
                                if (data == 'true'){
                                    console.log('cancelled');
                                } 
                                else{
                                    console.log('Something went wrong');
                                }
                            });
                        }
                    });
            });
        }
        else{
            $(".patientapnts,.checkupdiv,.consultdiv,.invitediv").hide();
            $(".appointmentDiv").show();
            $.get("/getalApoint",{
               'Email' : userdata[1]
            },function(data,status){
                if (data === null){
                    $(".apointdiv").append("<di class=apointmnts>You have no Appointments</div>");
                }
                else{
                    patKey = JSON.parse(data);
                    $("#appointments").prop('disabled',false);
                    var dateobj = Object.keys(patKey);
                    var timeobj;
                    dateobj.sort(function(a,b){return a - b;});
                    for (i=0;i<dateobj.length;i++){
                        timeobj = Object.keys(patKey[dateobj[i]]);
                        timeobj.sort(function(a,b){return a - b;});
                        for (j=0;j<timeobj.length;j++){
                            var detail = patKey[dateobj[i]][timeobj[j]];
                            $(".apointdiv").append("<div class=apointmnts >"+detail.Date+", "+detail.Month+"  "+detail.Name+"  "+detail.Time+"</div>");
                        }
                    }
                }
            });
        }
    });
    
    $("#addreceptionist").click(function(){
        visblecheck('.invitediv');
    });
    
    $("#userimg").click(function(){
        visblecheck('.rightpop');
    });
    $(".invitebutton").click(function(){
       if (emailRegex.test($(".emailinput").val()) === true) { 
            $.post( addusers,{
              'Email' :  $(".emailinput").val(),
            },function(data,status){
               if (data == 'true'){
                   visblecheck('.invitediv');
               }
               else{
                  console.log("Try After Sometime"); 
               }
            });
       }
       else{
           alert();
       }
    });
    
    $("#myDetails").click(function(){
        $(".patientapnts,.appointmentDiv,.checkupdiv,.consultdiv,.invitediv").hide();
        $(".editProfile").show();
        $.get("/getusrdetails",{
            "Email" : userdata[1]
        },function(data,status){
           data = JSON.parse(data);
           $("#editemail").html(data.Email);
        });
    });
    
    $("#consult").click(function(){
        $(".patientapnts,.appointmentDiv,.editProfile,.checkupdiv,.invitediv").hide();
        $(".consultdiv").show();
        if (userdata[3] == "Doctor"){
            doc = userdata[1]
        }
        else{
            doc = userdata[userdata.length-1] 
        } 
        $.get("/getconsult",{
          "Email" : doc
        },function(data,status){
           if (data == 'false'){
               $(".feeddiv").empty();
               $(".feeddiv").append("<p class=nofeed >You have no Feeds</p>");
           }
           else{
               seepost(data);
           }
       }); 
    });
   
    $("#share").click(function(){
        $("#share").prop('disabled',true);
        if ($(".postdiv").text() != ""){
            hour    = Today.getHours();
            minutes = Today.getMinutes();
            currnttime = hrfunction();
            $.post("/sendpost",{
                "Name"   : userdata[0],
                "Hour"   : hour,
                "Time"   : currnttime,
                "Content": $(".postdiv").text(),
                "Email"  : userdata[1]
            },function(data,status){
                $(".postdiv").text("");
                $("#share").prop('disabled',false);
                if (data == 'true'){
                    if (userdata[3] == "Doctor"){
                        doc = userdata[1]
                    }
                    else{
                        doc = userdata[userdata.length-1] 
                    }
                    $.get("/getconsult",{
                       "Email":doc
                    },function(data,status){
                       seepost(data);
                    });
                }
            });
        }
        else{
            alert("fill up the field");
        }
    });
    
    $("#addcheckup").click(function(){
       $(".patientapnts,.editProfile,.consultdiv,.appointmentDiv,.invitediv").hide();
       $(".checkupdiv").show();
    });
    
    $("#saveresults").click(function(){
       haemoglobin,pcvolume,glucose_fasting,glucose_post,total_choloes,triglycerides,hdlcoles,nonhdlcholes,ldlcholes,bmistatus,bmi
        var low,high,low1,high1;
        var age = $(".age").val();
        var height  = $(".height").val();
        var weight  = $(".weight").val();
        var gender  = $(".sex").val();
        var haemo   = $(".haemo").val();
        var pcv     = $(".pcv").val();
        var fasting = $(".fasing").val();
        var post    = $(".post").val();
        var totalch = $(".totalch").val();
        var trygly  = $(".trygly").val();
        var hdl     = $(".hdl").val();
        var nonhdl  = $(".nonhdl").val();
        var ldl     = $(".ldl").val();
        
        if (gender == 'Male'){
            low   = 13.5;
            high  = 18;
            low1  = 42;
            high1 = 52;
        }
        else{
            low   = 12.5;
            high  = 16;
            low1  = 37;
            high1 = 47;
        }
        height  = height/100; 
        bmi = weight / Math.pow(height, 2);
        bmistatus   = bmicalc();
        haemoglobin = haemopcv(haemo,low,high);
        pcvolume    = haemopcv(pcv,low1,high1);
        glucose_fasting = glucosefast(fasting,100,125,126);
        glucose_post    = glucosefast(post,140,199,200);
        total_choloes   = cholestro(totalch);
        triglycerides   = trigly(trygly);
        hdlcoles        = hdlcolest(hdl);
        nonhdlcholes    = nonhdlcholes(nohdl,130,159,189,220);
        ldlcholes       = nonhdlcholes(ldl,100,129,159,190);
        
        
        $.post("/addcheckups",{
            'BMI'         : [bmi, bmistatus],
            "Haemoglobin" : [haemo, haemoglobin],
            "Pcvolume"    : [pcv, pcvolume],
            "Glucose_fasting": [fasting,glucose_fasting],
            "Glucose_post": []
        }.function(data,status){
           console.log(data); 
        });
        
        
        function nonhdlcholes(observed,optimal,medium,high,veryhigh){
            if (observed < optimal){
                return 'Optimal' ;
            }
            else if (observed >= optimal || observed <=medium ){
                return 'Desirable';
            }
            else if (observed >= medium || observed <= high){
                return 'Borderline High';
            }
            else if (observed >= high || observed <= veryhigh){
                return 'High';
            }
            else if (observed >= veryhigh){
                return 'Very High';
            }
        }
        
        function hdlcolest(observed){
            if (observed < 40){
                return 'Major risk factor for heart disease';
            }
            else if (observed >= 60){
                return 'Negative risk factor for heart disease';
            }
            else{
                return 'Normal';
            }
        }
        
        function trigly(observed){
            if (observed < 150){
                return 'Normal';
            }
            else if (observed >=150 || observed <=199){
                return 'Borderline High';
            }
            else if (observed >=200 || observed <=499){
                return 'High';
            }
            else if (observed >= 500){
                return 'Very High';
            }
        }
        
        function cholestro(observed){
            if (observed < 200){
                return 'Desirable';
            }
            else if (observed >= 200 || observed <= 239){
                return 'Borderline High';
            }
            else if (observed > 240){
                return 'High';
            }
        }
        
        function glucosefast(gluco,low,medium,high){
            if (gluco < low){
                return 'Normal';
            }
            else if (gluco >= low || gluco <= medium){
                return 'Impaired Tolerance';
            }
            else if (gluco >= high){
                return 'Diabetes mellitus'
            }
        }
        
        function haemopcv(observed,low,high){
            if (observed >=low || observed <=high){
               return 'Normal';
            }
            else if (observed < low){
               return "Low";
            }
            else if (observed > low){
               return "High";
            }
        }
        
        function bmicalc(){
            if (bmi < 19) {
               return bmistatus  = "Underweight";
            } 
            else if (bmi >= 19 && bmi <= 27) {
               return bmistatus = "Normal";
            }
            else if (bmi >= 28 && bmi <= 30.5) {
               return bmistatus = "Overweight";
            }
            else if (bmi > 30.5) {
               return  bmistatus = "Obese";
            }
        }
    });
    
    function seepost(data){
        var contents;
        data = JSON.parse(data);
        console.log(data);
        var posts = Object.keys(data);
        $(".feeddiv").empty();
        posts.sort(function(a,b){
           return b - a ; 
        });
        
        if (posts.length == 1){
            contents = data[posts[0]];
            $(".feeddiv").append("<div style='margin-top: 10px;' ><div class=imgdv ></div><div class=feedin ><b>"+contents.Name+"</b><span class=conver>   has started a conversation</span><i id=elip"+0+" class='fa elip fa-ellipsis-h' aria-hidden='true'></i><p class=dmt>"+contents.Time+"</p><div =contnt0 class=contdiv >"+contents.Content+"</div><button id=updat0 class=updte>Update</button><button id=canc0 class=updte>Cancel</button></div></div>");
        }
        else{
            for(i=0;i<posts.length;i++){
                contents = data[posts[i]];
                $(".feeddiv").append("<div style='margin-top: 10px;' ><div class=imgdv ></div><div class=feedin ><b>"+contents.Name+"</b><span class=conver>   has started a conversation</span><i id=elip"+i+" class='fa elip fa-ellipsis-h' aria-hidden='true'></i><p class=dmt>"+contents.Time+"</p><div id=contnt"+i+" class=contdiv >"+contents.Content+"</div><button id=updat"+i+"  class=updte>Update</button><button id=canc"+i+" class=updte>Cancel</button></div></div>");
                $("#elip"+i).after("<div id=opt"+i+" class=optiondv ><button id=edit"+i+" class=optbtns>Edit</button><button id=delt"+i+" class=optbtns>Delete</button></div>");
            }
            $(".optiondv,.updte").hide();
        }
        
        $(".elip").click(function(){
            var editid  = $(this).attr('id').split("elip")[1];
            var ckemail = $("#emailid").text();
            if (data[posts[editid]].Email == ckemail){
                visblecheck("#opt"+editid);
            }
            
            $("#edit"+editid).click(function(){
                $("#updat"+editid).show(); $("#canc"+editid).show();
                $(".optiondv").hide();
                $('#contnt'+editid).attr('contenteditable','true').css({border:'1px solid gray','margin-top':'4px'});
            });
            
            $("#updat"+editid).click(function(){
                if ($('#contnt'+editid).text() !== ""){
                    $.post("/updatepost",{
                        'edtime'  : posts[editid],
                        'Content' : $('#contnt'+editid).text()
                    },function(data,status){
                       if (data == 'true'){
                           $("#canc"+editid).click();
                       }
                       else{
                           alert(data);
                       }
                    });
                }
            });
            
            $("#delt"+editid).click(function(){
                $.post('/deltpost',{
                    'edtime' : posts[editid]
                },function(data,status){
                    if  (data == 'true'){
                        $("#consult").click(); 
                    }
                    else{
                        console.log('wrong')
                    }
                });
            });
            
            $("#canc"+editid).click(function(){
                $('#contnt'+editid).attr('contenteditable','false').css({border:'none','margin-top':'0px'});
                $(".updte").hide();
            });
        });
    }
    
    function hrfunction(){
        if (hour >=12){
            if (hour == 12){ 
               return currnttime = datE+" "+monTHs[montH][0]+", "+hour+":"+minutes+" PM";
            }
            else{
                gethr = hour-12;
              return currnttime = datE+" "+monTHs[montH][0]+", "+gethr+":"+minutes+" PM";
            }
        }
        else{
           return currnttime = datE+" "+monTHs[montH][0]+", "+hour+":"+minutes+" AM";
        }
    }
    
    function visblecheck(element){
        if ($(element).is(":visible") === false){
           $(element).show();
        }
        else{
           $(element).hide();
        } 
    }
    
    function checkDet(name, phone, email, dob,sd,clinic,paswd,paswd1) {
        if (sd === "") {
            return ('Enter the Details');
        } else if (sd !== "") {
            if (nameregex.test(name) === true) {
                if (phoneregex.test(phone) === true) {
                    if (emailRegex.test(email) === true) {
                        if (clinicregex.test(clinic) === true){
                            if (paswd == paswd1){
                                return 'true';
                            }
                            else{
                                return ('Entered Password is Wrong');
                            }
                        }
                        else{
                            return ('Entered Clinic Name is Wrong');
                        }
                        
                    } else {
                        return ("Entered Email is Wrong");
                    }
                } else {
                    return ("Entered Number is Wrong");
                }
            } else {
                return ("Entered Name is Wrong");
            }
        }
    }
    
    $("#createAcc").click(function(){
        var name   = $("#name").val();
        var phone  = $("#phone").val();
        var email  = $("#email").val();
        var gender = $(".gender").val();
        var dob    = $("#dob").val();
        var paswd  = $("#paswd").val();
        var paswd1 = $("#paswd1").val();
        var clinic = $(".clinic").val();
        var sd     = $("#name,#phone,#email,#dob,#paswd,.clinic,#paswd1").val();
        var reValue = checkDet(sd,name, phone, email,dob,clinic,paswd,paswd1);
        if (reValue == 'true'){
            $.post("/addDoctor",{
               "Name"  : name,
               "Email" : email,
               "Role"  :"Doctor",
               "Phone" : phone,
               "Clinic": clinic,
               "Dob"   : dob,
               "Password":paswd
            },function(data,status){
                if (status=='success' && data== 'true'){
                    location.href = '/home';
                }
                else{
                    alert("Already Exist");
                }
            });
        }
        else{
            alert(reValue);
        }
    });
    
    
    
        /*Calendar Apponntment*/
        
    function startCal() {
        var fnd = 1;
        var spread, ans;
        var list = [];
        var edit;
        var datList = [];
        var titList = [];
        spr1 == datE;
        $(".cal").empty();
        if (montH === Today.getMonth()) {
            //disable button
        } else if (montH === 12) {
            montH = 0;
            yeaR += 1;
        }
        yeaR2 = yeaR - 1;
        $("#Gemonth").html(monTHs[montH][0]+" "+ yeaR);
        $("#geYear").html(yeaR);
        if (document.cookie != "") {
            $("#In").html(document.cookie.split(";")[0].split("=")[1].toUpperCase());
        }
        s: {
            for (i = 0; i < monTHs.length; i++) {
                if (monTHs[i][0] == monTHs[montH][0]) {
                    break s;
                } else if ((yeaR % 4 == 0 && yeaR % 100 != 0 || yeaR % 400 == 0 && yeaR % 100 != 0 || yeaR % 4 == 0 && yeaR % 400 == 0) && monTHs[i][0] == "February") {
                    fnd = fnd + monTHs[i][2];
                } else {
                    fnd = fnd + monTHs[i][1];
                }
            }
        }
        fnd = fnd % 7;

        for (i = 0; i < 7; i++) {
            $(".cal").append("<input class='fdays daYs' id=" + i + " type=button value=" + weekDays[i] + " />");
        }
        for (i = 0; i < 42; i++) {
            $(".cal").append("<input id=Bo" + i + " class='sdays daYs' type=button />");
        }
        $("#Bo41").after("<div style='clear:both;' ></div>")
        if (yeaR2 >= 400) {
            fnd += Math.floor(yeaR2 / 400) * 0;
            yeaR2 = yeaR2 % 400;
        }
        if (yeaR2 >= 300) {
            fnd += Math.floor(yeaR2 / 300) * 1;
            yeaR2 = yeaR2 % 300;
        }
        if (yeaR2 >= 200) {
            fnd += Math.floor(yeaR2 / 200) * 3;
            yeaR2 = yeaR2 % 200;
        }
        if (yeaR2 >= 100) {
            fnd += Math.floor(yeaR2 / 100) * 5;
            yeaR2 = yeaR2 % 100;
        }
        if (yeaR2 < 100) {
            year5 = Math.floor(yeaR2 / 4);
            ans = yeaR2 - year5;
            fnd = fnd + ((year5 * 2) + ans) % 7;
        }
        if ((yeaR % 4 == 0 && yeaR % 100 != 0 || yeaR % 400 == 0 && yeaR % 100 != 0 || yeaR % 4 == 0 && yeaR % 400 == 0) && monTHs[montH][0] == "February") {
            spread = fnd + monTHs[montH][2];
        } else {
            spread = fnd + monTHs[montH][1];
        }
        var k = 0;
        var j = 1;
        for (i=fnd; i<spread; i++) {
            $("#Bo" + i).val(j);
            if (j == datE) {
                fiweek = i;
                dayId  = "Bo"+i;
            }
            j++;
        }
        $("#0,#Bo0,#Bo7,#Bo14,#Bo21,#Bo28,#Bo35").css("color", "rgba(202, 25, 25, 0.99)");
        if ($("#Bo6").val() == "") {
            $("#Bo0,#Bo1,#Bo2,#Bo3,#Bo4,#Bo5,#Bo6").hide();
        } else if ($("#Bo35").val() == "") {
            $("#Bo35,#Bo36,#Bo37,#Bo38,#Bo39,#Bo40,#Bo41").hide();
        }
        for (i=0; i<42; i++) {
            if ($("#Bo"+i).val() == "") {
                $("#Bo"+i).css({color: "white",disabled: 'true'});
            } 
            else if ($("#Bo" + i).val() == datE && montH == Today.getMonth() && Today.getFullYear() == yeaR) {
                $("#Bo" + i).css({fontWeight: "bolder",border: '2px solid teal'});
            }
        }

        function dateChange(){
            var fw = 1;
            var datk = 0
            for (i=fnd; i<spread; i++) {
                if (fw == datList[datk]) {
                    $("#Bo" + i).css({fontWeight: "bolder"});
                    datk += 1
                }
                fw++;
            }
        }
        spr1 = datE;
        function recurs(recur) {
            if (recur > 6) {
                for (j = recur; j >= 0; j -= 7) {
                    if (j <= 6) {
                       fiweek = weekDays[j];
                    }
                }
            }
        }
        
        $(".sdays").hover(function() {
            if ($(this).val() == "") {
                $(this).css('cursor', 'not-allowed');
            }
        });
        
        function evntGt(idnom){ 
            if ($("#"+idnom).val() != "") {
                dayId = idnom;
                idno = idnom.split("Bo");
                num = $("#"+idnom).val();
                spr1 = num;
                num1.push(idno[1]);
                $("#Bo" + num1[num1.length - 1]).css({
                    background: "hsla(0, 3%, 70%, 0.54)",
                    color: "white"
                });
                if (num1[num1.length - 1] == num1[num1.length - 2]) {
                    $("#Bo"+num1[num1.length-1]).css({background: "hsla(0, 3%, 70%, 0.54)",color: "white"});
                    $("#0,#Bo0,#Bo7,#Bo14,#Bo21,#Bo28,#Bo35").css("color", "rgba(202, 25, 25, 0.99)");
                } 
                else{
                    $("#Bo" + num1[num1.length - 2]).css({background: "white",color: "teal"});
                    $("#0,#Bo0,#Bo7,#Bo14,#Bo21,#Bo28,#Bo35").css("color", "rgba(202, 25, 25, 0.99)");
                }
            }
            if ($("#Bo0").val() == 0) {
                $("#Bo0").css("color", "white");
            }
            if ($("#Bo7").val() == 0) {
                $("#Bo7").css("color", "white");
            }
            recurs(idno[1]);
        }
        
        $(".sdays").click(function() {
           evntGt($(this).attr("id"));
        });
    }
    
    $("#Bckwd").click(function() {
        montH--;
        startCal();
    });
    
    $("#Frw").click(function() {
        montH++;
        startCal();
    });
    startCal(); 
    
    $(".time").click(function(){ 
        var appointtime = $(this).val();
        if (spr1 > Today.getDate()){
            $.post("/applyapoint",{
                "Time" : appointtime,
                "Date" : spr1,
                "Day"  : fiweek,
                "Month":  monTHs[montH][0],
                "Year" : yeaR
            },function(data,status){
                 console.log(data);
            });
        }
        else{
            alert("Invalid Date");
        }
    });
    
    /*Calendar Appointment*/
    
    
});