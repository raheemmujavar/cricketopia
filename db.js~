var mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/mydatabase' );
var Schema   = mongoose.Schema;
var Schema1   = mongoose.Schema;
var Schema2   = mongoose.Schema;
var Schema3   = mongoose.Schema;
var Schema4   = mongoose.Schema;
var Schema5  = mongoose.Schema;
var Schema6  = mongoose.Schema;
var Schema7  = mongoose.Schema;
 
var userSchema = new Schema({
        _id : String,
        FBNAME : String,
        FBPIC:String,
        FBCITY:String,
        FBCOUNTRY:String,
        deviceToken:String,
        EMAIL : String,
        Credits : Number,
        FriendsList : Array,
        CreditsInfo : Array
});
 var userSchemacol = "userSchema"
exports.userSchema = mongoose.model( 'userSchema', userSchema, userSchemacol );


var match_shedules = new Schema1({
          matchId : Number, 
          mtype : String, 
          series_id : String, 
          series_name : String, 
          MatchNo : String, 
          StartDate : Date, 
          EndDate : Date, 
          team1 : Object, 
          team2 : Object
});
 var match_shedulescol = "match_shedules"
exports.match_shedules = mongoose.model( 'match_shedules', match_shedules, match_shedulescol );


var team_infos = new Schema2({
         teamId : Number, 
         teamName : String, 
         teamShortName : String, 
         teamLogoPath : String, 
         teamLogoSmallPath : String, 
         teamFlagPath : String, 
         teamSmallFlagPath : String, 
         teamRoundFlagPath : String, 
         teamSmallRoundFlagPath : String, 
         teamLargeRoundFlagPath : String, 
         players : Array
});
 var team_infoscol = "team_infos"
exports.team_infos = mongoose.model( 'team_infos', team_infos, team_infoscol );


var player_profiles = new Schema3({
           playerId : Number, 
           teamId : Number, 
           firstName : String, 
           lastName : String, 
           country : String, 
           fullname: String, 
           image : String,
           pic_url : String,
           otherInfo : String,
           batting_info : Object, 
           bowling_info : Object 
});
 var player_profilescol = "player_profiles"
exports.player_profiles = mongoose.model( 'player_profiles', player_profiles, player_profilescol );


var Player_Bid_Info = new Schema4({
         matchId: String,
         playerId : Number,
         bidInfo : Array,
         player_bids : Array,
         fantasyPoints : Array

});
 var Player_Bid_Infocol = "Player_Bid_Info"
exports.Player_Bid_Info = mongoose.model( 'Player_Bid_Info', Player_Bid_Info, Player_Bid_Infocol );


var matchplayers = new Schema5({
         matchId: Number,
         teams : Object
         
});
 var matchplayerscol = "matchplayers"
exports.matchplayers = mongoose.model( 'matchplayers', matchplayers, matchplayerscol );


var Leagues_Info = new Schema6({
         leagueName : String, 
         matchId : Number, 
         createdBy : String,
         leagueType : String, 
         users : Array
         
});
 var Leagues_Infocol = "Leagues_Info"
exports.Leagues_Info = mongoose.model( 'Leagues_Info', Leagues_Info, Leagues_Infocol );


var chat_Info = new Schema7({
         message : String, 
         FBID : String, 
         who : String,
         timestamp : Date
         
});
 var chat_Infocol = "chat_Info"
exports.chat_Info = mongoose.model( 'chat_Info', chat_Info, chat_Infocol );




 

 


