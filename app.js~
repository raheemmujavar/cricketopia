//load local modules
var db = require('./db');
var redisip = '127.0.0.1';
//var redisip = 'quizredis.qnsdtp.0001.apse1.cache.amazonaws.com';
//require necessary modules
var http = require('http')
  , express = require('express')
  , socketIO = require("socket.io")
  , path = require('path');
var _redis = require('redis'),


 redis = _redis.createClient(6379,redisip);
 //to run code synchronously 
var async = require('async');
//initialize our application
var app = express();
app.use(express.static(path.join(__dirname, 'assets')));
var server = http.createServer(app).listen(3002);
var io = socketIO.listen(server);
var stdev = require( 'compute-stdev' );
var sub = _redis.createClient(6379,redisip);
var pub = _redis.createClient(6379,redisip);
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

var MatchSchedule = [], FBID = '', userplayersarr = [], Credits = '', FBNAME = '', teaminfo = [], playerinfo = [], playerinfo1 = [], playerIndinfo = [], teamplayers = [], MatchShortNames = [], playerBidinfo = [];

  var data = new Array( 10 );

for ( var i = 0; i < data.length; i++ ) {
    data[ i ] = i;
}

console.log('standard deviation is '+ stdev( data ) );

  function getMatchSchedule(FBID,callback){
     db.userSchema.find({"_id":FBID},{Credits : 1}).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                console.log('credits docs '+docs);
                           for(var i = 0; i < docs.length; i++)  
                                  { 
                                    Credits = {credits : docs[i].Credits};
                                    console.log('credits are '+docs[i].Credits);
                                   };
              }          
            }
      });
      
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
  //end of getMatchschedule function


  function getTeamInfo(match_Id,team1,team2,FBID,callsback){
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
  //end of getTeamInfo function

//db.Match_Players.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(match_Id) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ])

  function getTeamWisePlayers(matchId,team1,team2,FBID,maincallback){
      var player_info_object = [];
      db.Match_Players.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(matchId) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ],function(err,docs){
          if(docs.length>0){
                var players_list = [];
                for(var i=0;i<docs[0].players.length;i++){
                  players_list.push(docs[0].players[i])
                }
                for(var i=0;i<docs[1].players.length;i++){
                  players_list.push(docs[1].players[i])
                }
                //console.log(players_list)
                var j=0;n=players_list.length;
                for(var i=0;i<players_list.length;i++){
                     (function(i){

          // execute random bid information
         // db.Player_Bid_Info.update(
         //                    {"matchId":matchId,"playerId":players_list[i]},
         //                    {$addToSet:{bidInfo:{"FBID":parseInt(random(58487587854875,58487587854950)).toString(),"bidAmount":parseInt(random(50,200)),"deleted":0,"playerAdded":"no"}}},
         //                    {upsert:true}, function (err,updated){
         //                  if(err) console.log(err);
         //                  else {
         //                            console.log('Bid information is saved');
         //                       }
         //                     });

                            db.Player_Info.findOne({playerId : players_list[i]},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1, image : 1, pic_url : 1, batting_info : 1, bowling_info : 1},function(err,playerDoc){
                            if(err)console.log(err);
                            else{
                              if(playerDoc){

                                //console.log(i + " ====== " + players_list[i])
                                db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{$match : {"matchId" : matchId, "playerId" : parseInt(players_list[i]), "bidInfo.deleted":0}}, {$group : {_id : "playerId",average : {$avg : "$bidInfo.bidAmount"}, maximum : {$max : "$bidInfo.bidAmount"} } }]).exec(function(err,data){
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

                                      db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{ $match :{ "matchId" : matchId,"playerId" :parseInt(players_list[i]),"bidInfo.FBID" : FBID}}]).exec(function(err, biddata){
                                          if(err)console.log(err);
                                              else{
                                                var indbid = 0,biddelete = 0;
                                                  if(biddata){
                                                              for(var i = 0; i < biddata.length; i++)  
                                                                                          { 
                                                              var bid = JSON.stringify(biddata[i]);
                                                              indbid = biddata[i].bidInfo.bidAmount;
                                                              biddelete = biddata[i].bidInfo.deleted;
                                                              }
                                                     
                                                        }
                                                var playerjson = {
                                                      "matchId" : matchId,
                                                      "playerId": playerDoc.playerId,
                                                      "country" : playerDoc.country,
                                                      "firstName" : playerDoc.firstName,
                                                      "lastName" : playerDoc.lastName,
                                                      "fullname" : playerDoc.fullname,
                                                      "teamId" : playerDoc.teamId,
                                                      "batting_info" : playerDoc.batting_info,
                                                      "bowling_info" : playerDoc.bowling_info,
                                                      "localimage" : playerDoc.image,
                                                      "pic_url" : playerDoc.pic_url,
                                                      "average" : avg,
                                                      "maximum" : max,
                                                      "bid" : indbid,
                                                      "deleted" : biddelete
                                                    }; 
                                              player_info_object.push(playerjson);
                                             } 
                                             //end of ind player bid info aggregate else 
                                            })
                                            //end of ind player bid info aggregate query
                                    if(j == n)
                                       {
                                             maincallback(player_info_object)
                                      }
                                      //put this callback under else where we have to increase j++ value
                            
                                    }
                                     //end of player bid info avg aggregate else 
                                  })
                                //end of player bid info avg aggregate else
                              }
                              //end of if(playerdoc)
                            }
                            //end of playerdoc else Player_Info
                          })
                         //end of playerdoc Player_Info query
        })(i)
        // console.log(i + " ====== " + players_list[i])
      }
      //end of for loop player list

      // console.log(docs)
    }
    else
    {
      player_info_object.push({players : "squad is not finalized"});
      maincallback(player_info_object)

    }
    //end of if(doc) Team_info
  })
  //end of Team_Info query
}
//end of getTeamWisePlayers function


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
  db.Player_Bid_Info.aggregate([ {$match : { "matchId" : match_Id, "playerId" : player}}, { $unwind : "$bidInfo" }, {$group :{_id : "playerId",average : {$avg : "$bidInfo.bidAmount"}}}]).exec(function(err,docs){
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


function getUserPlayers(match_Id,FBID,callback){
db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{$match : {"matchId" : match_Id, "bidInfo.FBID" : FBID} }]).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                  var j=0;var nn=docs.length;
                                  for(var i = 0; i < docs.length; i++)  
                                    { 
                                        (function(i){
                                           db.Player_Info.findOne({playerId : docs[i].playerId},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1, image : 1, pic_url : 1},function(err,playerDoc){
                                              if(err)console.log(err);
                                              else{
                                                if(playerDoc){

                                                  //console.log(i + " ====== " + players_list[i])
                                                  db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{$match : {"matchId" : "190482", "playerId" : 63215, "bidInfo.deleted":0}}, {$group : {_id : "playerId",average : {$avg : "$bidInfo.bidAmount"}, maximum : {$max : "$bidInfo.bidAmount"} } }]).exec(function(err,data){
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

                                                       var userplayers = {
                                                            "matchId" : docs[i].matchId,
                                                            "playerId" : docs[i].playerId,
                                                            "country" : playerDoc.country,
                                                            "firstName" : playerDoc.firstName,
                                                            "lastName" : playerDoc.lastName,
                                                            "fullname" : playerDoc.fullname,
                                                            "teamId" : playerDoc.teamId,
                                                            "localimage" : playerDoc.image,
                                                            "pic_url" : playerDoc.pic_url,
                                                            "average" : avg,
                                                            "maximum" : max,
                                                            "bidAmount" : docs[i].bidInfo.bidAmount,
                                                            "deleted" : docs[i].bidInfo.deleted 
                                                                              }
                                                       userplayersarr.push(userplayers);
                              
                                                       if(j == nn)
                                                          {
                                                              callback()
                                                          } 
                                                      //end of else avg player bid info aggregate
                                                     } 
                                                  //end of avg player bid info aggregate   
                                                  })                                                 
                                                //end of if(playerdoc)
                                                } 
                                              //end of else of playerdoc                                                     
                                              }
                                           //end of findone of aggregate    
                                           })
 
                                        })(i)
                                   //end of for loop   
                                   }
                               //end of if(docs)    
                               }
                           //end of else of main query    
                           }
                       //end of query   
                       });
  }


