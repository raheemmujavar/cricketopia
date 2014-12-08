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

var MatchSchedule = [], FBID = '', FBNAME = '', teaminfo = [], playerinfo = [], playerinfo1 = [], playerIndinfo = [], teamplayers = [], MatchShortNames = [], playerBidinfo = [];

  
  function getMatchSchedule(callback){
      
       db.Match_Schedule.find({}).sort({"startDate" : 1}).limit(6).exec(function(err,docs){
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

  function getTeamInfo(match_Id,team1,team2,callsback){
    console.log(match_Id);

             async.series([function(callback){
                        db.Team_Info.find({teamId:{$in:[team1,team2]}}).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                //console.log('get team information length is -----------------------'+docs.length);
                                for(var i = 0; i < docs.length; i++)  
                                  { 
                                    teaminfo.push(docs[i]);

                                  };
                              }
                            
                            }
                            
                      });
                db.Match_Players.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(match_Id) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ]).exec(function(err,docs){
                                        if(err)console.log(err);
                                            else{
                                              if(docs){
                                               //console.log('docs length '+docs.length);
                                                for(var i = 0; i < docs.length; i++)  
                                                  { 
                                                   // console.log(docs[i].players);
                                                     var array = docs[i].players.toString().split(",");
                                                      for(s in array) {
                                                        teamplayers.push(array[s]);
                                                      }
                                                   };  

                                              }
                                              else
                                              {
                                                 teamplayers.push(0);
                                              }
                                             console.log('first callback');
                                                 callback(null,null);
                                            }  
                                         
                         });



              },
              function(callback){
              //  console.log('teemmm players array ---'+teamplayers+'final');
                                  for(var j=0;j<teamplayers.length;j++)
                                              {
                                               // console.log('players individual '+teamplayers[j]);
                                               db.Player_Info.find({playerId : teamplayers[j]},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1}).exec(function(err,docs){
                                                  if(err)console.log(err);
                                                      else{
                                                        if(docs){
                                                          for(var i = 0; i < docs.length; i++)  
                                                            { 

                                                      
                                                              var playerjson = {
                                                                "playerId": docs[i].playerId,
                                                                "country" : docs[i].country,
                                                                "firstName" : docs[i].firstName,
                                                                "lastName" : docs[i].lastName,
                                                                "fullname" : docs[i].fullname,
                                                                "teamId" : docs[i].teamId
                                                              };
                                                             // console.log('player json '+JSON.stringify(playerjson));

                                                              playerinfo.push(JSON.stringify(playerjson));
                                                              
                                                              if(i === docs.length - 1)
                                                              {
                                                               // callsback();
                                                              } 
                                                            };        
                                                          }
                                                          
                                                      }
                                                });

                                              }
                                              console.log('second callback');
                                              callback(null,null);
                    
                  },
              function(callback){
                               function abcd(pjson){
//                                               var playerjson1 = {"playerId": null,
//                                                   "country" : null,
//                                                   "firstName" : null,
//                                                   "lastName" : null,
//                                                   "fullname" : null,
//                                                   "teamId" : null,
//                                                   "average" : null,
//                                                   "maximum" : null};
                                                
                                              // console.log('players json '+pjson.playerId+' final');
                          db.Player_Bid_Info.aggregate([ {
                              $match : 
                                {
                                  "matchId" : match_Id,
                                  "playerId" : pjson.playerId
                                }
                             },
                             { $unwind : "$bidInfo" }, 
                             {
                             $group : 
                                 {
                                      _id : "playerId",
                                      average : {$avg : "$bidInfo.bidAmount"},
                                      maximum : {$max : "$bidInfo.bidAmount"}
                                 }
                             }]).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              var avg = 0, max = 0;
                              if(docs){
                               // console.log('get team information length is -----------------------'+docs);
                               // playerBidinfo.push(docs)
                           for(var i = 0; i < docs.length; i++)  
                                    {
                                   avg = docs[i].average;
                                   max = docs[i].maximum;
                                     // console.log('avg bid information fro '+pjson.playerId+' is '+docs[i].average);
                                      //console.log('max bid information '+docs[i].maximum);

                                    };  
                              }
                              else
                              {
                                // var avg = 0;
                                // var max = 0;
                              }
                                               var playerjson1 = {
                                                  "playerId": pjson.playerId,
                                                  "country" : pjson.country,
                                                  "firstName" : pjson.firstName,
                                                  "lastName" : pjson.lastName,
                                                  "fullname" : pjson.fullname,
                                                  "teamId" : pjson.teamId,
                                                  "average" : avg,
                                                  "maximum" : max
                                                              }; 

                                  //console.log('player id '+ pjson.playerId);
                                 // console.log('player json in avg '+JSON.stringify(playerjson1));
                                  playerinfo1.push(JSON.stringify(playerjson1));
                                                  
               
      
                                     }  
                            
                               });


                                      //console.log('players json 111  '+pjson.playerId+' final');
                                      if(j == playerinfo.length-1)
                                      {
                                        console.log('third callback'+j);
                                        callback(null,null);
                                      }

                            } 
                          var pjson = {};
                                  for(var j=0;j<playerinfo.length;j++)
                                              {
                                                pjson = JSON.parse(playerinfo[j]);
                                                abcd(pjson);
     


                                              }

                  //  callback();
                  }
                         ],      //async first function ends here
         function(err, results){
                    // console.log('player info array' +playerinfo);
                                callsback();
                                console.log('final code');
                                teamplayers = [];
                                playerinfo1 = [];
                                playerinfo = [];

                });


  }

  function getMatchShortNames(callback)
  {
                    db.Team_Info.find({},{"teamName":1,"teamShortName":1,"_id":0}).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                //console.log('get team information length is -----------------------'+docs.length);
                                for(var i = 0; i < docs.length; i++)  
                                  { 
                                    var s = ''+docs[i].teamName+':'+docs[i].teamShortName+'';

                                    MatchShortNames.push(s);
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
  //  console.log('player '+player);
  db.Player_Info.find({playerId : player}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
               // console.log('get player info '+docs);
                for(var i = 0; i < docs.length; i++)  
                  { 
                    playerIndinfo.push(docs[i]);
                    if(i === docs.length - 1)
                    {
                      callback();
                    } 
                  };        
                }
            }
      });
  }


