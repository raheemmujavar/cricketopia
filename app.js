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
                            callsback();
                            
                      });


  }

  function getTeamWisePlayers(matchId,team1,team2,maincallback){
  // console.log("match id  ====== " + matchId)
  // console.log("team1 id  ====== " + team1)
  // console.log("team2 id  ====== " + team2)
  var player_info_object = [];
  db.Team_Info.find({teamId:{$in:[team1,team2]}},function(err,docs){
    if(docs){
      var players_list = [];
      for(var i=0;i<docs[0].players.length;i++){
        players_list.push(docs[0].players[i])
      }
      for(var i=0;i<docs[1].players.length;i++){
        players_list.push(docs[1].players[i])
      }
      console.log(players_list.length)
      var j=0;n=players_list.length;
      for(var i=0;i<players_list.length;i++){
        (function(i){
        //  console.log(i + " ====== " + players_list[i] + " -----------------------")
          db.Player_Info.findOne({playerId : players_list[i]},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1},function(err,playerDoc){
            if(err)console.log(err);
            else{
              if(playerDoc){
                //console.log(i + " ====== " + players_list[i])
                db.Player_Bid_Info.aggregate([{$match : {"matchId" : "190482", "playerId" : parseInt(players_list[i])}},{ $unwind : "$bidInfo" }, {$group : {_id : "playerId",average : {$avg : "$bidInfo.bidAmount"}, maximum : {$max : "$bidInfo.bidAmount"} } }]).exec(function(err,data){
                if(err)console.log(err);
                  else{
                    j++;
                    var avg = 0, max = 0;
                    if(data){
                      for(var ii = 0; ii < data.length; ii++)  
                      {
                          avg = data[ii].average;
                          max = data[ii].maximum;
                          //console.log('avg bid information fro '+player+' is '+data[ii].average);
                      };  
                    }
                    var playerjson = {
                      "playerId": playerDoc.playerId,
                      "country" : playerDoc.country,
                      "firstName" : playerDoc.firstName,
                      "lastName" : playerDoc.lastName,
                      "fullname" : playerDoc.fullname,
                      "teamId" : playerDoc.teamId,
                      "average" : avg,
                      "maximum" : max
                    }; 
                    player_info_object.push(playerjson)
                    if(j == n)
                     maincallback(player_info_object)

                  }
                })
              }
            }
          })
        })(i)
        // console.log(i + " ====== " + players_list[i])
      }

      // console.log(docs)
    }
  })
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

     // console.log(data);
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
                        //  console.log('facebook information is update');
                       }
                     });
              }
          
              else{
                        new db.userSchema({_id:data.FBID,FBNAME:data.FBNAME,FBPIC:data.FBPIC,FBCITY:data.FBCITY,FBCOUNTRY:data.FBCOUNTRY,EMAIL:data.EMAIL,deviceToken:data.deviceToken,Credits:500,FriendsList:[]}).save(function(err,document){
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
                           // console.log('facebook information is saved');
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
                                          teaminfo = [];
                                 });
          getTeamWisePlayers(matchId,team1,team2,function(player_info_object){
                       client.emit('getPlayerInfo',player_info_object);
            player_info_object = [];
          })
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


   client.on('InviteFriends',function(data){
    db.userSchema.update({_id : data.FBID},{ $addToSet : {FriendsList : data.acceptedFBID } }).exec(function(err, docs, raw){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){


                                                    db.userSchema.update({_id : data.FBID}, {$inc : { Credits : 200 } }).exec(function(err, data, raw){
                                          if(err)console.log(err);
                                              else{
                                                  if(data){
                                                   // console.log('InviteFriendCreditsssuccess information '+docs.nUpserted);

                                                    client.emit('InviteFriendCreditsssuccess',"Friends Invitation added successfully");
                                              
                                                          }
                                                          else
                                                          {
                                                            console.log('InviteFriend Credits Failed  ');
                                                          }
                                                  }

                                                });
                                                    console.log('InviteFriendssuccess information '+raw);

                                                    client.emit('InviteFriendssuccess',"Friends Invitation added successfully");
                                              
                                                          }
                                                          else
                                                          {
                                                            console.log('InviteFriend Failed information ');
                                                          }
                                                  }

                            });

    });

   client.on('AskFriendsAccept',function(data){
db.userSchema.update({_id : data.FBID}, {$inc : { Credits : 100 } }).exec(function(err, docs, raw){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
                                                    console.log('AskFriends information '+docs.nUpserted);

                                                    client.emit('AskFriendCreditssuccess',"Friends Invitation added successfully");
                                              
                                                          }
                                                          else
                                                          {
                                                            console.log('AskFriend Failed information ');
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