function random (low, high) {
    return Math.random() * (high - low) + low;
}

function ex()
{
  var d= new Date();
  console.log(d.getSeconds());
   console.log(d.getMinutes());
   console.log(d.getHours());
   console.log(d.getDate());
   console.log(d.getFullYear());

  console.log('time for quizinga ' +d.getMinutes()*60+d.getSeconds());
}

ex();


function redis1(match_Id){

      db.Match_Players.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(match_Id) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ],function(err,docs){
          if(docs.length>0){
                var players_list = [], nn;
                for(var i=0;i<docs[0].players.length;i++){
                  players_list.push(docs[0].players[i])
                }
                for(var i=0;i<docs[1].players.length;i++){
                  players_list.push(docs[1].players[i])
                }
                //console.log(players_list)
                var j=0;nn=players_list.length;
                for(var k=0;k<players_list.length;k++){
                     (function(k){
                      console.log(players_list[k]);

                              redis.scard("bidarray"+match_Id+""+players_list[k]+"",function(err,resp){
                              if(err){console.log(err)}
                                else 
                                {
                                  if(resp>=10)
                                  {
                                     redis.smembers("bidarray"+match_Id+""+players_list[k]+"",function(err,members){
                                      if(err) {console.log(err)}
                                        else
                                        {
                                          if(members)
                                          {
                                            var temp = 0;
                                                for(var i =0 ;i<members.length ; i++){
                                                  var pmem = JSON.parse(members[i]);
                                                   if(pmem.amount>temp)
                                                   {
                                                       temp=pmem.amount;
                                                     }
                                                }
                                               // redis.srem("bidarray19048263215","{\"FBID\":\"1245687985878551\",\"amount\":100}")
                                                for(var i =0 ;i<members.length ; i++){
                                                  var pmem = JSON.parse(members[i]);
                                                  if(pmem.amount==temp)
                                                        {
                                                          db.Player_Bid_Info.update({"matchId":"190482","playerId":63215,"bidInfo.FBID":pmem.FBID}, {"$set" : {"bidInfo.$.playerAdded" : "yes"}},function (err, updated){
                                                            if(err) {console.log(err)}
                                                              else
                                                              {
                                                                if(updated)
                                                                {
                                                                  console.log('player assigned  successfully for '+pmem.FBID+'with bid amount of '+pmem.amount);
                                                                  redis.srem("bidarray"+match_Id+""+players_list[k]+"","{\"FBID\":\""+pmem.FBID+"\",\"amount\":"+pmem.amount+"}")


                                                                }
                                                              }
                                                          })
                                                          // console.log('redis members are '+pmem.FBID+' and amount is '+pmem.amount);
                                                        }

                                                        
                                                }


                                          }
                                        }
                                     });
                                    console.log('redis length is '+resp);
                                  }
                                }
                          })


                     }(k))

                }
          }
      })
     





        // redis.scard("bidarray19048263215",function(err,resp){
        //     if(err){console.log(err)}
        //       else 
        //       {
        //         if(resp>=10)
        //         {
        //            redis.smembers("bidarray19048263215",function(err,members){
        //             if(err) {console.log(err)}
        //               else
        //               {
        //                 if(members)
        //                 {
        //                   var temp = 0;
        //                       for(var i =0 ;i<members.length ; i++){
        //                         var pmem = JSON.parse(members[i]);
        //                          if(pmem.amount>temp)
        //                          {
        //                              temp=pmem.amount;
        //                            }
        //                       }
        //                      // redis.srem("bidarray19048263215","{\"FBID\":\"1245687985878551\",\"amount\":100}")
        //                       for(var i =0 ;i<members.length ; i++){
        //                         var pmem = JSON.parse(members[i]);
        //                         if(pmem.amount==temp)
        //                               {
        //                                 db.Player_Bid_Info.update({"matchId":"190482","playerId":63215,"bidInfo.FBID":pmem.FBID}, {"$set" : {"bidInfo.$.playerAdded" : "yes"}},function (err, updated){
        //                                   if(err) {console.log(err)}
        //                                     else
        //                                     {
        //                                       if(updated)
        //                                       {
        //                                         console.log('player assigned  successfully for '+pmem.FBID+'with bid amount of '+pmem.amount);
        //                                         redis.srem("bidarray19048263215","{\"FBID\":\""+pmem.FBID+"\",\"amount\":"+pmem.amount+"}")


        //                                       }
        //                                     }
        //                                 })
        //                                 // console.log('redis members are '+pmem.FBID+' and amount is '+pmem.amount);
        //                                 }

                                      
        //                       }


        //                 }
        //               }
        //            });
        //           console.log('redis length is '+resp);
        //         }
        //       }
        // })
}
//edis1(190482);


