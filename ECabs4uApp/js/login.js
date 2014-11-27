
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
   
    if(true)
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

                      var app = new kendo.mobile.Application();
        
              switch (roleID) {
                  //Role 3 --> Driver OR Role 7 --> OperatorCumDriver
                  case 3:
                  case 7:
                  app.navigate( "views/driverHome.html");                 
                      break;
                      //Role 4 --> Customer
                  case 4:
                      app.navigate("views/CustomerProfile.html" );
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

function searchpage()
{
                      var app = new kendo.mobile.Application();
    
    alert("home");
    app.navigate("views/home.html");
}
function myProfile()
{
    var app = new kendo.mobile.Application();
    alert("CustomerProfile");
    app.navigate("views/CustomerProfile.html");
}
function myBooking()
{
    var app = new kendo.mobile.Application();
    app.navigate("views/settings.html");
}
function bookedHistory()
{
    app.navigate( "views/History.html");
}
function logout()
{
    app.navigate( "views/Login.html");
}
