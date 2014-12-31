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
var server = http.createServer(app).listen(3001);
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
var room_name;
var MatchSchedule = [], FBID = '', userplayersarryes = [], userplayersarrno = [], Credits = '', FBNAME = '', teaminfo = [], playerinfo = [], playerinfo1 = [], playerIndinfo = [], teamplayers = [], MatchShortNames = [], playerBidinfo = [];
var playerstatusupdatearray = [] , userplayerstatusupdatearray = [];
  var data = new Array( 10 );

for ( var i = 0; i < data.length; i++ ) {
    data[ i ] = i;
}


//console.log('standard deviation is '+ stdev( data ) );

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
      getmatchNew(function(mainArray){
        /*for(var i=0;i<mainArray.length;i++){
          console.log(mainArray[i])
        }*/
        MatchSchedule = mainArray;
        callback()
      })
      // db.match_shedules.find({EndDate : {$gt :new Date()}}).sort({StartDate : 1}).limit(6).exec(function(err,docs){
      //   if(err)console.log(err);
      //       else{
      //         if(docs){
      //                      for(var i = 0; i < docs.length; i++)  
      //                             { 
      //                               MatchSchedule.push(docs[i]);
      //                               console.log('start date '+docs[i].StartDate)
      //                               if(i === docs.length - 1)
      //                               {
      //                                 callback();
      //                               } 
      //                             };
      //         }          
      //       }
      // });

       /*db.match_shedules.find({EndDate : {$gt :new Date()} }).sort({StartDate : 1}).limit(6).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                           var x=0;
                           var y = docs.length;                
                           for(var i = 0; i < docs.length; i++)  
                                  { 
                                    (function(i){
                                    // MatchSchedule.push(docs[i]);
                                       console.log('start date '+docs[i].team2.teamId)
                                       db.team_infos.find({teamId:docs[i].team1.teamId}).exec(function(err,team1docs){
                                      if(err)console.log(err);
                                          else{
                                            if(team1docs){
                                              console.log('get team information length is -----------------------'+team1docs[0].teamLargeRoundFlagPath);
                                              for(var j = 0; j < team1docs.length; j++)  
                                                {
                                                  (function(j){
                                                  //console.log('get team information length is -----------------------'+team1docs[j].teamLargeRoundFlagPath);

                                                     db.team_infos.find({teamId:docs[i].team2.teamId}).exec(function (err,team2docs){
                                                      if(err) console.log(err);
                                                      else
                                                      {
                                                        x++;
                                                        if(team2docs)
                                                        {
                                                          
                                                          for(var k=0;k<team2docs.length;k++)
                                                          {

                                                             var matchjson = {
                                                                 matchId : docs[i].matchId,
                                                                 mtype : docs[i].mtype,
                                                                 series_id : docs[i].series_id,
                                                                 series_name : docs[i].series_name,
                                                                 MatchNo : docs[i].MatchNo,
                                                                 StartDate : docs[i].StartDate,
                                                                 EndDate : docs[i].EndDate,
                                                                 team1Id : docs[i].team1.teamId,
                                                                 team2Id : docs[i].team2.teamId,
                                                                 team1logo : team1docs[j].teamLargeRoundFlagPath,
                                                                 team1name : team1docs[j].teamName,
                                                                 team1shortname : team1docs[j].teamShortName,
                                                                 team2logo : team2docs[k].teamLargeRoundFlagPath,
                                                                 team2name : team2docs[k].teamName,
                                                                 team2shortname : team2docs[k].teamShortName
                                                               }
                                                               MatchSchedule.push(matchjson);
                                                              // console.log(matchjson);



                                                          }
                                                        
                                                        }
                                                                if(x === y)
                                                                  {
                                                                    callback();
                                                                  } 
                                                      }
                                                    });
                                                        // if(x == n)
                                                        //   {
                                                        //     callback();
                                                        //   }
                                                  })(j)
                                                } 


                               
                                                }
                                            }                            
                                          
                                                               
                                    });
                           
                               })(i)
                               
                               };
              }          
            }
        });*/


  }
  //end of getMatchschedule function
