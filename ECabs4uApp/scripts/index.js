document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
   navigator.splashscreen.hide();
   document.addEventListener("backbutton",confirmExit, false);
    
    var devicename = device.name;
    var platform = device.platform
    var deviceuuid = device.uuid    
    var model = device.model   
    var version = device.version 
    
       $.ajax({
           url:"http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/RegisterDevice",
           type:"post",
           datatype: "json",
           data:"{'devicename':'"+devicename+"', 'platform':'"+platform+"', 'deviceuuid':'"+deviceuuid+"', 'model':'"+model+"', 'version':'"+version+"'}",
           contentType: "application/json; charset=utf-8",
       });
    loginUsingCookie();
    checkConnection();
}

function confirmExit()
{
    navigator.notification.confirm(
      'Do you want to close the app?',
      onCallback,
      'Confirm exit from Ecabs4u',
      'No, Yes'    
    );
}
function onCallback(buttonIndex)
{
    if(buttonIndex === 1)
    {
        return false;
    }
    else if(buttonIndex === 2)
    {
        navigator.app.exitApp();
        return true;
    }
}

//login using cookie

function loginUsingCookie() {
    console.log('in login using cookie');
    var name = window.localStorage.getItem('userName');
    var password= window.localStorage.getItem('userPassword');
    var remMe = window.localStorage.getItem('remember');
    
    
    if (remMe === "true") {
        console.log('in true');
        $('#txtUserName').val(name);
        $('#txtPassword').val(password);
        login();
    }    
}

function forgotPass()
{
    window.location ="forgotPassword.html";
}

function forgotUser()
{
    window.location ='forgotUsername.html';
}

function login() {
    var name = $('#txtUserName').val();
    var password = $('#txtPassword').val();

    if (name.length > 0) {
        $('#lblMsg').text("");
    }
    else if (name.length === 0) {
        $('#lblMsg').text("Please Enter Username.");
        $('#txtUserName').focus();
        return false;
    }
    if (password.length > 0) {
        $('#lblMsg').text("");
    }
    else if (password.length === 0) {
        $('#lblMsg').text("Please Enter Password.");
        $('#txtPassword').focus();
        return false;
    }
    var isTrue = checkConnection();
    if(isTrue)
    {        
        var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/UserLogin";
        $.ajax(url, {
            beforeSend: function() 
            {
                $('#imgLoader').show();
            },
            type: "POST",
            datatype: "json",
            data: "{'username':'" + name + "','userpassword':'" + password + "'}",
            contentType: "application/json; charset=utf-8",
            success: CheckMsg,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
}

 function CheckMsg(data) {
      //var isloggedin = data.d[4];
      var userID = data.d[1];
      var isChecked = $('#chkRem').prop('checked') ? true : false;
      //if (isloggedin === "True") {
      //    //window.location = 'SessionError.html?id=' + userID;
      //    
      //}
      //else {
          if (data.d[0] === "true") {
              $('#imgLoader').show();

              var roleID = parseInt(data.d[2]);
              var relatedID = data.d[3];

              var name = $('#txtUserName').val();
              var password = $('#txtPassword').val();

              //creating Cookie       
              
              if (isChecked === true) {
                  window.localStorage.setItem('userName',name);
                  window.localStorage.setItem('userPassword',password);
                  window.localStorage.setItem('remember',true);                 
              }
              else {
                  window.localStorage.setItem('userName','');
                  window.localStorage.setItem('userPassword','');
                  window.localStorage.setItem('remember',false);                  
              }

              switch (roleID) {
                  //Role 3 --> Driver OR Role 7 --> OperatorCumDriver
                  case 3:
                  case 7:
                      window.location = 'driverHome.html?id=' + userID + '&rid=' + roleID + '&rrid=' + relatedID;
                      break;
                      //Role 4 --> Customer
                  case 4:
                      window.location = 'customerSearch.html?id=' + userID + '&rid=' + roleID + '&rrid=' + relatedID;
                      break;
              }
          }
          else {
              $('#imgLoader').hide();
              var unauthorised = data.d[0];
              if(unauthorised == "EmailNotVerified")
              {
                  $('#myInputhidden').val(data.d[1]);
                  $('#txtPassword').val("");
                  $('#lblMess1').show();
                  $('#aEmailResndVerificationLink').show();
                  $('#lblMess2').show();
              }
              else if(unauthorised == "BlockedLoginAttempt")
              {
                  $('#myInputhidden').val(data.d[1]);
                  $('#txtPassword').val("");
                  $('#lblResMess1').show();
                  $('#aresendResendpwdlink').show();
                  $('#lblResMess2').show();
              }
              else
              {
                  $('#lblMsg').text(data.d);
                  $('#lblMsg').css("color", "#D70007");
                  $('#lblMsg').css("font-size", "13");
                  $('#txtPassword').val("");
              }              
          }
     // }
 }

function resendEmailVerification(){
    $('#imgLoader').hide();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    
    var userid = $('#myInputhidden').val();    
    var intsOnly = /^\d+$/;    
    if(intsOnly.test(userid)) {
        if(userid != "" || userid != " "){    
            var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/lnkbtnresendVerificationLink";
            $.ajax(url, {
                beforeSend: function() 
                {
                    $('#imgLoader').show();
                },
                type: "POST",
                datatype: "json",
                data: "{'useridfromPage':'" + userid + "'}",
                contentType: "application/json; charset=utf-8",
                success: successEmailSend,
                error: function (XMLHttpRequest, textStatus, errorThrown) {                    
                }
            });
        }
    }
}

function successEmailSend(data)
{
    $('#imgLoader').hide();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblMsg').text(data.d[1]);
    $('#lblMsg').css("color", "#D70007");
    $('#lblMsg').css("font-size", "13");
    $('#myInputhidden').val("");
}

function resetpwdlnk(){
    $('#imgLoader').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    
    var username = $('#myInputhidden').val();
    if(username !="" || username != " ")
    {
        var url = "http://ecabs4uservice.azurewebsites.net/ECabs4U.asmx/lnkbtnResendpwdlink";
        $.ajax(url, {
            beforeSend: function() {
                $('#imgLoader').show();
            },
            type: "POST",
            datatype: "json",
            data: "{'usernamefrompage':'" + username + "'}",
            contentType: "application/json; charset=utf-8",
            success: successPWDLink,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
            }
        });
    }
}

function successPWDLink(data)
{
    $('#imgLoader').hide();
    $('#lblResMess1').hide();
    $('#aresendResendpwdlink').hide();
    $('#lblResMess2').hide();
    $('#lblMess1').hide();
    $('#aEmailResndVerificationLink').hide();
    $('#lblMess2').hide();
    $('#lblMsg').text(data.d[1]);
    $('#lblMsg').css("color", "#D70007");
    $('#lblMsg').css("font-size", "13");
    $('#myInputhidden').val("");
}



