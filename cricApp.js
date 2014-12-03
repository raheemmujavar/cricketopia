//facebook information
userSchema = {
          FBID : String,
          FBNAME : String,
          FBPIC:String,
	      FBCITY:String,
	      FBCOUNTRY:String,
	      deviceToken:String,
	      EMAIL : String

}

//match schedule information
Match_Shedule = {
         	matchId : Number, 
         	mtype : String, 
         	series_id : String, 
         	series_name : String, 
         	MatchNo : String, 
         	StartDate : String, 
         	EndDate : String, 
         	team1 : Object, 
         	  		{
         	  		 "teamName":"Sri Lanka",
         	  		 "teamId":"8"
         	  		}
         	team2 : Object
         	        {
         	  		 "teamName":"India",
         	  		 "teamId":"9"
         	  		}

}

//Every team and team players information
Team_Info = {
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
}

//every player detail information
Player_Profile = {
           playerId : Number, 
           teamId : Number, 
           firstName : String, 
           lastName : String, 
           country : String, 
           fullname: String, 
           batting_info : Object, 
           bowling_info : Object 
}







//country wise all players career information with all details brief info available in down
// CareerStats =   
// 		{
// 			countryId : ----,
// 			countryName : -----,
// 			cricketers : [
// 				{cricketerId : -----, name : ----,fullName : ----, profilePic : ---, stats : {Tests:{},ODIs:{},Twenty20:{}}},
// 				{cricketerId : -----, name : ----,fullName : ----, profilePic : ---, stats : {Tests:{},ODIs:{},Twenty20:{}}}
// 			]
// 		}
	

//total match schedule information
// MatchSchedule = {
// 		{
// 			matchId : ------,
// 			matchName : -----,
// 			matchType : ------,
// 			tournamentName : -----,
// 			team1 : teamName,
// 			team2 : teamName,
// 			date : date
// 			startTime : time
// 		},
// 	.................
// }

//every match players bid information
MatchPlayers = {
	matchId :{
		teamName : [cricketerId:{name:---, averageBid:---, highestBid : ---, matchFantasyPoints : ---},  ...],
		teamName : [cricketerId:{name:---, averageBid:---, highestBid : ---, matchFantasyPoints : ---},  ...]
	},.....
}

// //every team logo information
// TeamLogo = {
// 	{teamName : ----, teamLogo : -----},....
// }

//User information
Users = {
	{userId : -----,userName: ----, credits: ----, fantasyPoints : ---, leagues : [leagueId,....], requestSent : [], frineds : [], userPic : --- },...
}


UserTeam = {
	userId: {matchId: {userTeamName: ---, cricketers: [cricketerId:{bidAmount:----, status : ----},.....]}}
}
Leagues = {
	{leagueId : ---, leagueName : ---, matchId: ---, users:[userId,....]},.....
}

ScoreBoard = {
	matchId : { 
	{inningsNo : {battingInfo : { teamId : ----,...},bowlingInfo : { teamId : ----,....}}},...
	}
}

Commentary = {
	matchId:{
		comments: []
	}
}

Chat = {
	{leagueId : ----, messages : [{messageId : ---, userId : ---, message : ---, timeStamp : ---}, ....]}, ...
}

News = {
	{
		newsId: ---, sourceLink: ---, timeStamp: ---, article: ----
	}, --------
}
//LeaderBoard

AppLeaderBoard = {
	{userId : fantasyPoints---},.....
}

MatchLeaderBoard = {
	matchId : {
		{userId : matchFantasyPoints---},.....
	},....
}

TournamentLeaderBoard = {
	tournamentName : {
		matches : [matchId,.....]
		users : {{userId : tournamentFantasyPoints---},.....}
	},....
}

AskForCredits = {
	{
		userId: ---, friendUserId: ---, status : ----('Accepted/Declined/Neutral')
	}, ....
}

Accounts = {
	{
		userId: ---, transactions:{
			{
				transactionId : ---,
				transactionType: 'credit/debit',
				amount: ---,
				balance: ---,
				message: ---,
				timeStamp: ---
			}, ....
		}
	}
}

FantasyDetails = {
	{
		userId: ---,
		matches : {
			{
				matchId : ---,
				cricketers : {
					cricketerId: ---,
					cricketerFantasyPoints: ---
				}
				matchFantasyPoints: ---,
				totalFantasyPointsAfterThisMatch: ---
			}, ....
		}
		totalFantasyPoints : ---
	}, ....
}
REDIS
------------------------------------------------------------------------------------------------------------

CHANNELS                    SUBSCRIBERS
----------------------------------------
cricketerChannel   -->    [userId,....]
.
.
.
.
leagueChannel      -->    [userId,....]
.
.
.






//cricketer document

{ "_id" : ObjectId("546c30734d8927ed14b749f2"), 
	"name" : "---",
	"fullname" : "----",
	"batting_info" : { 
		"Tests" : 
			{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---" },
		"ODIs" : 
			{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---" },
		 "Twenty20" : 
		 	{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---" }
	},
	"bowling_info" : { 
		"Tests" : 
			{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---" },
		"ODIs" : 
			{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---" },
		 "Twenty20" : 
		 	{ "Stumpings" : "---", "Catches" : "---", "Sixes" : "---", "Fours" : "---", "Fifties" : "---", "Hundreds" : "---", "StrikeRate" : "---", "BallsFaced" : "---", "Average" : "---", "HighScore" : "--", "Runs" : "---", "NotOuts" : "---", "Innings" : "---", "Matches" : "---", Maidens : "---" }
	}
}



