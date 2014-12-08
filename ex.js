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
var server = http.createServer(app).listen(3002);
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

var MatchSchedule = [], FBID = '', FBNAME = '', teaminfo = [], playerinfo = [], teamplayers = [];

var MatchSchedule1 = '',MatchSchedule2 = '';
// var fb ;
//  fb  = fb.split("\n").join("");
// console.log('fa'+fb);
var MatchId =[], MatchType =[], MatchSeriesid = [], MatchNo = [], MatchStartDate = [], MatchTeam1 = [], MatchTeam2 = [];
function getMatchSchedule(data,callback){
 // console.log('data is '+data);



                  { 
                    match = docs[i].matchId;
                    team1 = docs[i].team1.teamId;
                    team2 = docs[i].team2.teamId;
                    MatchId.push(docs[i].matchId);
                   // console.log(docs[i].team1.teamId);
                  //  console.log(docs[i].team2.teamId);
                  console.log(team1);
                    getTeamInfo(docs[i].team1.teamId,docs[i].team2.teamId,function(){
                       team1shortname = teaminfo[1].teamShortName;
                       team2shortname = teaminfo[0].teamShortName;
                       var matchjson = {
                           "matchid" : match,
                           "team1id" : team1,
                           "team2id" : team2,
                           "team1shortname" : team1shortname,
                           "team2shortname" : team2shortname
                       }
                        console.log('match jsno ------'+JSON.stringify(matchjson));
                       
                                MatchSchedule.push(matchjson);

                    // callsback();


                    })
                    
                     //console.log('teaminfo in match schedule '+team1shortname);

                                        
                  };




                  
  db.Match_Schedule.find({matchId:"190482"},{__v:0}).sort({"startDate" : 1}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                
               for(var i = 0; i < docs.length; i++)  
                  { 
                    MatchId.push(docs[i].matchId);
                    MatchType.push(docs[i].mtype);
                    MatchSeriesid.push(docs[i].series_id);
                    MatchNo.push(docs[i].MatchNo);
                    MatchStartDate.push(docs[i].StartDate);
                    MatchTeam1.push(docs[i].team1.teamId);
                    MatchTeam2.push(docs[i].team2.teamId);
                    
                    if(i === docs.length - 1)
                    {
                     // console.log('')
                     
                      s();
                      console.log('match'+MatchSchedule)
                      callback();
                    } 
                  };
              }
            }
      });
  }


  var s = function ()
  {

   MatchSchedule.push('hi');
    MatchSchedule.push('hi');
var MatchSchedule1 = '5';
                   async.eachSeries(MatchId, function(item, callback){
                      db.Match_Schedule.find({matchId:item},{__v:0}).sort({"startDate" : 1}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){                   
                         var team1 =  docs[0].team1.teamId;
                         var team2 =  docs[0].team2.teamId;

                               db.Team_Info.find({teamId : team1}).exec(function(err,docs1){
                                if(err)console.log(err);
                                    else{
                                      if(docs1){
                                       console.log('team logs '+docs1.length);
                                        //console.log('get team information length is -----------------------'+docs.length);
                                        for(var i = 0; i < docs1.length; i++)  
                                          { 
                                            var MatchSchedule1 = {
                                               "matchId" : item,
                                               "team1id"  : team1,
                                                "team1shortname" : docs1[i].teamShortName 
                                             }
                                             MatchSchedule1 = JSON.stringify(MatchSchedule1);
                                             console.log('hello');
                                             MatchSchedule.push('d');

                                          };
                                      }
                                     // callback();
                                    }
                                    
                              });


                   }
                   callback();
            }
         });

                   //find query ends here
                         },      //async first function ends here
                      function(err){

                                              console.log('match schedule1 '+JSON.stringify(MatchSchedule1));

                                MatchSchedule.push(MatchSchedule1);
                });

}
              //end of async module


         // for(var j=0; j<MatchId.length ; j++)
         // {
         //             db.Team_Info.find({teamId : MatchTeam1[j]}).exec(function(err,docs){
         //                if(err)console.log(err);
         //                    else{
         //                      if(docs){
         //                       // console.log('team logs '+docs);
         //                        //console.log('get team information length is -----------------------'+docs.length);
         //                        for(var i = 0; i < docs.length; i++)  
         //                          { 
         //                            var MatchSchedule1 = {
         //                               "matchId" : MatchId[j],
         //                               "team1id"  : MatchTeam1[j],
         //                                "team2id"  : MatchTeam2[j],
         //                                "team1shortname" : docs[i].teamShortName 
         //                             }

         //                              console.log('match schedule1 '+MatchId[0]);

         //                          };
         //                      }
         //                     // callback();
         //                    }
                            
         //              });

         //           //  console.log('match schedule 1 '+MatchSchedule1);

         //             db.Team_Info.find({teamId : MatchTeam2[j]}).exec(function(err,docs){
         //                if(err)console.log(err);
         //                    else{
         //                      if(docs){
         //                       // console.log('team logs '+docs);
         //                        //console.log('get team information length is -----------------------'+docs.length);
         //                        for(var i = 0; i < docs.length; i++)  
         //                          { 
         //                            var MatchSchedule2 = {
         //                               "matchId" : MatchId[j],
         //                               "team1id"  : MatchTeam1[j],
         //                                "team2id"  : MatchTeam2[j],
         //                                "team1shortname" : docs[i].teamShortName 
         //                              }
         //                              console.log('match schedule2 '+MatchSchedule2);

         //                          };
         //                      }
         //                     // callback();
         //                    }
                            
         //              });

         //             var MatchSchedule = {
         //               "team1" : MatchSchedule1,
         //               "team2" : MatchSchedule2
         //             }


         // }

  




  function getTeamInfo(team1,team2,callsback){

             async.parallel([function(callback){
                        db.Team_Info.find({teamId:{$in:[team1,team2]}}).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                //console.log('get team information length is -----------------------'+docs.length);
                                for(var i = 0; i < docs.length; i++)  
                                  { 
                                    teaminfo.push(docs[i]);
                                     for(var j=0;j<docs[i].players.length;j++)
                                          {
                                                teamplayers.push(docs[i].players[j]);
                                          }
                                         //console.log('teamplayers are ------'+teamplayers);


                                    if(i === docs.length - 1)
                                    {
                                      //callsback();

                                    } 
                                  };
                              }
                              callback();
                            }
                            
                      });
},
function(callback){
                    for(var j=0;j<teamplayers.length;j++)
                    {
                     // console.log('players individual '+teamplayers[j]);
                        db.Player_Info.find({playerId : teamplayers[j]}).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                for(var i = 0; i < docs.length; i++)  
                                  { 
                                    playerinfo.push(docs[i]);
                                    if(i === docs.length - 1)
                                    {
                                     // callsback();
                                    } 
                                  };        
                                }
                                
                            }
                      });

                    }
                    callback();
                  }
                         ],      //async first function ends here
                      function(err, results){
                                callsback();
                });


  }

  // function getPlayerInfo(player,callback){
  // db.Player_Info.find({playerId : player}).exec(function(err,docs){
  //       if(err)console.log(err);
  //           else{
  //             if(docs){
  //               for(var i = 0; i < docs.length; i++)  
  //                 { 
  //                   playerinfo.push(docs[i]);
  //                   if(i === docs.length - 1)
  //                   {
  //                     callback();
  //                   } 
  //                 };        
  //               }
  //           }
  //     });
  // }



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

                           getMatchSchedule("xy",function(){  
                              client.emit('getMatchSchedule',MatchSchedule);
                              MatchSchedule=[];
                             
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
                               MatchSchedule=[];
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
                        client.emit('getPlayerInfo',playerinfo);
                       teaminfo = [];
                       playerinfo = [];
                      });
    });

    //  client.on('getPlayerInformation',function(){
    //           console.log('getPlayerInformation called');
    //           //client.emit('getPlayerInfo',playerinfo);
    //            // getPlayerInfo(data.playerId,function(){  
    //            //           client.emit('getPlayerInfo',playerinfo);
    //            //           playerinfo=[];
    //            //          });
    // });


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

