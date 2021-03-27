/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

 var token;
 const app = {};
 app.apiUrl = 'https://api.spotify.com/v1'

 function generateRandomString(length)
 {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

   for (var i = 0; i < length; i++)
   {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }

   return text;
 };

 /**
  * Obtains parameters from the hash of the URL
  * @return Object
  */
 function getHashParams()
 {
   var hashParams = {};
   var e, r = /([^&;=]+)=?([^&;]*)/g,
       q = window.location.hash.substring(1);
   while ( e = r.exec(q))
   {
      hashParams[e[1]] = decodeURIComponent(e[2]);
   }
   return hashParams;
 }

 function runScrape()
 {
   console.log("Scrape initiated...");
   // Send HTTP Get request with token, parameters
   const HTTP = new XMLHttpRequest();
   if (token)
   {
     console.log("Token is valid, write initiated...");
     var writeComplete = true;
     var jsonFinal = [{}];

    // while (writeComplete = true)
     //{

       $.ajax({
         url: 'https://api.spotify.com/v1/me/tracks?limit=50',
         type: 'GET',
         headers: {
           'Authorization' : 'Bearer ' + token
         },
         success: function(data)
         {
           console.log("Write in progress...");
           console.log(data);
           //jsonFinal.push(data);
           $.extend(jsonFinal, data);
           //jsonFinal = jsonFinal.concat(data);
           console.log(Object.keys(jsonFinal).length);
           if (Object.keys(data).length < 50)
           {
             console.log("Complete");
             writeComplete = false;
             downloadObjectAsJson(jsonFinal, "test");
           }
         }
       });
     //}

     //Check for directory existence, if not, create.
     // const dir = './data';
     // if (!fs.existsSync(dir))
     // {
     //   fs.mkdirSync(dir,
     //     {
     //       recursive: true
     //     });
     //   }
     //
     //   //Write jsonFinal to file.
     //   // TODO: Check for existence of file, if exists, copy old file to jsonOld write new to jsonNew. Save with dates??
     //   fs.writeFile(dir+'/test.txt', jsonFinal, function(err)
     //   {
     //     if (err) {
     //       console.log(err);
     //     }
     //   });



     }
     else (console.log("Token not defined."))
   }

 //TODO: Test to ensure file is not undefined or empty
 function downloadObjectAsJson(exportObj, exportName)
 {
   var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
   var downloadAnchorNode = document.createElement('a');
   downloadAnchorNode.setAttribute("href",     dataStr);
   downloadAnchorNode.setAttribute("download", exportName + ".json");
   document.body.appendChild(downloadAnchorNode); // required for firefox
   downloadAnchorNode.click();
   downloadAnchorNode.remove();
 }
 //Code taken directly from Spotify API tutorial, honestly still need to learn how it works. It seems kinda... messy? Just like it's calling things all over the place.
 function runOnStart()
 {
   var stateKey = 'spotify_auth_state';

   var userProfileSource = document.getElementById('user-profile-template').innerHTML,
       userProfileTemplate = Handlebars.compile(userProfileSource),
       userProfilePlaceholder = document.getElementById('user-profile');

       oauthSource = document.getElementById('oauth-template').innerHTML,
       oauthTemplate = Handlebars.compile(oauthSource),
       oauthPlaceholder = document.getElementById('oauth');

   var params = getHashParams();

   var access_token = params.access_token,
       state = params.state,
       storedState = localStorage.getItem(stateKey);

    token = params.access_token;

   if (access_token && (state == null || state !== storedState))
   {
     alert('There was an error during the authentication');
   }
   else {
     localStorage.removeItem(stateKey);
     if (access_token)
     {1
       $.ajax({
           url: 'https://api.spotify.com/v1/me',
           headers: {
             'Authorization': 'Bearer ' + access_token
           },
           success: function(response) {
             userProfilePlaceholder.innerHTML = userProfileTemplate(response);

             $('#login').hide();
             $('#loggedin').show();

             oauthPlaceholder.innerHTML = oauthTemplate({access_token: access_token});
           }
       });
     }
     else
     {
         $('#login').show();
         $('#loggedin').hide();
     }
     document.getElementById('login-button').addEventListener('click', function()
     {

       //SET CLIENT_ID AND REDIRECT HERE.
       var client_id = 'dea932aee6d04a5187ab1fccc20c40bd'; // Your client id
       var redirect_uri = 'http://localhost:8888/'; // Your redirect uri

       var state = generateRandomString(16);

       localStorage.setItem(stateKey, state);
       //SET REQUESTED PERMISSIONS HERE
       var scope = 'user-read-private user-read-email user-library-read';

       var url = 'https://accounts.spotify.com/authorize';
       url += '?response_type=token';
       url += '&client_id=' + encodeURIComponent(client_id);
       url += '&scope=' + encodeURIComponent(scope);
       url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
       url += '&state=' + encodeURIComponent(state);

       window.location = url;
     }, false);
   }
 }