//console.log('random value is '+parseInt(random(50,200)).toString();
function createPrivateLeague(leagueData,callback){
  var league_obj = {},users = [];
  db.Leagues_Info.findOne({createdBy:leagueData.FBID,matchId:leagueData.matchId},function(err1,leagueDoc){
    if(err1)
      console.log(" error in find the league")
    else{
      if(leagueDoc){
        console.log("league already exists")
        callback()
      }else{
        users.push(leagueData.FBID)
        league_obj.matchId = leagueData.matchId;
        league_obj.leagueName = leagueData.leagueName;
        league_obj.createdBy = leagueData.FBID;
        league_obj.users = users;
        var league_info_object = new db.Leagues_Info(league_obj)
        league_info_object.save(function(err,rec){
          if(err)
            console.log("error in saving league " + err)
          else{
            console.log(rec)
            callback()
          }
        })
      }
    }
  })
  
}
function createPublicLeague(leagueData,callback){
  var league_obj = {},users = [];
  console.log(leagueData)
  var publicLeagueName = "publicLeague" + leagueData.matchId;
  db.Leagues_Info.findOne({matchId:leagueData.matchId,leagueName:publicLeagueName},function(err1,leagueDoc){
    if(err1)
      console.log(" error in find public league" + err1)
    else{
      if(leagueDoc){
        // leagueDoc.users.push()
        db.Leagues_Info.update({matchId:leagueData.matchId,leagueName:publicLeagueName},{$addToSet:{users:leagueData.FBID}},function(err1,updateDocs){
          console.log(updateDocs)
          console.log("public league updated")
          callback()
        })
        
      }else{
        users.push(leagueData.FBID)
        league_obj.matchId = leagueData.matchId;
        league_obj.leagueName = publicLeagueName;
        league_obj.createdBy = leagueData.FBID;
        league_obj.users = users;
        var league_info_object = new db.Leagues_Info(league_obj)
        league_info_object.save(function(err,rec){
          if(err)
            console.log("error in saving league " + err)
          else{
            console.log(rec)
            callback()
          }
        })
      }
    }
  })
  
}

