var mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/cricapp' );
var Schema   = mongoose.Schema;
var Schema1   = mongoose.Schema;
 
var userSchema = new Schema({
        _id : String,
        FBNAME : String,
        FBPIC:String,
        FBCITY:String,
        FBCOUNTRY:String,
        deviceToken:String,
        EMAIL : String
});
 var userSchemacol = "userSchema"
exports.userSchema = mongoose.model( 'userSchema', userSchema, userSchemacol );

var MatchSchedule = new Schema1({
          matchId : Number, 
          mtype : String, 
          series_id : String, 
          series_name : String, 
          MatchNo : String, 
          StartDate : String, 
          EndDate : String, 
          team1 : Object, 
          team2 : Object
});
 var MatchSchedulecol = "MatchSchedule"
exports.MatchSchedule = mongoose.model( 'MatchSchedule', MatchSchedule, MatchSchedulecol );



 

 


