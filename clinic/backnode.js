var http     = require('http');
var fs       = require('fs');
var url      = require('url');
var qrString = require('querystring');
var path     = require('path');
var request  = require('request');
var redis    = require('redis');
var client   = redis.createClient();
var file, checkUser, detailObj, userID , objct , randnum, usrlogin , cookiecheck, userCookie;
var userobj, getapntmnt;
var randmtext = 'qwertyuiopasdfghjklzxcvbnm6235189';
var emailRegex = /^([a-zA-Z0-9])+([\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*([\.][a-zA-Z0-9]{2,3})+$/;
client.on('connect',function(){
    console.log('connected');
});

http.createServer(function(req,res){
    res.writeHead(200 , {'content-type':'text/html'});
    var ans = url.parse(req.url,true);
    var randm    = "";
    var body = "";
    
    if (req.headers.cookie !== undefined){
        userCookie = req.headers.cookie.split(";")[0].split("=");
        client.hget('userlogin',userCookie[0],function(err,reply){
           if (reply === null){
               res.writeHead(200,{'Content-Type':'text/html','Set-Cookie':req.headers.cookie+'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
               res.end("<script>location.href='/'</script>");
            }
            else{
                inviterid = JSON.parse(reply);
            }
        });
    }
    var user = (req.url).substring(1);
    client.hget('patreceplogin', user,function(err,reply){
        if (reply !== null){
            cookiecheck = func();
            if (cookiecheck == 'false'){
                file = fs.readFileSync('./html/patient_signup.html').toString();
                res.write(file);
                res.end(); 
            }
            else{
                res.end("<script>location.href='/home'</script>")
            } 
        }
        else if (req.url == "/"){
            cookiecheck = func();
            if (cookiecheck == 'false'){
                file = fs.readFileSync('./html/signup-login.html').toString();
                res.write(file);
                res.end(); 
            }
            else{
                res.end("<script>location.href='/home'</script>");
            }
            
        }
        else if (req.url == "/home"){
            var cookiecheck = func();
            if (cookiecheck == 'true'){
                file = fs.readFileSync('./html/home.html').toString();
                res.write(file);
                res.end(); 
            }
            else{
                res.end("<script>location.href='/'</script>");
            }
        }
        else if (ans.pathname === "/getDetail"){
            client.hget('userlogin', ans.query.id ,function(err,reply){
                res.write(reply);
                res.end();
            });
        }
        else if (ans.pathname == "/getmyApoint"){
            client.hget(inviterid[inviterid.length-1],inviterid[1],function(err,reply){
                res.write(reply);
                res.end();
            });
        }
        else if (ans.pathname == "/getalApoint"){
            var getapoinment;
            if (inviterid[3] == "Doctor"){
                getapoinment = inviterid[1];
            }
            else{
                getapoinment = inviterid[inviterid.length-1];
            }
            client.hget('Doctors' ,getapoinment ,function(err,reply){
                res.write(reply);
                res.end();
            });
        }
        else if (ans.pathname == "/getusrdetails"){
            client.hget('userReports', inviterid[1], function(err,reply){
                res.write(reply);
                res.end();
            });
        }
        else if (ans.pathname == "/getconsult"){
            client.hget('consult',ans.query.Email, function(err,reply){
                if (reply !== null){
                   res.write(reply);
                   res.end();
                }
                else{
                   res.write('false');
                   res.end();
                }
            });
        }
        else if (ans.pathname == "/logout" ){
            res.writeHead(200,{'Content-Type':'text/html','Set-Cookie':req.headers.cookie+'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
            client.hdel('userlogin',ans.query.id);
            res.write('true');
            res.end();
        }
        else if (req.method == 'POST'){
            req.on('data',function(chunk){
                body += chunk;
            });
            req.on('end',function(){
               progValue(body); 
            });
        }
        else{
            res.end("<script>location.href='/'</script>")
        }
    });
    
    function progValue(givVal){
        objct = qrString.parse(givVal);
        if (req.url == "/addDoctor" || req.url == "/login"){ 
            client.hget('userReports', objct.Email , function(err,body){
                if(body !== null ){ 
                    checkUser = JSON.parse(body);
                    if (req.url == "/addDoctor"){
                        res.write("false");
                        res.end();
                    }
                    else if (req.url == "/login"){
                        if (checkUser.Email != objct.Email || checkUser.Password != objct.Password){ 
                            res.write('false');
                            res.end();
                        }
                        else if (checkUser.Email === objct.Email && checkUser.Password === objct.Password ){
                            objct.Clinic = checkUser.Clinic;
                            objct.Role   = checkUser.Role;
                            objct.Name   = checkUser.Name;
                            if (checkUser.Role == 'Patient' || checkUser.Role == 'Receptionist'){
                                objct.Doctor = checkUser.Doctor;
                                userobj = [objct.Name,objct.Email,objct.Clinic,objct.Role,objct.Doctor];
                            }
                            else{
                                userobj = [objct.Name,objct.Email,objct.Clinic,objct.Role];
                            }
                            randmNumb('userlogin');
                        }
                    }
                }
                else{
                    if (req.url == "/addDoctor"){
                        client.hset('userReports',(objct.Email).toString(),JSON.stringify(objct));
                        randmNumb('userlogin');
                    }
                    else{
                        res.write('false');
                        res.end();
                    }
                }
            });
        }
        else if (req.url == "/addRecep" || req.url == "/addPat"){
            client.hget('patreceplogin',objct.id,function(err,reply){
                if (reply !== null){
                    var cookid    = JSON.parse(reply)[objct.Email];
                    var cookiname = cookid.substring(cookid.length/2,cookid.length-3);
                    client.hget('userReports',objct.Email,function(err,reply){
                        var recep = JSON.parse(reply);
                        objct.Doctor = recep.Doctor;
                        objct.Role   = recep.Role;
                        objct.Clinic = recep.Clinic;
                        userobj = [objct.Name,objct.Email,objct.Clinic,objct.Role,objct.Doctor];
                        client.hset('userlogin',(cookid).toString(),JSON.stringify(userobj));
                        res.writeHead(200,{'Content-Type':'text/html','Set-Cookie':cookid+'='+cookiname+'; expires=Thu, 01 Jan 2970 00:00:00 GMT'});
                        client.hdel('patreceplogin',objct.id);
                        client.hdel('userReports',objct.Email);
                        delete objct.id;
                        client.hset('userReports',(objct.Email).toString(),JSON.stringify(objct));
                        res.write('true');
                        res.end();
                    });
                }
                else{
                    res.write('false');
                    res.end();
                }
            });
        }
        else if (req.url == "/sendmailrec" || req.url == "/sendmailpat"){
            if (emailRegex.test(objct.Email) === true){
                client.hget('userReports',objct.Email,function(err,reply){
                    if (reply  === null){
                        if (req.url == "/sendmailrec" ){
                            objct.Role   = 'Receptionist';
                            objct.Doctor =  inviterid[1];
                        }
                        else{ 
                            objct.Role   = 'Patient';
                            objct.Doctor = inviterid[inviterid.length-1];
                        }
                        randmNumb('patreceplogin');
                    }
                    else{ 
                        res.write('false');
                        res.end();
                    }
                });
                
            }
            else{
                res.write('false');
                res.end();
            }
        }
        else if (req.url == "/getpatientmail"){
            client.hget('patreceplogin',objct.id,function(err,body){
                res.write(body);
                res.end();
            });
        }
        else if (req.url == "/applyapoint" || req.url == "/cancelbook"){
            var getapntmnt1;
            var Appointments1 = {};
            var Appointments  = {};
            var timeObj = {};
            var keyobj = objct.Date+" "+objct.Month ;
            client.hget(inviterid[inviterid.length-1], inviterid[1],function(err,reply){
                getapntmnt1 = JSON.parse(reply);
            });
            client.hget('Doctors',inviterid[inviterid.length-1],function(err,reply){
                if (req.url == "/applyapoint"){
                    var onk = {"hai":{}};
                    console.log(onk['hai']);
                    objct.Name  = inviterid[0];
                    objct.Email = inviterid[1];
                    timeObj[objct.Time]  = objct;
                    Appointments1[keyobj] = objct;
                    Appointments[keyobj] = timeObj;
                    if (reply == null){
                        getapntmnt  = Appointments;
                        getapntmnt1 = Appointments1;
                        appointmentset();
                    }
                    else{
                        getapntmnt = JSON.parse(reply);
                        if (getapntmnt[keyobj] == undefined){
                            getapntmnt[keyobj] = timeObj;
                            getapntmnt1[keyobj]= objct;
                            appointmentset();
                        }
                        else if ((getapntmnt[keyobj][objct.Time]) == undefined){
                            if ( JSON.stringify(getapntmnt[keyobj]) == "{}" || getapntmnt1[keyobj].Email !== objct.Email){
                                if (JSON.stringify(getapntmnt[keyobj]) == "{}"){
                                    delete getapntmnt[keyobj]
                                }
                                getapntmnt[keyobj][objct.Time] = objct;
                                getapntmnt1[keyobj]  = objct;
                                appointmentset();
                            }
                            else{
                                res.write('false');
                                res.end();
                            }
                        }
                        else{
                            res.write('false');
                            res.end();
                        }
                    }
                }
                else{
                    if (reply == null){
                        res.write('false');
                        res.end();
                    }
                    else{
                        getapntmnt = JSON.parse(reply);
                        if (getapntmnt[objct.cancelid] != undefined && getapntmnt[objct.cancelid][objct.Time] != undefined){
                            delete getapntmnt[objct.cancelid][objct.Time];
                            delete getapntmnt1[objct.cancelid]
                            console.log(getapntmnt+""+getapntmnt1);
                            appointmentset();
                        }
                    }
                }
                    
            });
            function appointmentset(){
                client.hset('Doctors',(inviterid[inviterid.length-1]).toString(),JSON.stringify(getapntmnt));
                client.hset((inviterid[inviterid.length-1]).toString(),(inviterid[1]).toString(),JSON.stringify(getapntmnt1));
                res.write("true");
                res.end();
            }
        }
        else if (req.url == "/sendpost"){
            var getposts;
            var postobj = {}; var topost;
            if (inviterid[3] == "Doctor"){
                topost = inviterid[1];
            }
            else{
                topost = inviterid[inviterid.length-1];
            }
            client.hget('consult',topost,function(err,reply){
                if (reply == null){
                    postobj[new Date().getTime()] = objct;
                    client.hset('consult',(topost).toString(), JSON.stringify(postobj));
                }
                else{
                    getposts = JSON.parse(reply);
                    getposts[new Date().getTime()] = objct;
                    client.hset('consult',(topost).toString(), JSON.stringify(getposts));
                }
                res.write('true');
                res.end();
            });
            
        }
        else if  (req.url == "/updatepost" || req.url == "/deltpost"){
            if (inviterid[3] == "Doctor"){
                topost = inviterid[1]
            }
            else{
                topost = inviter[inviter.length-1];
            }
            client.hget('consult', topost, function(err,reply){
                getposts = JSON.parse(reply);
                if (getposts[objct.edtime] !== undefined){
                    if (req.url == "/updatepost"){
                        getposts[objct.edtime].Content = objct.Content;
                    }
                    else{
                        delete getposts[objct.edtime];
                    }
                    client.hset('consult',(topost).toString(), JSON.stringify(getposts));
                    res.write('true');
                    res.end();
                }
                else{
                    res.write('false');
                    res.end();
                }
            });
        }
    }
    
    function func(){
        if (req.headers.cookie === undefined){
            return 'false';
        }
        else{
            /*client.hgetall('patreceplogin',function(err,reply){
                
            });*/
            return 'true';
        }
    }
    
    function mailsend(){ 
        client.hget('userlogin', userCookie[0] ,function(err,reply){
            var doc = JSON.parse(reply);
            objct.Clinic = doc[2];
            objct[objct.Email] = randm;
            client.hset('patreceplogin',(randm).toString() , JSON.stringify(objct));
            client.hset('userReports',(objct.Email).toString() , JSON.stringify(objct));
            randnum  = "http://pulse.zcodeusers.com/"+randm;
            var mail = {
                fromAddress:"zupulse@zoho.com",
                toAddress:objct.Email,
                subject:"Create your Pulse Account",
                content:randnum
            };
            request.post({
                url:"https://mail.zoho.com/api/accounts/5516782000000008001/messages",
                headers:{'Authorization':'Zoho-authtoken cca7e62509013d0744a84cb811ed9e50'},
                body:JSON.stringify(mail),
                method :'POST'
            },function(err, response, body){
                res.write('true');
                res.end();
            });
        });
    }
    
    function randmNumb(dbase){
        for (i=0;i<randmtext.length;i++){
            var rannum = Math.floor(Math.random()*randmtext.length);
                randm += randmtext[rannum]; 
        }
        client.hget(dbase,randm,function(err,reply){
            if (reply == null){
                if (req.url == "/sendmailrec" || req.url == "/sendmailpat"){
                    mailsend(); 
                }
                else if (req.url == "/addDoctor" || req.url == "/login"){
                    cookiname = randm.substring(randm.length/2,randm.length-3);
                    client.hmset('userlogin',(randm).toString(),JSON.stringify(userobj));
                    res.writeHead(200,{'Content-Type':'text/html','Set-Cookie':randm+'='+cookiname+'; expires=Thu, 01 Jan 2970 00:00:00 GMT'});
                    res.write('true');
                    res.end();
                }
            }
            else{
               randmNumb(); 
            } 
        });
    }
 
}).listen(8080);
    