function getmatch(){
  var tempDate,match= [],match1=[];
     db.match_shedules.find({EndDate : {$gt :new Date()} }).sort({StartDate : 1}).limit(6).exec(function(err,docs){
        if(err)console.log(err);
            else{
              if(docs){
                 for(var i = 0; i < docs.length; i++)  
                           { 
                                    // var StartDate = docs[i].StartDate;
                                    // var tempDate;
                                    var day = docs[i].StartDate.getDate();
                                    var month = docs[i].StartDate.getMonth()+1;
                                    var year = docs[i].StartDate.getFullYear();
                                    var date = year+'-'+month+'-'+day; 
                                    console.log('match dAtes '+date);
                                    if(date == tempDate)
                                    {
                                      //  var matchjson = {
                                      //   SameDate : docs[i].StartDate,
                                      // }
                                       var matchInfo =  {
                                             match1Id : docs[i].matchId,
                                             mtype : docs[i].mtype,
                                             series_id : docs[i].series_id,
                                             series_name : docs[i].series_name,
                                             MatchNo : docs[i].MatchNo,                                             
                                             EndDate : docs[i].EndDate,
                                             team1Id : docs[i].team1.teamId,
                                             team2Id : docs[i].team2.teamId
                                           }
                                           match1.push(JSON.stringify(matchInfo));
                                           match.push(match1);
                                           match1=[];
                                           console.log(matchInfo);

                                    }
                                    else
                                    {
                                       var matchjson = {
                                        StartDate : docs[i].StartDate
                                          }
                                          var matchInfo =  {
                                             matchId : docs[i].matchId,
                                             mtype : docs[i].mtype,
                                             series_id : docs[i].series_id,
                                             series_name : docs[i].series_name,
                                             MatchNo : docs[i].MatchNo,                                             
                                             EndDate : docs[i].EndDate,
                                             team1Id : docs[i].team1.teamId,
                                             team2Id : docs[i].team2.teamId
                                           }
                                            
                                            match1.push(JSON.stringify(matchInfo));
                                            matchjson.matchInfo = match1;
                                            match1 = [];
                                    match.push(matchjson);
                                    console.log(matchjson);
                                         
                                      tempDate = date;

                                    }
                                    

                                 
                                       
                                           //console.log(match);
                                    
          

                   }


              }
            }
          });


}
//getmatch()
function getmatchNew(callback){
  var mainArray = [];
  var tempDate,match= [],match1=[];
  db.match_shedules.find({EndDate : {$gt :new Date()} }).sort({StartDate : 1}).limit(6).exec(function(err,docs){
    if(err)console.log(err);
    else{
      if(docs){
        console.log(" get match new ---------------------------------------------------------")
        var i=0,n=docs.length;
        // console.log("docs length is === " + docs.length)
        function matchesLoop(i){
          var day = docs[i].StartDate.getDate();
              var month = docs[i].StartDate.getMonth()+1;
              var year = docs[i].StartDate.getFullYear();
              var date = year+'-'+month+'-'+day; 
              date = new Date(date).toISOString()
              // console.log(date + "-------------------")
          if(mainArray.length > 0){
            var j = 0,m=mainArray.length;
            function mainArrayLoop(j){ // loop main array and search for date if date found push match deatails else create new object with date 
              var day = docs[i].StartDate.getDate();
              var month = docs[i].StartDate.getMonth()+1;
              var year = docs[i].StartDate.getFullYear();
              var date = year+'-'+month+'-'+day; 
              date = new Date(date).toISOString()
              getTeamInfoNew(docs[i].team1.teamId,function(teamInfo){ // getting team1 info
                var team1Info = teamInfo;
                getTeamInfoNew(docs[i].team2.teamId,function(team2Info){ // getting team2 info
                  var matchInfo =  {
                     matchId : docs[i].matchId,
                     mtype : docs[i].mtype,
                     series_id : docs[i].series_id,
                     series_name : docs[i].series_name,
                     MatchNo : docs[i].MatchNo,   
                    StartDate : docs[i].StartDate,
                     EndDate : docs[i].EndDate,
                     team1Info : team1Info,
                     team2Info : team2Info
                   };
                  if(mainArray[j].StartDate == date){
                    mainArray[j].matchInfo.push(matchInfo);
                    i++;
                    if(i != n)
                      matchesLoop(i)
                    if(i == n)
                      callback(mainArray)
                  }else{
                    // console.log("in else")
                    j++;
                    // console.log(j + " ==== " + m)
                    if(j == m){
                      var dayMatch = {};
                      dayMatch.StartDate = date;
                      dayMatch.matchInfo = [];
                      dayMatch.matchInfo.push(matchInfo);
                      mainArray.push(dayMatch);
                      i++;
                      if(i != n)
                        matchesLoop(i)
                      if(i == n)
                        callback(mainArray)
                    }
                    if(j != m)
                      mainArrayLoop(j);
                  }
                })// end of getting team2 info without player info
              }) // end of getting team1 info without player info
            }
            mainArrayLoop(j);
          }else{
            var day = docs[i].StartDate.getDate();
            var month = docs[i].StartDate.getMonth()+1;
            var year = docs[i].StartDate.getFullYear();
            var date = year+'-'+month+'-'+day; 
            date = new Date(date).toISOString()
            var dayMatch = {};
            dayMatch.StartDate = date;
            dayMatch.matchInfo = [];
            getTeamInfoNew(docs[i].team1.teamId,function(teamInfo){
              var team1Info = teamInfo;
              getTeamInfoNew(docs[i].team2.teamId,function(team2Info){
                var matchInfo =  {
                   matchId : docs[i].matchId,
                   mtype : docs[i].mtype,
                   series_id : docs[i].series_id,
                   series_name : docs[i].series_name,
                   MatchNo : docs[i].MatchNo,
                  StartDate : docs[i].StartDate,
                   EndDate : docs[i].EndDate,
                   team1Info : team1Info,
                   team2Info : team2Info
                 };
                 dayMatch.matchInfo.push(matchInfo);
                  mainArray.push(dayMatch);
                  i++;
                  if(i != n)
                    matchesLoop(i)
                  if(i == n){
                    callback(mainArray)
                    console.log("march new ends -------------------------------------------------------------")
                  }
              })
            })
          }
        }
        matchesLoop(i);
      }
    }
  });
}
/*getmatchNew(function(mainArray){
  for(var i=0;i<mainArray.length;i++){
    console.log(mainArray[i])
  }
})*/
function getTeamInfoNew(teamId,callback){
  db.team_infos.findOne({teamId:teamId},{_id:0,players:0},function(err,teamInfo){
    if(err){
      console.log("error in getting team info " + err);
    }
    else{
      if(teamInfo){
        callback(teamInfo)
      }
    } 
  })
}
  function getTeamInfo(match_Id,team1,team2,FBID,callsback){
   db.team_infos.find({teamId:{$in:[team1,team2]}}).exec(function(err,docs){
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

//db.matchplayers.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(match_Id) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ])

  function getTeamWisePlayers(matchId,team1,team2,FBID,mtype,maincallback){
      var player_info_object = [];
      db.matchplayers.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(matchId) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ],function(err,docs){
          if(docs.length>0){
                var players_list = [];
                //console.log('player length '+docs.palyers.length);

                for(var i = 0;i<docs.length;i++){
                      for(var j=0;j<docs[i].players.length;j++){
                        players_list.push(docs[i].players[j])
                      }
                }
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

                            db.player_profiles.findOne({playerId : players_list[i]},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1, image : 1, pic_url : 1, batting_info : 1, bowling_info : 1},function(err,playerDoc){
                            if(err)console.log(err);
                            else{
                              if(playerDoc){
                                  redis.get("curr_price"+matchId+"_"+players_list[i]+"",function(err,res){
                                  if(err) console.log(err);
                                  else{
                                    // j++;
                                    var player_price = 0;
                                    if(res)
                                    {
                                      player_price = res;
                                      //console.log('player curr_price for matchid = '+matchId+' and player id = '+players_list[i]+' is '+player_price);
                                    }
                                   // console.log('fbid is '+FBID);


                                      db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{ $match :{ "matchId" : matchId,"playerId" :parseInt(players_list[i]),"bidInfo.FBID" : FBID}}]).exec(function(err, biddata){
                                          if(err)console.log(err);
                                              else{
                                                var indbid = 0,biddelete = 0,playeradded = 'no';
                                               // console.log('biddata length '+biddata.length);
                                                  if(biddata){
                                                              for(var w = 0; w < biddata.length; w++)  
                                                                                          { 
                                                              var bid = JSON.stringify(biddata[w]);
                                                              indbid = biddata[w].bidInfo.bidAmount;
                                                              biddelete = biddata[w].bidInfo.deleted;
                                                              playeradded = biddata[w].bidInfo.playerAdded;
//console.log('bid amount inside '+indbid);
                                                              }
                                                     
                                                        }
                                                       // console.log('bid amount outside player id  '+indbid);
                                                 var playerjson = {
                                                      "matchId" : matchId,
                                                      "playerId": playerDoc.playerId,
                                                      "country" : playerDoc.country,
                                                      "firstName" : playerDoc.firstName,
                                                      "lastName" : playerDoc.lastName,
                                                      "fullname" : playerDoc.fullname,
                                                      "teamId" : playerDoc.teamId,
                                                      "localimage" : playerDoc.image,
                                                      "pic_url" : playerDoc.pic_url,
                                                      "player_price" : player_price,
                                                      "bid" : indbid,
                                                      "deleted" : biddelete,
                                                      "player_added" : playeradded
                                                    };
                                                      if(mtype==='t20')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.Twenty20;
                                                      playerjson.bowling_info = playerDoc.bowling_info.Twenty20;

                                                      }
                                                      else if(mtype==='odi')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.ODIs;
                                                      playerjson.bowling_info = playerDoc.bowling_info.ODIs;
                                                      }
                                                      else if(mtype==='test')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.Tests;
                                                      playerjson.bowling_info = playerDoc.bowling_info.Tests;
                                                      }
                                                    
                                                 
                                                    
                                              player_info_object.push(playerjson);
                                              j++;
                                              if(j == n)
                                              {
                                                     maincallback(player_info_object)
                                              }
                                              //put this callback under else where we have to increase j++ value
                                             } 
                                             //end of ind player bid info aggregate else 
                                            })
                                            //end of ind player bid info aggregate query
                                    
                            
                                    }
                                     //end of player bid info avg aggregate else 
                                  })
                                //end of player bid info avg aggregate 
                              }
                              //end of if(playerdoc)
                              else{
                                j++;
                                console.log(j + " ==== " + n)
                                if(j == n)
                                {
                                       maincallback(player_info_object)
                                }
                              }//end of else(playerdoc)
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
    //end of if(doc) team_infos
  })
  //end of team_infos query
}
//end of getTeamWisePlayers function


  function getMatchShortNames(callback)
  {
                    db.team_infos.find({},{"teamName":1,"teamShortName":1,"_id":0}).exec(function(err,docs){
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
  db.player_profiles.find({playerId : player}).exec(function(err,docs){
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
var player_price;

  function getPlayerCurrentPrice(match_Id,playerId,callback){
       redis.get("curr_price"+match_Id+"_"+playerId+"",function(err,res){
        if(err) console.log(err);
        else
          if(res)
          {
            player_price = res;
            console.log('player curr_price for matchid = '+match_Id+' and player id = '+playerId+' is '+res);
            callback();
          }
          else
          {
            player_price = 0;
            console.log('player curr_price for matchid = '+match_Id+' and player id = '+playerId+' is '+player_price);
            callback()
          }
       })

  }


function getBidInfo(match_Id,player,FBID,callback){

  console.log('get bid info matchid '+match_Id);
  console.log('get bid info player '+player);
  console.log('get bid info FBID '+FBID);


  db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{ $match :{ "matchId" : match_Id,"playerId" :parseInt(player),"bidInfo.FBID" : FBID}}]).exec(function(err,docs){
                        if(err)console.log(err);
                            else{
                              if(docs.length>0){
                               // console.log('get team information length is -----------------------'+docs);
                               // playerBidinfo.push(docs)
                                   for(var i = 0; i < docs.length; i++)  
                                    { 
                                      var bidinfor = {"bid" : docs[i].bidInfo.bidAmount}
                                      //console.log('avg bid information1 '+docs[i].bidInfo.bidAmount)
                                      playerBidinfo.push(bidinfor);
                                      if(i === docs.length - 1)
                                      {
                                        callback();
                                      } 
                                    };  
                              }
                              else
                              {
                                var bidinfor = {"bid" : 0}
                                      //console.log('avg bid information1 '+docs[i].bidInfo.bidAmount)
                                      playerBidinfo.push(bidinfor);
                                       callback();


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
                                           db.player_profiles.findOne({playerId : docs[i].playerId},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1, image : 1, pic_url : 1},function(err,playerDoc){
                                              if(err)console.log(err);
                                              else{
                                                if(playerDoc){
                                                     redis.get("curr_price"+match_Id+"_"+docs[i].playerId+"",function(err,res){
                                                        if(err) console.log(err);
                                                        else{
                                                          j++;
                                                          var player_price = 0;
                                                          if(res)
                                                          {
                                                            player_price = res;
                                                            //console.log('player curr_price for matchid = '+matchId+' and player id = '+players_list[i]+' is '+player_price);
                                                          }

                                                          if(docs[i].bidInfo.playerAdded==='yes')
                                                          {
                                                            
                                                             var userplayersyes = {
                                                            "matchId" : docs[i].matchId,
                                                            "playerId" : docs[i].playerId,
                                                            "country" : playerDoc.country,
                                                            "firstName" : playerDoc.firstName,
                                                            "lastName" : playerDoc.lastName,
                                                            "fullname" : playerDoc.fullname,
                                                            "teamId" : playerDoc.teamId,
                                                            "localimage" : playerDoc.image,
                                                            "pic_url" : playerDoc.pic_url,
                                                            "bid" : docs[i].bidInfo.bidAmount,
                                                            "deleted" : docs[i].bidInfo.deleted,
                                                            "player_price" : player_price,
                                                            "player_added" :  docs[i].bidInfo.playerAdded
                                                              }
                                                             userplayersarryes.push(userplayersyes);

                                                          }
                                                          else if(docs[i].bidInfo.playerAdded==='no')
                                                          {
                                                            console.log('playeradded is no');
                                                            var userplayersno = {
                                                            "matchId" : docs[i].matchId,
                                                            "playerId" : docs[i].playerId,
                                                            "country" : playerDoc.country,
                                                            "firstName" : playerDoc.firstName,
                                                            "lastName" : playerDoc.lastName,
                                                            "fullname" : playerDoc.fullname,
                                                            "teamId" : playerDoc.teamId,
                                                            "localimage" : playerDoc.image,
                                                            "pic_url" : playerDoc.pic_url,
                                                            "bid" : docs[i].bidInfo.bidAmount,
                                                            "deleted" : docs[i].bidInfo.deleted,
                                                            "player_price" : player_price,
                                                            "player_added" :  docs[i].bidInfo.playerAdded
                                                                              }
                                                                 userplayersarrno.push(userplayersno);
                                                          }

                              
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
     db.userSchema.aggregate([{$unwind : "$FriendsList"},{$match : {"FriendsList" : "55055630597282490"}},{$project : {FBID : "$_id"}}]).exec(function (err,friendslist){
                                            if(err) console.log(err)
                                              else
                                              {
                                                if(friendslist)
                                                {
                                                  for(var k=0;k<friendslist.length;k++)
                                                  {
                                                    console.log('fbids in friendslist is '+friendslist[k]._id);
                                                          db.userSchema.update({_id : friendslist[k]._id}, {$inc : { Credits : 200 } }).exec(function(err, data, raw){
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
                                                  }
                                                  
                                                }
                                              }
                                          })
}

//ex();
var playerstatusupdate = {}, userplayerstatusupdate = {};

function updateredis(matchid,playerid,amount,fbid,callsback){


console.log('updateredis is called');

    db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" }, { $match : { "matchId" : matchid,"bidInfo.FBID" : fbid,"bidInfo.playerAdded" : "yes"
                                          }},{ $group :{ _id : "$bidInfo.FBID",count : {$sum : 1}}}]).exec(function (err, playerscount1){
                                            if(err) console.log(err)
                                              else
                                              {
                                                var playerscount = 0;
                                                if(playerscount1.length>0)
                                                {
                                                  playerscount = playerscount1[0].count;
                                                
                                                }
                                                console.log('count of players '+playerscount);
                                                if(playerscount<=11)
                                                {
                                                  console.log('count of players '+playerscount);

                                                         db.Player_Bid_Info.update({"matchId":matchid,"playerId":playerid,"bidInfo.FBID":fbid}, {"$set" : {"bidInfo.$.playerAdded" : "yes"}},function (err, updated){
                                                                    if(err) {console.log(err)}
                                                                      else
                                                                      {
                                                                        if(updated)
                                                                        {
                                                                          //console.log('player assigned  successfully for '+fbid+'with bid amount of '+amount);
                                                                          redis.srem("bidarray"+matchid+"_"+playerid+"","{\"FBID\":\""+fbid+"\",\"amount\":"+amount+"}")
                                                                          redis.set("curr_price"+matchid+"_"+playerid+"",amount);

                                                                         db.Player_Bid_Info.update({"matchId":matchid.toString(),"playerId":parseInt(playerid)},{$push: { player_bids:{"bidAmount":amount,"time":new Date()}}},function (err, updated1){
                                                                          if(err) {console.log(err)}
                                                                            else
                                                                            {
                                                                              if(updated1)
                                                                              {
                                                                                   playerstatusupdate = {
                                                                                      "matchId" : matchid,
                                                                                      "playerId" : playerid,
                                                                                      "player_price" : amount
                                                                                   }
                                                                                   userplayerstatusupdate = {
                                                                                     "matchId" : matchid,
                                                                                      "playerId" : playerid,
                                                                                      "FBID" : fbid,
                                                                                      "amount" : amount

                                                                                   }
                                                                                   console.log('amount '+amount);
                                                                                 callsback();
                                                                               }

                                                                            }
                                                                          })
                                                                        }
                                                     
                                                                      }
                                                         })
                                                }
                                                else
                                                {
                                                  console.log('error you have reached 11 members');
                                                  callsback();
                                                 
                                                }


                                              }

                                          })






}

//updateredis();

function redis1(match_Id,playerId,callback){
      redis.scard("bidarray"+match_Id+"_"+playerId+"",function(err,resp){
          if(err){console.log(err)}
            else 
            {
              //console.log('redis response is '+resp+' for '+players_list[k]);
              if(resp>=3)
              {
                 redis.smembers("bidarray"+match_Id+"_"+playerId+"",function(err,members){
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
                           var pmem ;
                            for(var x =0 ;x<members.length ; x++){
                              (function(x){
                               pmem = JSON.parse(members[x]);
                              
                             // console.log('temp in outsie '+temp);
                             // console.log//('pmem amount is '+pmem.amount+' and fbid is '+pmem.FBID);
                              if(pmem.amount==temp)
                                    {
                                       updateredis(match_Id,playerId,pmem.amount,pmem.FBID,function(){
                                              console.log('player status update '+playerstatusupdate);
                                                  
                                                    playerstatusupdatearray.push(playerstatusupdate);
                                                    userplayerstatusupdatearray.push(userplayerstatusupdate);
                                                    // send add player notification starts
                                                    var nMessage = "playerName has joined your team for the matchName match";
                                                    sendPlayerAsignNotification(nMessage,playerId,match_Id,pmem.FBID);
                                                    var nLMessage = "playerName has joined userName's team.";
                                                    sendPlayerAllotNotificationToLeagueMembers(nLMessage,playerId,match_Id,pmem.FBID)
                                                    // send add player notification ends
                                                     callback();
                                                   });
                                    }

                             }(x))       
                            }
                      }
                    }
                 });
                console.log('redis length is '+resp);
              }
             
            }
      })              

}



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
        league_obj.leagueType = "private";
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
         league_obj.leagueType = "public";
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
                                         // console.log('players above bid '+playerId+' at bid amount of '+bidplayeramount+' stdev is '+playerstdev);
                                        }
                                        //console.log('playerbids array '+stdev(playerbids));
                                    }
                              });
                        }
                    }
                  }
      });
         


}
function getTeamWisePlayersNew(matchId,team1,team2,FBID,mtype,maincallback){
      var player_info_object = [];
      db.matchplayers.aggregate([{ $unwind : "$teams" }, {$match : {"matchId" : parseInt(matchId) } },{ $project : {    matchid : "$matchId" , team : "$teams.teamId",  players : "$teams.players.playerId"} } ],function(err,docs){
          console.log("matchplalyers == " + docs.length)
          if(docs.length>0){
                var players_list = [];
                //console.log('player length '+docs.palyers.length);

                for(var i = 0;i<docs.length;i++){
                      for(var j=0;j<docs[i].players.length;j++){
                        players_list.push(docs[i].players[j])
                      }
                }
                var j=0;n=players_list.length;
                for(var i=0;i<players_list.length;i++){
                     (function(i){
                        console.log("i value is " + i)
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

                            db.player_profiles.findOne({playerId : players_list[i]},{playerId:1,country:1,firstName:1,lastName:1,fullname:1,teamId:1, image : 1, pic_url : 1, batting_info : 1, bowling_info : 1},function(err,playerDoc){
                            if(err)console.log(err);
                            else{
                              if(playerDoc){
                                // console.log(playerDoc)
                                  redis.get("curr_price"+matchId+"_"+players_list[i]+"",function(err,res){
                                  if(err) console.log(err);
                                  else{
                                    // j++;
                                    // console.log(j + " === " + n)
                                    var player_price = 0;
                                    if(res)
                                    {
                                      player_price = res;
                                      //console.log('player curr_price for matchid = '+matchId+' and player id = '+players_list[i]+' is '+player_price);
                                    }
                                   // console.log('fbid is '+FBID);


                                      db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" },{ $match :{ "matchId" : matchId,"playerId" :parseInt(players_list[i]),"bidInfo.FBID" : FBID}}]).exec(function(err, biddata){
                                          if(err)console.log(err);
                                              else{
                                                
                                                var indbid = 0,biddelete = 0,playeradded = 'no';
                                               // console.log('biddata length '+biddata.length);
                                                  if(biddata){
                                                              for(var w = 0; w < biddata.length; w++)  
                                                                                          { 
                                                              var bid = JSON.stringify(biddata[w]);
                                                              indbid = biddata[w].bidInfo.bidAmount;
                                                              biddelete = biddata[w].bidInfo.deleted;
                                                              playeradded = biddata[w].bidInfo.playerAdded;
//console.log('bid amount inside '+indbid);
                                                              }
                                                     
                                                        }
                                                       // console.log('bid amount outside player id  '+indbid);
                                                 var playerjson = {
                                                      "matchId" : matchId,
                                                      "playerId": playerDoc.playerId,
                                                      "country" : playerDoc.country,
                                                      "firstName" : playerDoc.firstName,
                                                      "lastName" : playerDoc.lastName,
                                                      "fullname" : playerDoc.fullname,
                                                      "teamId" : playerDoc.teamId,
                                                      "localimage" : playerDoc.image,
                                                      "pic_url" : playerDoc.pic_url,
                                                      "player_price" : player_price,
                                                      "bid" : indbid,
                                                      "deleted" : biddelete,
                                                      "player_added" : playeradded
                                                    };
                                                      if(mtype==='t20')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.Twenty20;
                                                      playerjson.bowling_info = playerDoc.bowling_info.Twenty20;

                                                      }
                                                      else if(mtype==='odi')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.ODIs;
                                                      playerjson.bowling_info = playerDoc.bowling_info.ODIs;
                                                      }
                                                      else if(mtype==='test')
                                                      {
                                                      playerjson.batting_info = playerDoc.batting_info.Tests;
                                                      playerjson.bowling_info = playerDoc.bowling_info.Tests;
                                                      }
                                                    
                                                 
                                                    
                                              player_info_object.push(playerjson);
                                              console.log(j + " === " + n)
                                              j++;
                                              if(j == n)
                                              {
                                                     maincallback(player_info_object)
                                              }
                                             } 
                                             //end of ind player bid info aggregate else 
                                            })
                                            //end of ind player bid info aggregate query
                                    
                                      //put this callback under else where we have to increase j++ value
                            
                                    }
                                     //end of player bid info avg aggregate else 
                                  })
                                //end of player bid info avg aggregate 
                              }else{
                                j++;
                                console.log(j + " ==== " + n)
                                if(j == n)
                                {
                                       maincallback(player_info_object)
                                }
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
    //end of if(doc) team_infos
  })
  //end of team_infos query
}
//end of getTeamWisePlayers function
//PlayerAssign();
 //var cricapp = 'public';
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
                                        if(document)
                                        {


                                               db.userSchema.aggregate([{$unwind : "$FriendsList"},{$match : {"FriendsList" : data.FBID}},{$project : {FBID : "$_id"}}]).exec(function (err,friendslist){
                                                if(err) console.log(err)
                                                  else
                                                  {
                                                    if(friendslist)
                                                    {
                                                      for(var k=0;k<friendslist.length;k++)
                                                      {
                                                        var notificationMessage = data.FBNAME + " has now joined Cricketopia. You get 200 credits!";
                                                        acceptAppInvitationNotification(friendslist[k]._id,notificationMessage)
                                                        console.log('fbids in friendslist is '+friendslist[k]._id);
                                                            db.userSchema.find({"_id":friendslist[k]._id},{Credits : 1}).exec(function(err,docs){
                                                              if(err)console.log(err);
                                                                  else{
                                                                    if(docs){
                                                                      console.log('credits docs '+docs);
                                                                       for(var i = 0; i < docs.length; i++)  
                                                                              { 
                                                                               var Credits =  docs[i].Credits;
                                                                                console.log('credits are '+docs[i].Credits);
                                                                                var amount = 200;
                                                                               
                                                                       db.userSchema.update({_id : docs[i]._id}, {$set : { Credits : (parseInt(Credits)+parseInt(amount)) } ,$addToSet:{CreditsInfo:{"credit":200,"debit":0,"All_Credits":(parseInt(Credits)+parseInt(amount)),"comment":"friend added "+data.FBID+"_"+data.FBNAME+"","Created_Date":new Date()}}}).exec(function(err, data){
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
};
                                                                    }          
                                                                  }
                                                            });
                                                      
                                                      }
                                                      
                                                    }
                                                  }
                                                })
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
       console.log('team1 at getTeamInformation ' + data.team1Id);
      console.log('matchId at getTeamInformation ' + data.matchId);
      console.log('team2 at getTeamInformation ' + data.team2Id);
      console.log('FBID at getTeamInformation ' + data.FBID);
      console.log('mtype at getTeamInformation ' + data.mtype);
                console.log('getTeamInformation called');
                 /*getTeamInfo(matchId,team1,team2,data.FBID,function(){  
                           client.emit('getTeamInfo',teaminfo);
                                              teaminfo = [];
                                     });*/
                 console.log("get teaminformation starts -------------------------------------------")
              getTeamWisePlayers(matchId,team1,team2,data.FBID,data.mtype,function(player_info_object){
                console.log("in get teaminformation -------------------------------------------------")
                        client.emit('getPlayerInfo',player_info_object);
                player_info_object = [];
              })
              console.log("get teaminformation ends --------------------------------------------")

               db.Leagues_Info.aggregate([{ $unwind : "$users" },{ $match : { "matchId" : parseInt(data.matchId), "users" : data.FBID,"leagueType" : "private"  } }]).exec(function(err, leagueName){
                if(err) console.log(err);
                 else
                 {
                    if(leagueName.length>0)
                    {
                      console.log('subscribe calll'+leagueName[0].leagueName);
                      room_name = leagueName[0].leagueName;
                      sub.subscribe(leagueName[0].leagueName);
                    }
                  }
                })
    });


 client.on('getPlayerInformation',function(data){
           //   console.log('getPlayerInformation called');
                   getPlayerInfo(data.playerId,function(){  
                     client.emit('getIndPlayerInfo',playerIndinfo);
                         playerIndinfo=[];
                        });
 });


  client.on('getPlayerCurrentPrice',function(data){
                    getPlayerCurrentPrice(data.matchId,data.playerId,function(){  
                         client.emit('getPlayerCurrentPrice',player_price);
                         //res=[];
                        });
 });



  client.on('getBidInformation',function(data){
            //  console.log('getBidInformation called');
               getBidInfo(data.matchId,data.playerId,data.FBID,function(){  
                        client.emit('getBidInfo',playerBidinfo);
                         playerBidinfo=[];
                        });
  });


client.on('setBidInformation',function(data){
      console.log('FBID at setBidInformation '+data.FBID);
      console.log('matchId at setBidInformation '+data.matchId);
      console.log('playerId at setBidInformation '+data.playerId);
      console.log('bidAmount at setBidInformation '+data.bidAmount);
      if(data.bidAmount>0)
      {

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
                               // console.log('credits docs '+docs);
                                   for(var i = 0; i < docs.length; i++)  
                                          { 
                                           var Credits1 =  docs[i].Credits;
                                            console.log('credits are '+docs[i].Credits);
                                           };
                  
                                     db.userSchema.update({_id:data.FBID},{$set : {Credits:(parseInt(Credits1)-parseInt(data.bidAmount))},$addToSet:{CreditsInfo:{"credit":0,"debit":data.bidAmount,"All_Credits":(parseInt(Credits1)-parseInt(data.bidAmount)),"comment":"bid for "+data.matchId+"_"+data.playerId+"","Created_Date":new Date()}}}, function (err, updated){
                                         if(err) console.log('update '+err);
                                         else
                                         {
                                           if(updated)
                                           {
                                            client.emit('getCredits',{credits : parseInt(Credits1)-parseInt(data.bidAmount)});
                                         // console.log('update userSchema called');
                                          var b = {"FBID":data.FBID,"amount":parseInt(data.bidAmount)} ;
                                               redis.SADD("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(b),function(err,succ)
                                                    {
                                                      if(err) console.log(err);
                                                      else
                                                      {
                                                     redis1(data.matchId,data.playerId,function(){
                                                      //console.log('playerstatusupdatearray is '+playerstatusupdatearray);
                                                      client.emit('playerstatusupdate',playerstatusupdatearray);
                                                      //publish the player price info to all users
                                                      pub.publish('public',JSON.stringify(playerstatusupdatearray),function(err,succ)
                                                      {
                                                        if(err)console.log(err);
                                                        else {console.log(succ);}
                                                      });
                                                      client.emit('userplayerstatusupdate',userplayerstatusupdatearray);
                                                      playerstatusupdatearray = [];
                                                      userplayerstatusupdatearray = [];
                                                     });
                                                      console.log(succ);
                                                    }
                                                    }); 
                                           } 
                                         }
                                      })
                      var bidmsg = {
                        "message" : "Inserted bid information",
                        "bid" : data.bidAmount
                      }
                      client.emit('bidsuccess',bidmsg); 
                      //console.log('Bid information is saved');
                                    }          
                                }
                         });
                   }
                 });

      }
      else
      {
         client.emit('setbidfail',"bid should not be zero")

      }

  });


 client.on('updateBidInformation',function(data){
      if(data.newbid>0)
      {
                       db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" }, { $match :{ "matchId" : data.matchId,
                                  "playerId" : data.playerId,"bidInfo.FBID" : data.FBID } },
                        { $project : {   "matchId" : 1, "playerId" : 1, "bidInfo.FBID" : 1,"bidInfo.bidAmount" : 1, } }]).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
                                                   // console.log('oldbid in update bid information is '+docs[0].bidInfo.bidAmount);
                                                      db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId,"bidInfo.FBID":data.FBID}, {"$set" : {"bidInfo.$.bidAmount" : data.newbid,"bidInfo.$.deleted":0}}, function (err,updated){
                                                                if(err) console.log(err);
                                                                else {

                                                                          db.userSchema.find({_id:data.FBID},{Credits : 1}).exec(function(err,docs){
                                                                          if(err)console.log(err);
                                                                              else{
                                                                                if(docs){
                                                                                 // console.log('credits docs '+docs);
                                                                                     for(var i = 0; i < docs.length; i++)  
                                                                                            { 
                                                                                             var Credits1 =  docs[i].Credits;
                                                                                             // console.log('credits are '+docs[i].Credits);
                                                                                             };

                                                                                              if((parseInt(data.oldbid) - parseInt(data.newbid))>0)
                                                                                              {
                                                                                                var bidcredits = parseInt(data.oldbid) - parseInt(data.newbid);
                                                                                                var debit = 0;
                                                                                                var credit = bidcredits;
                                                                                                var acredits = parseInt(Credits1)+parseInt(credit);
                                                                                              }
                                                                                              else
                                                                                              {
                                                                                                var bidcredits = parseInt(data.newbid) - parseInt(data.oldbid);
                                                                                                var debit = bidcredits;
                                                                                                var credit = 0;
                                                                                                var acredits = parseInt(Credits1)-parseInt(debit) ;
                                                                                              }
                                                                                           //   console.log('credit '+credit+' and debit is '+debit);

                                                                    
                                                                                       db.userSchema.update({_id:data.FBID},{$set : {Credits:acredits},$addToSet:{CreditsInfo:{"credit":credit,"debit":debit,"All_Credits":acredits,"comment":"bid for "+data.matchId+"_"+data.playerId+"","Created_Date":new Date()}}}, function (err, updated){
                                                                                           if(err) console.log(err);
                                                                                           else
                                                                                           {
                                                                                            if(updated)
                                                                                            {
                                                                                            client.emit('getCredits',{credits : acredits});
                                                                                           // console.log('update userSchema called');
                                                                                            var b = {"FBID":data.FBID,"amount":parseInt(data.newbid)} ;
                                                                                            var bb = {"FBID":data.FBID,"amount":parseInt(data.oldbid)} ;

                                                                                              redis.srem("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(bb),function(err,succ)
                                                                                                      {
                                                                                                        if(err) console.log(err);
                                                                                                        else
                                                                                                        {
                                                                                                            redis.SADD("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(b),function(err,succ)
                                                                                                            {
                                                                                                              if(err) console.log(err);
                                                                                                              else
                                                                                                              {
                                                                                                                   redis1(data.matchId,data.playerId,function(){
                                                                                                                    client.emit('playerstatusupdate',playerstatusupdatearray);
                                                                                                                    client.emit('userplayerstatusupdate',userplayerstatusupdatearray);
                                                                                                                    playerstatusupdatearray = [];
                                                                                                                    userplayerstatusupdatearray = [];
                                                                                                                   });
                                                                                                              console.log(succ);
                                                                                                            }
                                                                                                            }); 
                                                                                                      }
                                                                                                  }); 
                                                                                             }
                                                                                            
                                                                                           }
                                                                                        })
                                                                      var updatebidmsg = {
                                                                        "message" : "updated bid information",
                                                                        "oldbid"  : data.oldbid,
                                                                        "newbid"  : data.newbid
                                                                      }
                                                                      client.emit('bidupdatesuccess',updatebidmsg); 
                                                                      console.log('Bid information is updated');
                                                                                      }          
                                                                                  }
                                                                           });

                                                                     
                                                                   }
                                                                 });
                                                         }
                                                         else
                                                         {
                                                          client.emit('bidupdatefail',"Bid update fail due to no record in database"); 
                                                         }                                                              
                                                     }
                                           });
           }
      else
      {
         client.emit('updatebidfail',"bid should not be zero")

      }
    });


  client.on('deleteBidInformation',function(data){
                          db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId,"bidInfo.FBID":data.FBID}, {"$pull" : {"bidInfo":{"FBID":data.FBID}}}).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs){
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
                                                
                                                                   db.userSchema.update({_id:data.FBID},{$set : {Credits:(parseInt(Credits1)+parseInt(data.bidAmount))},$addToSet:{CreditsInfo:{"credit":data.bidAmount,"debit":0,"All_Credits":(parseInt(Credits1)+parseInt(data.bidAmount)),"comment":"bid deleted for "+data.matchId+"_"+data.playerId+"","Created_Date":new Date()}}}, function (err, updated){
                                                                       if(err) console.log(err);
                                                                       else
                                                                       {
                                                                         if(updated)
                                                                         {
                                                                          client.emit('getCredits',{credits : parseInt(Credits1)+parseInt(data.bidAmount)});
                                                                            console.log('update userSchema called');
                                                                            var b = {"FBID":data.FBID,"amount":parseInt(data.bidAmount)} ;
                                                                                 redis.srem("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(b),function(err,succ)
                                                                                      {
                                                                                        if(err) console.log(err);
                                                                                        else
                                                                                        { 
                                                                                          if(succ)
                                                                                          {
                                                                                              console.log('bid deleted in redis successfully '+succ);
                                                                                                  var deletebidmsg = {
                                                                                                          "message" : "Bid information is deleted successfully",
                                                                                                          "bid"  : data.bidAmount
                                                                                                        }
                                                                                             client.emit('deleteBidsuccess',deletebidmsg);
                                                                                           }
                                                                                           else
                                                                                           {
                                                                                               client.emit('deleteBidfail',"bid deletion failed redis not removed");
                                                                                           }
                                                                                      }
                                                                                      }); 
                                                                         }
                                                                       else
                                                                         {
                                                                             client.emit('deleteBidfail',"bid deletion failed userSchema not updated");
                                                                         }
                                                                       }
                                                                    })
                                                    
                                                                  }
                                                                  else
                                                                  {
                                                                    client.emit('deleteBidfail',"bid deletion failed user not in records");
                                                                  }          
                                                              }
                                                       });

                                                          }
                                                          else
                                                          {
                                                            client.emit('deleteBidfail',"bid deletion failed user did not bid for this player");
                                                          }
                                                  }

                            });

    });



 client.on('sellplayer',function(data){
        console.log('FBID at sellplayer '+data.FBID);
      console.log('matchId at sellplayer '+data.matchId);
      console.log('playerId at sellplayer '+data.playerId);
      console.log('bidAmount at sellplayer '+data.bid);
      console.log('bidAmount at sellplayer '+data.player_price);


                       db.Player_Bid_Info.aggregate([{ $unwind : "$bidInfo" }, { $match :{ "matchId" : data.matchId,
                                  "playerId" : parseInt(data.playerId),"bidInfo.FBID" : data.FBID,"bidInfo.playerAdded" : "yes" } }]).exec(function(err, docs){
                                          if(err)console.log(err);
                                              else{
                                                  if(docs.length>0){
                                                      db.Player_Bid_Info.update({"matchId":data.matchId,"playerId":data.playerId}, {"$pull" : {"bidInfo":{"FBID":data.FBID}}}, function (err,deleted){
                                                                if(err) console.log(err);
                                                                else {
                                                                  console.log('deleted is '+deleted);
                                                                  console.log('deleted is '+deleted.length);
                                                                  if(deleted)
                                                                  {
                                                                          db.userSchema.find({_id:data.FBID},{Credits : 1}).exec(function(err,docs){
                                                                          if(err)console.log(err);
                                                                              else{
                                                                                if(docs){
                                                                                 // console.log('credits docs '+docs);
                                                                                     for(var i = 0; i < docs.length; i++)  
                                                                                            { 
                                                                                             var Credits1 =  docs[i].Credits;
                                                                                           //   console.log('credits are '+docs[i].Credits);
                                                                                             };

                                                                                              if((parseInt(data.bid) - parseInt(data.player_price))>0)
                                                                                              {
                                                                                                var bidcredits = parseInt(data.bid) - parseInt(data.player_price);
                                                                                                var debit = bidcredits;
                                                                                                var credit = 0;
                                                                                                var acredits = parseInt(Credits1)-parseInt(debit);
                                                                                              }
                                                                                              else
                                                                                              {
                                                                                                var bidcredits = parseInt(data.player_price) - parseInt(data.bid);
                                                                                                var debit = 0;
                                                                                                var credit = bidcredits;
                                                                                                var acredits = parseInt(Credits1)+parseInt(credit) ;
                                                                                              }
                                                                                             // console.log('credit '+credit+' and debit is '+debit);

                                                                    
                                                                                       db.userSchema.update({_id:data.FBID},{$set : {Credits:acredits},$addToSet:{CreditsInfo:{"credit":credit,"debit":debit,"All_Credits":acredits,"comment":"sell player "+data.matchId+"_"+data.playerId+"","Created_Date":new Date()}}}, function (err, updated){
                                                                                           if(err) console.log(err);
                                                                                           else
                                                                                           {
                                                                                            if(updated)
                                                                                            {
                                                                                              // send remove player notification starts
                                                                                              var nMessage = "userName has removed playerName from his team.";
                                                                                              // sendPlayerAllotNotification(nMessage,data.playerId,data.FBID);
                                                                                              sendPlayerAllotNotificationToLeagueMembers(nMessage,playerId,match_Id,pmem.FBID)
                                                                                              // send remove player notification ends

                                                                                             client.emit('getCredits',{credits : acredits});

                                                                                            var b = {"FBID":data.FBID,"amount":parseInt(data.player_price)} ;
                                                                                            var bb = {"FBID":data.FBID,"amount":parseInt(data.bid)} ;

                                                                                              redis.srem("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(bb),function(err,succ)
                                                                                                      {
                                                                                                        if(err) console.log(err);
                                                                                                        else
                                                                                                        {
                                                                                                            redis.SADD("bidarray"+data.matchId+"_"+data.playerId, JSON.stringify(b),function(err,succ)
                                                                                                            {
                                                                                                              if(err) console.log(err);
                                                                                                              else
                                                                                                              {
                                                                                                              console.log(succ);
                                                                                                            }
                                                                                                            }); 
                                                                                                      }
                                                                                                  }); 
                                                                                              }
                                                                                            
                                                                                           }
                                                                                        })
                                                                      var updatebidmsg = {
                                                                        "message" : "sell player successfully",
                                                                        "bid"  : data.bid,
                                                                        "player_price"  : data.player_price
                                                                      }
                                                                      client.emit('sellplayersuccess',updatebidmsg); 
                                                                      console.log('Bid information is updated');
                                                                                      }          
                                                                                  }
                                                                           });
                                                                  }
                                                                  else
                                                                  {
                                                                    client.emit('sellplayerfail',"sell player failed"); 

                                                                  }

                                                                     
                                                                   }
                                                                 });
                                                         }
                                                         else
                                                         {
                                                          client.emit('sellplayerfail',"player not added to you"); 
                                                         }                                                              
                                                     }
                                           });
    });


   client.on('InviteFriends',function(data){

    // console.log('fbid in InviteFriends is -------------------'+data.FBID);
    // console.log('friends fbids are '+data.acceptedFBID);
    // for(var i = 0 ;i<data.acceptedFBID.length;i++){
    //   console.log('data is '+data.acceptedFBID[i]);
    // }
                      db.userSchema.update({_id : data.FBID},{ $addToSet : {FriendsList : data.acceptedFBID } }).exec(function (err, docs){
                            if(err)console.log(err);
                                else{
                                    if(docs){
                                                                         

                                          client.emit('InviteFriendslistAdded',"Friends Invitation added successfully in friends list");
                                              
                                        }
                                    else
                                    {
                                      client.emit('InviteFriendslistAddedFail',"Friends Invitation added fail in friends list");
                                    }
                                 }
                            });
    });


  client.on('AskFriendsAccept',function(data){
    db.userSchema.find({"_id":data.FBID},{Credits : 1}).exec(function(err,docs){
      if(err)console.log(err);
      else{
        if(docs){
          console.log('credits docs '+docs);
          for(var i = 0; i < docs.length; i++)  
          { 
            var Credits =  docs[i].Credits;
            console.log('credits are '+docs[i].Credits);
            var amount = 100;
            db.userSchema.update({_id : docs[i]._id}, {$set : { Credits : (parseInt(Credits)+parseInt(amount)) } ,$addToSet:{CreditsInfo:{"credit":100,"debit":0,"All_Credits":(parseInt(Credits)+parseInt(amount)),"comment":"friend given "+data.FriendFBID+"","Created_Date":new Date()}}}).exec(function(err, data){
              if(err)console.log(err);
              else{
                if(data){
                 //client.emit('AskFriendCreditssuccess',"Friends Invitation added successfully");
                }
                else
                {
                  console.log('AskFriendCreditssuccess Credits Failed  ');
                }           
              }
            });
          }
          db.userSchema.find({"_id":data.FriendFBID},{Credits : 1}).exec(function(err,docs){
            if(err)console.log(err);
            else{
              if(docs){
                console.log('credits docs '+docs);
                for(var i = 0; i < docs.length; i++)  
                { 
                  var Credits =  docs[i].Credits;
                  console.log('credits are '+docs[i].Credits);
                  var amount = 100;
                  db.userSchema.update({_id : docs[i]._id}, {$set : { Credits : (parseInt(Credits)-parseInt(amount)) } ,$addToSet:{CreditsInfo:{"credit":0,"debit":100,"All_Credits":(parseInt(Credits)-parseInt(amount)),"comment":"friend taken "+data.FBID+"","Created_Date":new Date()}}}).exec(function(err, data){
                    if(err)console.log(err);
                    else{
                      if(data){
                       client.emit('AskFriendCreditssuccess',"Friends Invitation added successfully");
                      }
                      else
                      {
                         client.emit('AskFriendCreditsFail',"Friends Invitation added fail");
                        console.log('AskFriendCreditssuccess Credits Failed  ');
                      }
                      var notificationMessage = "senderName has given you 100 credits.";
                      askForCreditsNotification(data.FriendFBID,data.FBID,notificationMessage)
                    }
                  });
                }
              }          
            }
          });
        }          
      }
    });
  });
  client.on('getUserPlayers',function(data){
    getUserPlayers(data.matchId,data.FBID,function(){
      var userplayers = {
        "yesplayers" : userplayersarryes,
        "noplayers" : userplayersarrno
      }
      client.emit('getUserPlayersInfo',userplayers);
      userplayersarryes = [];
      userplayersarrno = [];
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
  sub.on('message', function(channel,message){
    //console.log('subscribe is called '+message);
    if(channel == "public"){
      client.emit('matchPlayersPrice', message);
    }else{
      client.emit('message1', message);
      client.emit('privatechat',message);
    }

  })


   client.on("message1",function(data){ 
      sub.subscribe('public');
      console.log('chat time stamp is public '+data.FBID);
      var who = 'public';
                  new db.chat_Info({FBID : data.FBID,message : data.message,timestamp : new Date(), who : who}).save(function(err,document){
                      if(err) throw err;
                      else{
                        console.log('new chat ');
                        var usermessage = {
                          "FBID" : data.FBID,
                          "message" : data.message,
                          "who" : "public",
                          "timestamp" : new Date()
                        }

                        pub.publish('public',JSON.stringify(usermessage),function(err,succ)
                            {
                              if(err)console.log(err);
                              else {console.log(succ);}
                            });
                        
                        //client.broadcast.emit('message',{FBID : data.FBID, message : data.message, timestamp : new Date()})
                              client.emit('chatsuccess',"new chat record inserted successfully");
                           // console.log('facebook information is saved');
                          }
                        });
  })

   client.on("privatechat",function(data){ 


      db.Leagues_Info.aggregate([{ $unwind : "$users" },{ $match : { "matchId" : parseInt(data.matchId), "users" : data.FBID ,"leagueType" : "private" } }]).exec(function(err, leagueName){
        if(err) console.log(err);
         else
         {
            if(leagueName.length>0)
            {
              sub.subscribe(leagueName[0].leagueName);
                console.log('league name is '+leagueName[0].leagueName);
                var who = 'private';
                        new db.chat_Info({FBID : data.FBID,message : data.message,timestamp : new Date(), who : leagueName[0].leagueName}).save(function(err,document){
                            if(err) throw err;
                            else{
                              console.log('new chat ');
                              var usermessage = {
                                "FBID" : data.FBID,
                                "message" : data.message,
                                "who" : leagueName[0].leagueName,
                                "timestamp" : new Date()
                                 }

                              pub.publish(leagueName[0].leagueName,JSON.stringify(usermessage),function(err,succ)
                                  {
                                    if(err)console.log(err);
                                    else {console.log(succ);}
                                  });
                              
                              //client.broadcast.emit('message',{FBID : data.FBID, message : data.message, timestamp : new Date()})
                              client.emit('privatechatsuccess',"new chat record inserted successfully");
                                 // console.log('facebook information is saved');
                           }
                         });
            }
            else
            {
                 console.log('private chat failed becouse user not added in league');
            }
           
         }
      })

    //console.log('chat time stamp is '+data.FBID);
  
 })


client.on('getchatInfo',function(data){
      db.Leagues_Info.aggregate([{ $unwind : "$users" },{ $match : { "matchId" : parseInt(data.matchId), "users" : data.FBID ,"leagueType" : "private" } }]).exec(function(err, leagueName){
        if(err) console.log(err);
         else
         {
            if(leagueName.length>0)
            {
              db.chat_Info.find({who : leagueName[0].leagueName}).exec(function(err, docs){
                if(err) console.log(err)
                  else
                  {
                    if(docs)
                    {
                      var chathistory = [];
                      for(var i =0 ;i<docs.length;i++){
                        var chatinfo = {
                          "messageId" : docs[i]._id,
                          "FBID" : docs[i].FBID,
                          "message" : docs[i].message,
                          "timestamp" : docs[i].timestamp
                        }
                         chathistory.push(chatinfo);
                         client.emit('gettchatInformation',chathistory);
                        
                      }
                    }
                  }
              })
              console.log('chat info '+leagueName[0].leagueName)
             // sub.subscribe(leagueName[0].leagueName);
            }
          }
        })


})





    //disconnect socket code starts form here
        client.on('disconnect', function  () {
          client.emit('exit',{FBID:FBID,FBNAME:FBNAME});

                      sub.unsubscribe(room_name);
           
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


// Notifications

function getUserName(user_id,callback){
  db.userSchema.findOne({_id:FBID},{FBNAME:1,_id:0},function(err1,userName){
    if(err1){
      console.log("error in getting user name in getUSerNAme " + err1)
    }else{
      if(userName){
        callback(userName)
      }
    }
  })
}
function getPlayerName(playerId,callback){
  db.player_profiles.findOne({playerId:playerId},{playerName:1,_id:0},function(err,playerName){
    if(err){
      console.log("error in getting player profile in getPlayerName function" + err)
    }else{
      if(playerName){
        callback(playerName)
      }
    }
  })
}
/*function sendPlayerAllotNotification(notificationMessage,playerId,FBID){
  getPlayerName(playerId,function(playerName){
    notificationMessage = notificationMessage.replace("playerName",playerName)
    getUserName(FBID,function(userName){
      notificationMessage = notificationMessage.replace("userName",userName)
      sendNotification(notificationMessage,FBID)
    })
  })
}*/
function sendPlayerAsignNotification(notificationMessage,playerId,matchId,FBID){
  getMatchTeamNames(matchId,function(matchName){
    notificationMessage = notificationMessage.replace("matchName",matchName)
    getUserName(sender,function(senderName){
      notificationMessage = notificationMessage.replace("playerName",playerName)
      sendNotification(notificationMessage,receiver)
    })
  })
}

function sendPlayerAllotNotificationToLeagueMembers(notificationMessage,playerId,matchId,FBID){

  getPlayerName(playerId,function(playerName){
    notificationMessage = notificationMessage.replace("playerName",playerName)
    getUserName(FBID,function(userName){
      notificationMessage = notificationMessage.replace("userName",userName)
      db.Leagues_Info.find({matchId:matchId,users:FBID,leagueName:{$ne:{$regex:"piblicLEague"}}},function(err,leagues){
        if(err){
          console.log("error in getting leagues getFriendLeagueStatus " + err)
        }else{
          if(leagues){
            var i=0,n=leagues.length;
            function leagueLoop(i){
              var j=0,m = league[i].users.length;
              function userLoop(j){
                if(FBID == league[i].users[j]){
                  j++;
                  if(j != m)
                    userLoop(j)
                  if(j == m){
                    i++;
                    if(i != n)
                      leagueLoop(i)
                  }
                }else{
                  sendNotification(notificationMessage,league[i].users[j])
                  j++;
                  if(j != m)
                    userLoop(j)
                  if(j == m){
                    i++;
                    if(i != n)
                      leagueLoop(i)
                  }
                }
              }
              userLoop(j)
            }
            leagueLoop(i)
          }
        }
      })
      
    })
  })
}
function sendNotification(notificationMessage,userId){
  var notification = {};
  notification.user = userId;
  notification.message = notificationMessage;
  notification.createDate = new Date();
  console.log(notification)
  var notifications = new db.Notifications(notification);
  notifications.save(function(err,recs){
    if(err){
      console.log("error in saving notification " + err)
    }else{
      console.log("save notification ")
    }
  })
}

function sendLeagueJoinNotification(sender,receiver,matchId,notificationMessage){
  // sender == me ,  receiver == friend   ==> invitation
  // sender == friend ,  receiver == me   ==> accept
  // invitation to league notificationMessage = "senderName has invited to join in his league for the matchName match"
  // joined in league notificationMessage = "senderName has joined your league for the matchName match."
  getMatchTeamNames(matchId,function(matchName){
    notificationMessage = notificationMessage.replace("matchName",matchName)
    getUserName(sender,function(senderName){
      notificationMessage = notificationMessage.replace("senderName",senderName)
      sendNotification(notificationMessage,receiver)
    })
  })
  
}

function getMatchTeamNames(matchId,callback){
  db.Match_Shedule.findOne({matchId:matchId},{StartDate:1,"team1.teamName":1,"team2.teamName":1,matchId:1},function(err1,matches){
    if(err1){
      console.log("error in getting matches getMatchTeamNames" + err1)
    }else{
      if(matches){
        callback(matches.team1.teamName + " v " + matches.team2.teamName)
      }
    } 
  })
}

function sendLeaveLeagueNotification(userId,matchId){
  // send notification message to all his frineds when user leave the League
  getMatchTeamNames(matchId,function(matchName){
    var matchName = matchName;
    notificationMessage = notificationMessage.replace("matchName",matchName)
    getUserName(userId,function(userName){
      var userName = userName;
      getFriends(userId,function(friendsList){
        var i=0,n = frinedsList.length;
        function frinedsLoop(i){
          var friendId = frinedsList[i];
          getFriendLeagueStatus(frinedId,matchId,function(isHaveLeague){
            if(isHaveLeague){
              notificationMessage = userName + " is not in any league right now. Invite him to join yours for the " + matchName + " match."
            }else{
              notificationMessage = userName + " is not in any league right now. Create a league with him for the " + matchName + " match."
            }
            sendNotification(notificationMessage,frinedId)
            i++;
            if(i != n)
              frinedsLoop(i)
          })
        }
        frinedsLoop(i);
      })
    });
  })
}
function getFriends(userId,callback){
  db.userSchema.findOne({_id:userId},{FriendsList:1,_id:0},function(err,friendsList){
    if(err){
      console.log("error in getting userdata getFriends " + err)
    }else{
      if(frinedsList.length){
        callback(frinedsList)
      }
    }
  })
}
function getFriendLeagueStatus(frinedId,matchId,callback){
  db.Leagues_Info.find({matchId:matchId,users:friendId,leagueName:{$ne:{$regex:"piblicLEague"}}},function(err,league){
    if(err){
      console.log("error in getting leagues getFriendLeagueStatus " + err)
    }else{
      if(league){
        callback(1)
      }else{
        callback(0)
      }
    }
  })
}

function askForCreditsNotification(sender,receiver,notificationMessage){
  // ask friends sender = me, receiver = frined
  // grant to friend sender = friend, receiver = me
  getUserName(sender,function(senderName){
    notificationMessage = notificationMessage.replace("senderName",senderName)
    sendNotification(notificationMessage,receiver)
  })
}

function acceptAppInvitationNotification(userId,notificationMessage){
  sendNotification(notificationMessage,userId)
}


