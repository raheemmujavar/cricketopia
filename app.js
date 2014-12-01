//load local modules
var db = require('./db');

//require necessary modules
var http = require('http')
  , express = require('express')
  , socketIO = require("socket.io")
  , path = require('path');
var _redis = require('redis'),
 redis = _redis.createClient();
 //to run code synchronously 
var async = require('async');
//initialize our application
var app = express();
app.use(express.static(path.join(__dirname, 'assets')));
var server = http.createServer(app).listen(3000);
var io = socketIO.listen(server);

var sub = _redis.createClient();
var pub = _redis.createClient();
//settings
var settings = {
  'view_directory': '/views'
}
var timee = Date.now();
var datediff = new Date(timee);

app.get('/', function(request, response){
  response.sendfile(__dirname + settings.view_directory + '/index.html')
});
app.get('/chat' , function(request, response){
  response.sendfile(__dirname + settings.view_directory + '/chat.html')
});

var MatchSchedule = '', FBID = '', FBNAME = '';

function getMatchSchedule(callback){
  db.MatchSchedule.find({},{__v:0}).sort({"startDate" : 1}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                MatchSchedule = JSON.stringify(docs);
                callback();
              }
            }
      });
  }

   
//chat using socket.io
io.sockets.on('connection', function(client){


    //socket which inserts logged in user information into userSchema.
    client.on('logInWithFacebook',function(data){
         FBID = data.FBID;
         FBNAME = data.FBNAME;

      console.log(data);
      db.userSchema.findById(data.FBID, function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                      db.userSchema.findByIdAndUpdate({_id:data.FBID},{"FBNAME": data.FBNAME,"deviceToken":data.deviceToken}, function(err,docs){
                  if(err) console.log(err);
                  else {
                           getMatchSchedule(function(){  
                              client.emit('getMatchSchedule',MatchSchedule);
                             
                            });
                          client.emit('success',"updated an existing user schema"); 
                          console.log('facebook information is update');
                       }
                     });
              }
          
              else{
                        new db.userSchema({_id:data.FBID,FBNAME:data.FBNAME,FBCITY:data.FBCITY,FBCOUNTRY:data.FBCOUNTRY,EMAIL:data.EMAIL,deviceToken:data.deviceToken}).save(function(err,document){
                      if(err) throw err;
                      else{
                              getMatchSchedule(function(){  
                                client.emit('getMatchSchedule',MatchSchedule);
                               
                              });
                              client.emit('success',"new user record inserted successfully");
                            console.log('facebook information is saved');
                          }
                        });
              }
          }
      });
     //loginwithfacebook socket ends here
    


    });





    //disconnect socket code starts form here
        client.on('disconnect', function  () {
          client.emit('exit',{FBID:FBID,FBNAME:FBNAME});
          console.log('---------------client disconnected with FBID = '+FBID+' and name = '+FBNAME+'------------');
        //     console.log('client disconnected for '+room_name+' and mail_id is '+google_id+'');
          //       redis.srem(room_name, google_id, function (err,reply){ });
            });
        //disconnect socket ends here

});
 //connection socket ends here

redis.on("error", function (err) {
console.log("Error " + err);
});

