$(document).ready(function(){
   var patlist;
   var ans = window.location.href.split("/");
   $.post("/getpatientmail",{
       'id' : ans[ans.length-1]
   },function(data,status){
       patlist = JSON.parse(data);
       $("#email").val(patlist.Email);
   });
   
   $("#createpat").click(function(){
       var name   = $("#name").val();
       var phone  = $("#phone").val();
       var dob    = $("#dob").val();
       var gender = $(".gender").val();
       var paswd  = $("#paswd").val();
       var paswd1 = $("#paswd1").val();
       $.post("/addRecep",{
           "Email":patlist.Email,
           "Phone":phone,
           "Name" :name,
           "Dob"  : dob,
           "Gender": gender,
           "Password":paswd,
           "id" : ans[ans.length-1]
       },function(data,status){
           if (data == 'true'){
              location.href="/home";
           }
       });
    });
    
});  