function joinLeague(leagueData,callback){
  var league_obj = {},users = [];
  db.Leagues_Info.findOne({_id:leagueData.leagueId},function(err1,leagueDoc){
    if(err1)
      console.log(" error in find the league")
    else{
      if(leagueDoc){
        db.Leagues_Info.update({_id:leagueData.leagueId},{$addToSet:{users:leagueData.FBID}},function(err1,updateDocs){
          console.log(" private league updated")
          callback()
        })
        
      }else{
        console.log("league not found")
      }
    }
  })  
}


function PlayerAssign(callsback){
  var playerbids = [];


     db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{$match :  { "matchId" : "190482", "bidInfo.FBID" : "58487587854936", "bidInfo.deleted":0}}]).exec(function(err,dataFBID){
              if(err)console.log(err);
                else{
                   if(dataFBID){
                      for(var i = 0; i < dataFBID.length; i++)  
                          {
                             var bidplayerid = dataFBID[i].playerId;
                             var bidplayeramount = dataFBID[i].bidInfo.bidAmount;
                          

                              db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{$match :  { "matchId" : "190482", "playerId" : bidplayerid, "bidInfo.deleted":0}}]).exec(function(err,data){
                                  if(err)console.log(err);
                                    else{
                                       if(playerDoc){
                                       // console.log('data length'+data.length);
                                          for(var i = 0; i < playerDoc.length; i++)  
                                          {
                                           playerbids.push(playerDoc[i].bidInfo.bidAmount);
                                          }; 
                                        }
                                        var playerstdev = stdev(playerbids)
                                        if(bidplayeramount>=playerstdev)
                                        {
                                          console.log('players above bid '+playerId+' at bid amount of '+bidplayeramount+' stdev is '+playerstdev);
                                        }
                                        //console.log('playerbids array '+stdev(playerbids));
                                    }
                              });
                        }
                    }
                  }
      });
         


}

//PlayerAssign();

