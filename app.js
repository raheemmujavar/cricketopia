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
var server = http.createServer(app).listen(3001);
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

var MatchSchedule = [], FBID = '', FBNAME = '', teaminfo = [], playerinfo = [];

// var fb ;
//  fb  = fb.split("\n").join("");
// console.log('fa'+fb);

function getMatchSchedule(callback){
  db.Match_Schedule.find({},{__v:0}).sort({"startDate" : 1}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
               for(var i = 0; i < docs.length; i++)  
                  { 
                    MatchSchedule.push(docs[i]);
                    if(i === docs.length - 1)
                    {
                      callback();
                    } 
                  };
              }
            }
      });
  }

  function getTeamInfo(team1,team2,callback){
     db.Team_Info.find({teamId:{$in:[team1,team2]}}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                for(var i = 0; i < docs.length; i++)  
                  { 
                    teaminfo.push(docs[i]);
                    if(i === docs.length - 1)
                    {
                      callback();
                    } 
                  };
              }
            }
      });
  }

  function getPlayerInfo(player,callback){
  db.Player_Info.find({playerId : player}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                for(var i = 0; i < docs.length; i++)  
                  { 
                    playerinfo.push(docs[i]);
                    if(i === docs.length - 1)
                    {
                      callback();
                    } 
                  };        
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
     });
    //loginwithfacebook socket ends here

    client.on('getTeamInformation',function(data){
            var team1 = data.team1Id;
            var team2 = data.team2Id;
            console.log('getTeamInformation called');
             getTeamInfo(team1,team2,function(){  
                       client.emit('getTeamInfo',teaminfo);
                      });
    });

     client.on('getPlayerInformation',function(data){
              console.log('getPlayerInformation called');
               getPlayerInfo(data.playerId,function(){  
                         client.emit('getPlayerInfo',playerinfo);
                        });
    });


     client.on('setBidInformation',function(data){
      // console.log('setBidInformation called');
      // console.log('matchId '+data.matchId);
      // console.log('playerId '+data.playerId);
      // console.log('fbid '+data.FBID);
      // console.log('bidamount '+data.bidAmount);
                   db.Player_Bid_Info.update(
                    {"matchId":data.matchId,"playerId":data.playerId},
                    {$addToSet:{bidInfo:{"FBID":data.FBID,"bidAmount":data.bidAmount}}},
                    {upsert:true}, function (err,updated){
                  if(err) console.log(err);
                  else {
                          client.emit('bidsuccess',"Inserted bid information"); 
                          console.log('Bid information is saved');
                       }
                     });
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