function getBidInfo(match_Id,player,callback){
  //  console.log('player '+player);
db.Player_Bid_Info.aggregate([ {
        $match : 
          {
            "matchId" : match_Id,
            "playerId" : player
          }
       },
       { $unwind : "$bidInfo" }, 
       {
       $group : 
           {
                _id : "playerId",
                average : {$avg : "$bidInfo.bidAmount"}
           }
       }]).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                               // console.log('get team information length is -----------------------'+docs);
                               // playerBidinfo.push(docs)
                           for(var i = 0; i < docs.length; i++)  
                                    { 
                                      console.log('avg bid information1 '+docs[i])
                                      playerBidinfo.push(docs[i]);
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
                           getMatchShortNames(function(){  
                              client.emit('getMatchShortNames',MatchShortNames);
                              MatchShortNames=[];
                             
                            });

                           getMatchSchedule(function(){  
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
                             getMatchShortNames(function(){  
                              client.emit('getMatchShortNames',MatchShortNames);
                              MatchShortNames=[];
                             
                            });
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
           var matchId = data.matchId;
            console.log('getTeamInformation called');
             getTeamInfo(matchId,team1,team2,function(){  
                       client.emit('getTeamInfo',teaminfo);
                        client.emit('getPlayerInfo',playerinfo1);
                       teaminfo = [];
                       playerinfo1 = [];
                      });
    });

     client.on('getPlayerInformation',function(data){
              console.log('getPlayerInformation called');
                   getPlayerInfo(data.playerId,function(){  
                     client.emit('getIndPlayerInfo',playerIndinfo);
                         playerIndinfo=[];
                        });
    });

   client.on('getBidInformation',function(data){
              console.log('getBidInformation called');
               getBidInfo(data.matchId,data.playerId,function(){  
                        client.emit('getBidInfo',playerBidinfo);
                         playerBidinfo=[];
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


     client.on('updateBidInformation',function(data){
      // console.log('setBidInformation called');
      // console.log('matchId '+data.matchId);
      // console.log('playerId '+data.playerId);
      // console.log('fbid '+data.FBID);
      // console.log('bidamount '+data.bidAmount);

                            db.Player_Bid_Info.aggregate([
                          
                             { $unwind : "$bidInfo" },
                                {
                              $match : 
                                {
                                  "matchId" : data.matchId,
                                  "playerId" : data.playerId,
                                  "bidInfo.FBID" : data.FBID
                                }
                             }

                        ]).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
                                                              for(var i = 0; i < docs.length; i++)  
                                                                                          { 
                                                      var bid = JSON.stringify(docs[i]);
                                                       console.log('player bid information individual ------'+docs[i].bidInfo.bidAmount);
                                                       if(data.bidAmount>docs[i].bidInfo.bidAmount)
                                                       {

                                         db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId,"bidInfo.FBID":data.FBID}, {"$set" : {"bidInfo.$.bidAmount" : data.bidAmount}}, function (err,updated){
                                        if(err) console.log(err);
                                        else {
                                                client.emit('bidupdatesuccess',"Updated bid information"); 
                                                console.log('Bid information is updated');
                                             }
                                           });

                                                       }
                                                       else
                                                       {
                                                        client.emit('bidupdatefail',"Bid should be greater than previous bid"); 

                                                       }
                                                              
                                                            }
                                                          }
                                                  }

                            });


    });




     client.on('deleteBidInformation',function(data){
      // console.log('setBidInformation called');
      // console.log('matchId '+data.matchId);
      // console.log('playerId '+data.playerId);
      // console.log('fbid '+data.FBID);
      // console.log('bidamount '+data.bidAmount);

                           db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId}, {"$pull" : {"bidInfo":{"FBID":data.FBID}}}).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
                                                    //console.log('delete bid information'+docs);

                                                    client.emit('deleteBidsuccess',"Bid information is deleted successfully");
                                              
                                                          }
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