//chat using socket.io
io.sockets.on('connection', function(client){


    //socket which inserts logged in user information into userSchema.
    client.on('logInWithFacebook',function(data){
   // data.FBID = parseInt(random(58487587854875,58487587854950)).toString();
                   FBID = data.FBID;
                   FBNAME = data.FBNAME;
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

                                           getMatchSchedule(FBID,function(){  
                                                client.emit('getMatchSchedule',MatchSchedule);
                                                client.emit('getCredits',Credits);
                                                  MatchSchedule=[];
                                             
                                            });
                         
                                          client.emit('success',"updated an existing user schema"); 
                                        //  console.log('facebook information is update');
                                       }
                                     });
                              }
                          
                              else{
                                        new db.userSchema({_id:data.FBID,FBNAME:data.FBNAME,FBPIC:data.FBPIC,FBCITY:data.FBCITY,FBCOUNTRY:data.FBCOUNTRY,EMAIL:data.EMAIL,deviceToken:data.deviceToken,Credits:500,FriendsList:[],CreditsInfo:[{"credit":0,"debit":0,"All_Credits":500,"comment":"Initial State","Created_Date":new Date()}]}).save(function(err,document){
                                      if(err) throw err;
                                      else{
                                             getMatchShortNames(function(){  
                                              client.emit('getMatchShortNames',MatchShortNames);
                                              MatchShortNames=[];
                                             
                                            });
                                              getMatchSchedule(FBID,function(){  
                                                client.emit('getMatchSchedule',MatchSchedule);
                                                client.emit('getCredits',Credits);

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
                 getTeamInfo(matchId,team1,team2,data.FBID,function(){  
                           client.emit('getTeamInfo',teaminfo);
                                              teaminfo = [];
                                     });
              getTeamWisePlayers(matchId,team1,team2,data.FBID,function(player_info_object){
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
      // console.log('FBID at setBidInformation '+data.FBID);
      // console.log('matchId at setBidInformation '+data.matchId);
      // console.log('playerId at setBidInformation '+data.playerId);
      // console.log('bidAmount at setBidInformation '+data.bidAmount);

           db.Player_Bid_Info.update(
                {"matchId":data.matchId,"playerId":parseInt(data.playerId)},
                {$addToSet:{bidInfo:{"FBID":data.FBID,"bidAmount":parseInt(data.bidAmount),"deleted":0,"playerAdded":"no"}}},
                {upsert:true}, function (err,updated){
              if(err) console.log(err);
              else {

                     db.userSchema.find({_id:data.FBID},{Credits : 1}).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs){
                                console.log('credits docs '+docs);
                                           for(var i = 0; i < docs.length; i++)  
                                                  { 
                                                   var Credits1 =  docs[i].Credits;
                                                    console.log('credits are '+docs[i].Credits);
                                                   };
                          


                                     db.userSchema.update({_id:data.FBID},{$addToSet:{CreditsInfo:{"credit":0,"debit":data.bidAmount,"All_Credits":(parseInt(Credits1)-parseInt(data.bidAmount)),"comment":"bid for "+data.matchId+"_"+data.playerId+"","Created_Date":new Date()}}}, function (err, updated){
                                         if(err) console.log(err);
                                         else
                                         {
                                          console.log('update userSchema called');
                                          var b = {"FBID":data.FBID,"amount":data.bidAmount} ;
                                               redis.SADD("bidarray"+data.matchId+data.playerId, JSON.stringify(b),function(err,succ)
                                                    {
                                                      if(err) console.log(err);
                                                      else
                                                      {
                                                      console.log(succ);
                                                    }
                                                    }); 
                                         }
                                      })
                      client.emit('bidsuccess',"Inserted bid information"); 
                      console.log('Bid information is saved');
                                    }          
                                }
                         });
                   }
                 });

  });


 client.on('updateBidInformation',function(data){
                       db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" }, { $match :{ "matchId" : data.matchId,
                                  "playerId" : data.playerId,"bidInfo.FBID" : data.FBID } }]).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
                                                    for(var i = 0; i < docs.length; i++) { 
                                                        var bid = JSON.stringify(docs[i]);
                                                         console.log('player bid information individual ------'+docs[i].bidInfo.bidAmount);
                                                         if(data.bidAmount>docs[i].bidInfo.bidAmount)
                                                         {
                                                               db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId,"bidInfo.FBID":data.FBID}, {"$set" : {"bidInfo.$.bidAmount" : data.bidAmount,"bidInfo.$.deleted":0}}, function (err,updated){
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
                          db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId,"bidInfo.FBID":data.FBID}, {"$set" : {"bidInfo.$.deleted":1}}).exec(function(err, docs){
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


   client.on('getUserPlayers',function(data){
          getUserPlayers(data.matchId,data.FBID,function(){
                client.emit('getUserPlayersInfo',userplayersarr);
                userplayersarr = [];
           });

    });



   client.on('createPrivateLeague',function(data){ 
    console.log('createPrivateLeague is called' + data.FBID);
             createPrivateLeague(data,function(){ 
                  createPublicLeague(data,function(){ 
                     client.emit('createPrivateLeagueSuccess',"create private league success");
                    console.log("league added successfully"); 
                        })
               }) 
       }) 


   client.on('joinLeague',function(data){ 
              joinLeague(data,function(){ 
                     createPublicLeague(data,function(){
                         client.emit('joinLeagueSuccess',"user joined successfully in the private league");
                           console.log("league joined successfully");
                         }) 
               })
       }) 


   client.on("createPublicLeague",function(data){ 
                createPublicLeague(data,function(){ 
                     client.emit('createPublicLeagueSuccess',"create public league success");
                  console.log("public league joined successfully");
                   })
        })





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

