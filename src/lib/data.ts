type SportEvent = {
	name: string,
	definition: string,
	subEvents?: SubEvent[],
	video: VideoClip
}

type SubEvent = {
	title: string,
	description: string,
	video?: VideoClip
}

type VideoClip = {
    videoId: string;
    start: number;
    end: number;
};

type Definitions = {
	[section: string]: SportEvent[]
}

export const footballDefinitions: Definitions = {
    "break-in-play": [
        {
            name: "Goalkick",
            definition: "A goal kick is awarded when the ball fully crosses the byline, either on the ground or in the air, after last being touched by an attacking player without a goal being scored. Although goal kicks are typically taken by the goalkeeper, it is not mandatory. Throws by the goalkeeper are not considered goal kicks.",
            subEvents: [
                { title: "Short Goal Kick", description: "Any goal kick that travels within 40 yards from the byline." },
                { title: "Long Goal Kick", description: "Any goal kick that lands beyond 40 yards from the byline." },
                { title: "Complete", description: "A goal kick that successfully reaches a teammate." },
                { title: "Incomplete", description: "A goal kick that fails to connect with a teammate." },
            ],
			video:{ 
				videoId :"",
				start: 0,
				end: 0,
			},
        },
        {
            name: "Foul",
            definition: "A foul is an infringement committed by a player that disrupts the flow of the game and violates the rules. Fouls are usually penalized with free kicks or penalty kicks, depending on their nature and location. Common types of fouls include tripping, holding, pushing, kicking, and charging. Offside violations are not recorded as fouls. Fouls committed inside the penalty area are not recorded as fouls but are noted as penalties won for the team or player.",
            subEvents: [
                { title: "Foul Won", description: "Recorded when a player from the team is fouled by an opponent." },
                { title: "Foul Conceded", description: "Recorded when a player from the team commits an infringement against an opponent.", video: { videoId: "YRJRdv5iXtU", start:  214, end:  220 } },
            ],
			video: {
				videoId: "YRJRdv5iXtU",
				start:  214,
				end:  220,
			}

        },
        {
            name: "Throw-in",
            definition: "A throw-in in football is a method of restarting play after the ball has completely crossed the touchline (sideline), either on the ground or in the air. The throw-in is awarded to the team that did not touch the ball last before it went out. The ball is then thrown back into play from the spot where it left the field. If a throw-in does not reach a teammate, the thrower is credited with a 'ball lost'.",
            subEvents: [
                { title: "Long Throw-in", description: "Executed in the opponent's final third, typically aimed at launching the ball into the penalty area to create a scoring opportunity for a teammate.", video: { videoId: "Y_DBpF-P_YI", start:  315, end:  319 } },
                { title: "Normal Throw-in", description: "Taken to simply restart play, regardless of where on the pitch the throw-in occurs." },
            ],
			video: {
				videoId: "Y_DBpF-P_YI",
				start: 315,
				end: 319,
			}
        },
        {
            name: "Freekick",
            definition: "In soccer, a free kick refers to a method of restarting play after a foul has been committed by the opposing team. The team that was fouled is awarded a free kick, which allows them to take a direct or indirect shot at the opponent's goal from the spot where the foul occurred.",
            subEvents: [
                { title: "Won", description: "Recorded when a free kick is awarded in the final third, credited to the player that wins the foul or one who causes the foul." },
                { title: "Taker", description: "Recorded under the player who restarts play after a free kick is awarded.", video: { videoId: "WGZ0DaxeDo4", start:  445, end:  452 } },
            ],
			video: {
				videoId: "WGZ0DaxeDo4",
				start:  445,
				end:  452,
			}

        },
        {
            name: "Cards",
            definition: "Cards are collected as yellow, second yellow which automatically qualifies as a red card, and then there is a direct red card. A second yellow card results in the player missing one match; a direct red card results in the player missing three consecutive matches. There are scenarios where a player receives a yellow card and also a red card in the same match. In that case, record both separately.",
            subEvents: [
                { title: "Yellow Card", description: "A caution issued by the referee for unsporting behaviour, dissent, or repeated infringements.", video: { videoId: "YRJRdv5iXtU", start:  216, end:  223 } },
                { title: "Second Yellow Card", description: "A second caution issued to the same player, resulting in an automatic red card and dismissal from the match." },
                { title: "Straight Red Card", description: "A direct dismissal issued by the referee for serious foul play, violent conduct, or denying an obvious goal-scoring opportunity." },
            ],
			video: {
				videoId: "YRJRdv5iXtU",
				start:  216,
				end:  223,
			}
        },
        {
            name: "Offside",
            definition: "A referee awards a free kick to a player seen to be in an offside position. But if two players are in an offside position when the pass is played, the player considered most active to get the ball concedes an offside offense.",
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Corners",
            definition: "A corner is a style of restarting play when the ball goes out of play over the goal line without being scored after last touching a member of the defending team. The kick is taken from the corner of the field nearest to where it went out of play.",
            subEvents: [
                { title: "Short Corner Kick", description: "A one-on-one situation where the kick is short." },
                { title: "In-swinging Corner", description: "A corner that curves towards the goal." },
                { title: "Out-swinging Corner", description: "A corner that curves away from the goal." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Goal",
            definition: "A goal is scored when the entire ball crosses the goal line between the goalposts and under the crossbar, provided that no infringement or foul has been committed by the attacking team during the process.",
            subEvents: [
                { title: "Open Play", description: "Goal scored from situations where a team builds up or has been in possession for a while." },
                { title: "Set-piece", description: "Goals from throw-in, corner kick, free kick, or penalty that directly lead to a goal or immediately following the set-piece being taken." },
                { title: "Penalty-rebound", description: "Recorded when a penalty is missed but a goal is scored with the rebound after a penalty miss." },
                { title: "Counter", description: "When a team wins the ball in their own half and stages an attack that leads to a goal." },
                { title: "Transition", description: "When the team wins the ball in the opponent's half and scores from that situation." },
				{title: "Free Kick", description: "When a goal is scored directly from a free kick.", video: { videoId: "WGZ0DaxeDo4", start:  445, end:  452 } },
            ],
			video: {
				videoId: "LKdAIOhW3C4?si=8AYS1CTdDm3rzgyo",
				start:  445,
				end:  452,
			}
        },
        {
            name: "Penalty",
            definition: "A penalty is a method of restarting play inside 12 yards awarded to the attacking team when a defensive foul occurs inside the defending team's penalty area.",
            subEvents: [
                { title: "Penalty Won", description: "Awarded to the player who is fouled in the 18-yard box." },
                { title: "Penalty Conceded", description: "Awarded to the player who commits the foul that leads to the penalty." },
                { title: "Penalty Miss", description: "Awarded to the player who misses to score the awarded penalty.", video: { videoId: "YRJRdv5iXtU", start:  333, end:  338 } },
            ],
			video: {
				videoId: "YRJRdv5iXtU",
				start:  333,
				end:  338,
			}
        }
    ],
    "goalkeeping":[
        {
            name: "Save",
            definition: "A successful attempt from the goalkeeper to prevent a shot from being scored, thus denying the opposing team a scoring opportunity.",
            subEvents: [
                { title: "Normal Saves", description: "Saves that occur during the normal 90 mins period.", video: { videoId: "Y_DBpF-P_YI", start: 467, end: 471 } },
                { title: "Penalty Saves", description: "Saves made by the goalkeeper from the opponents penalty kick during normal time (90 mins)." },
            ],
			video: {
				videoId: "Y_DBpF-P_YI",
				start:  467,
				end:  471,
			}
        },
        {
            name: "Throw-outs",
            definition: "Goalkeeper throw-outs are a method of restarting play where the goalkeeper throws the ball from their hands to a teammate, typically a defender or a midfielder, to initiate an attack or build-up play from the defensive zone.",
            subEvents: [
                { title: "Complete", description: "Throw-outs that reach the teammates." },
                { title: "Incomplete", description: "Throw-outs that don't reach the teammates." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Kick-outs",
            definition: "A kick-out is another method used by goalkeepers to distribute the ball. In this technique, the goalkeeper drops the ball from their hands and kicks it just before/after it bounces off the ground.",
            subEvents: [
                { title: "Complete", description: "A kick-out that reaches a teammate." },
                { title: "Incomplete", description: "A kick-out that fails to reach a teammate." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Claims",
            definition: "An attempt from the part of the goalkeeper to actively play a high cross or a long aerial pass in the air, either to claim or to punch the ball. The most common method of making a goalkeeper claim is by catching the ball with their hands. Goalkeeper claims not only involve physically securing the ball but also asserting authority in the penalty area.",
            subEvents: [
                { title: "Catch", description: "When the GK catches the ball." },
                { title: "Punch", description: "When the GK punches the ball." },
                { title: "Miss", description: "When the GK attempts to claim the ball but completely misses it." },
                { title: "Drop", description: "When the GK attempts to claim the ball but drops it after claiming it." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Run-outs",
            definition: "A run-out is a term used in football (soccer) to describe a goalkeeper who frequently ventures outside of their penalty area to act as an additional defender or playmaker. A run-out action by a goalkeeper provides additional defensive cover by quickly coming off their line to deal with through balls or aerial threats.",
            subEvents: [
                { title: "Successful Run-out", description: "When a goalkeeper successfully nullifies the danger." },
                { title: "Unsuccessful Run-out", description: "When a goalkeeper fails to nullify the danger." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        }
    ],
    "advanced-passing":[
        {
            name: "Assist",
            definition: "This is the last pass leading to a goal, it has to be a pass between team-mates. There are no assists awarded for winning a penalty or free kick from which a colleague scores directly, for having a shot saved when the rebound gets converted, or for playing a cross into the box that is half-cleared by a defender before a finish.",
			video: {
				videoId: "YRJRdv5iXtU",
				start:  85,
				end:  90,
			}
        },
        {
            name: "Progressive Pass",
            definition: "A forward pass that attempts to advance a team significantly closer to the opponent's goal. A progressive pass refers to a type of pass that advances the ball significantly forward on the field, usually into the attacking half or towards the opponent's goal. Progressive passes that emanate from the defensive 40 yards of the pitch should not be recorded as progressive passes but rather just normal passes. A progressive pass is considered successful if the next touch of the ball is by a teammate.",
            subEvents: [
                { title: "Complete Progressive Pass", description: "A progressive pass is considered successful if the next touch of the ball is by a teammate.", video: { videoId: "fw65HTZVrlU", start: 222, end: 230 } },
                { title: "Incomplete Progressive Pass", description: "A progressive pass that fails to reach a teammate." },
            ],
			video: {
				videoId: "",
				start:  222,
				end:  348,
			}
        },
        {
            name: "Cross",
            definition: "A cross is a type of pass made from the sides of the field, typically near the touchline, into the opponent's penalty area. At Tisini, crosses are categorized into two types based on the side of the attacking team. This definition excludes crosses from set-pieces such as corners or free kicks.",
            subEvents: [
                { title: "Cross Left", description: "Crosses made from the left side of the attacking team.", video: { videoId: "YRJRdv5iXtU", start:  85, end:  90 } },
                { title: "Cross Right", description: "Crosses made from the right side of the attacking team." },
                { title: "Incomplete", description: "When the cross fails to reach a teammate in the penalty area." },
                { title: "Complete", description: "When a teammate successfully connects with the cross in the penalty area." },
                { title: "Blocked", description: "When the cross is stopped by the first defender before it enters the penalty area." },
            ],
			video: {
				videoId: "YRJRdv5iXtU",
				start:  85,
				end:  90,
			}
        }
    ],
    "shots-and-attempts":[
        {
            name: "Shots",
            definition: "A shot in football is an attempt by a player to score by directing the ball toward the opponent's goal. These shots can be made using any allowed body part (except the hands or arms).",
            subEvents: [
                { title: "Shot In-box", description: "Shots taken from inside the opponent's penalty area." },
                { title: "Shot Out-box", description: "Shots taken from outside the opponent's penalty area." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name : "Shot On Target",
            definition: "A shot on target is any goal attempt that enters the net, regardless of the player's intent, or a clear goal attempt that would have gone into the net but was saved by the goalkeeper or blocked by the last defender. Shots that directly hit the goal's frame (posts or crossbar) are not counted as shots on target unless the ball enters the net and is awarded as a goal. Shots blocked by players who are not the last defender are not considered shots on target. Own goals are not considered attempts on target.",
			video: {
				videoId: "bAK3OeoOdlI",
				start:  95,
				end:  99,
			}
        },
        {
            name: "Shot Off Target",
            definition: "A shot off target is a clear attempt to score that misses the goal entirely, going over or wide without making contact with another player, or would have missed the goal even without the goalkeeper's intervention, or directly hits the frame of the goal (posts or crossbar) without resulting in a goal. Blocked shots are not considered attempts off target.",
			video: {
				videoId: "Wrgx97LQGlA",
				start:  146,
				end:  151,
			}
        },
        {
            name: "Shot Blocked",
            definition: "A shot that is stopped by a defender before it reaches the goal or the goalkeeper, by putting their body in the way.",
			video: {
				videoId: "Wrgx97LQGlA",
				start:  236,
				end:  240,
			}
        }
    ],
    "advanced-metrices": [
        {
            name: "Key Pass",
            definition: "A key pass is a pass that directly creates a goal-scoring chance for a teammate, resulting in a shot that is either on target, off target, or blocked. It should only be recorded during open play situations. The final pass before a goal is scored should not be recorded as a key pass but rather as an assist.",
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Set-Piece Chance",
            definition: "A set-piece chance occurs when a set-piece creates a direct goal-scoring opportunity for a teammate, leading to a shot that is on target, off target, or blocked. Set-piece chances should only be recorded from set-pieces taken within the final third of the pitch.",
            subEvents: [
                { title: "Corner Kick Chance", description: "A chance created directly from a corner kick." },
                { title: "Throw-in Chance", description: "A chance created directly from a throw-in." },
                { title: "Freekick Chance", description: "A chance created directly from a free kick." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Interception",
            definition: "An interception in football is an action where a player actively anticipates and intercepts the ball while the opponent is shooting, passing, or crossing. At Tisini, interceptions are recorded only when the team regains possession of the ball, meaning there must be a follow-up event such as an incomplete pass or a turnover.",
            subEvents: [
                { title: "Own Half Interception", description: "Interceptions that occur within the team's own half of the field.", video: { videoId: "5n8XR78VACs", start:  274, end:  278 } },
                { title: "Opp Half Interception", description: "Interceptions that take place in the opponent's half of the field." },
            ],
			video: {
				videoId: "5n8XR78VACs",
				start:  274,
				end:  278,
			}
        },
        {
            name: "Box Carry",
            definition: "In football, a box carry refers to a situation where a player dribbles or carries the ball into the opponent's penalty area, also known as the box. This action involves taking the ball into the 18-yard area with the aim of creating a goal-scoring opportunity.",
			video: {
				videoId: "5n8XR78VACs",
				start:  201,
				end:  205,
			}
        },
        {
            name: "Box Touch",
            definition: "In football, a box touch refers to any touch or contact made by a player within the opponent's penalty area, also known as the box. Key aspects include receiving the ball, dribbling, and passing. No ground duels, aerial duels or fouls are considered touches in the box.",
            subEvents: [
                { title: "Receiving in Box", description: "Receiving the ball inside the penalty area." },
                { title: "Dribbling in Box", description: "Dribbling inside the penalty area." },
                { title: "Passing in Box", description: "Passing from inside the penalty area." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Block",
            definition: "Blocks refers to a situation where a player attempts to kick the ball toward the goal in order to score, but an opposing player manages to intercept or deflect the shot, preventing it from reaching its intended target. Blocks recorded should be limited to those happening when an opposing player is taking a shot on goal.",
			video: {
				videoId: "Wrgx97LQGlA",
				start:  236,
				end:  240,
			}
        },
        {
            name: "Clearance",
            definition: "An action (generally a pass) when the player, while having other options to pass or to hold the ball, is instead clearing it, either with a long pass forward without a precise target or for a throw in/corner kick, playing safe. Most of the time the player clearing the ball would be under pressure. A significant amount of clearances are long forward passes. About half of clearances are interceptions where a player interrupts a pass to clear the ball out.",
			video: {
				videoId: "bAK3OeoOdlI",
				start:  69,
				end:  75,
			}
        },
        {
            name: "Tackle",
            definition: "A tackle refers to a defensive action where a player attempts to dispossess an opponent of the ball by cleanly making contact with the ball using their foot while avoiding illegal contact with the opponent. A successful tackle does not necessarily lead to the team regaining the ball but has played its part in stopping the opponent's attack.",
            subEvents: [
                { title: "Successful Tackle", description: "A tackle that successfully stops the opponent's attack, regardless of whether possession is regained." },
                { title: "Tackle Lost", description: "When the player attempts to win the ball but is not successful on their attempts." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Dribble",
            definition: "A dribble is an attempt to move past an opposing player whilst trying to maintain possession of the ball. The player that has the possession of the ball is using their ability in an attempt to move past the opposition player or to find a free zone for the next action. When a player shields and guards the ball using his physical strength, this is not a dribble. When a player dribbles past three or four players in succession, that is recorded as one complete dribble. A complete dribble should be followed by another event such as a shot, pass, cross, or foul.",
            subEvents: [
                { title: "Complete Dribble", description: "A successful dribble past an opponent, should be followed by another event such as a shot, pass, cross, or foul.", video: { videoId: "PNRI_tZJcg8", start:  262, end:  268 } },
                { title: "Incomplete Dribble", description: "When the player attempts to take on a player but completely fails by losing the ball." },
                { title: "Multiple Player Dribble", description: "When a player dribbles past three or four players in succession, recorded as one complete dribble." },
            ],
			video: {
				videoId: "PNRI_tZJcg8",
				start:  262,
				end:  268,
			}
        },
        {
            name: "Ball",
            definition: "Ball is an event associated with the team's possession of the ball. Ball Lost occurs when a team loses control of the ball to the opposing team. Possession can be lost due to various reasons such as a misplaced pass, a failed dribble, a tackle by an opponent, the ball going out of play, or an intercepted pass. Ball Won happens when a team successfully gains control of the ball from the opposing team. Incomplete passes should not be recorded as Ball Lost.",
            subEvents: [
                { title: "Ball Lost", description: "Occurs when a team loses control of the ball to the opposing team due to a misplaced pass, failed dribble, tackle, or intercepted pass." },
                { title: "Ball Won", description: "Happens when a team successfully gains control of the ball from the opposing team through interceptions, tackles, or winning aerial duels." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
        {
            name: "Aerial Duel",
            definition: "An aerial duel is when two or more players from opposing teams jump to compete for the ball. Aerial duels are not currently divided into offensive and defensive categories. If there are more than two players competing for the ball at the same time, an aerial duel will be recorded for all opposing players. An aerial duel is considered won in favour of the player who touches the ball first, no matter what happens next. An aerial duel that results in a foul is considered won in favour of the player who suffered a foul.",
            subEvents: [
                { title: "Won Aerial Duel", description: "An aerial duel is considered won in favour of the player who touches the ball first, no matter what happens next." },
                { title: "Foul Aerial Duel", description: "An aerial duel that results in a foul is considered won in favour of the player who suffered a foul." },
                { title: "Multiple Player Aerial Duel", description: "If there are more than two players competing for the ball at the same time, an aerial duel will be recorded for all opposing players." },
            ],
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        },
    ],
    "note": [
        {
            name: "Additional Clarification",
            definition: "When a touch is made by a goalkeeper, but is not seen by the referee, we align our event in accordance with the referee's decision. For example, if there is a slight touch which prevents a goal from being scored, this would usually be credited as a Shot On Target and Save followed by a Corner. However, when the referee does not see the goalkeeper's touch, we would award per the referee's decision, which in this instance would be a Shot Off Target and Goal Kick.",
			video: {
				videoId: "",
				start:  0,
				end:  0,
			}
        }
    ]
}


export const rugbyDefinitions: Definitions = {
	"attack": [
		{
			name: "Pass",
			definition: "A deliberate action by a player to transfer the ball to a teammate using the hands (including backward passes or knock-backs). This includes all general play passes and restart phases.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Offload",
			definition: "When a player throws the ball whilst in the process of being tackled. In an event where a player has been brought to ground and manages to pass the ball away before a ruck is formed is also deemed to have completed an offload.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Carries",
			definition: "Any instance where a player runs with the ball in hand and engages physical contact with a defender. Carries are recorded based on field position: Own 22, Own 50, Opponent 50, and Opponent 22.",
			subEvents: [
				{ title: "Own 22 Carry", description: "A carry that begins within the team's own 22-metre area." },
				{ title: "Own 50 Carry", description: "A carry that begins within the team's own half but outside the 22." },
				{ title: "Opposition 50 Carry", description: "A carry that begins within the opponent's half but outside their 22." },
				{ title: "Opposition 22 Carry", description: "A carry that begins within the opponent's 22-metre area." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Phase",
			definition: "A phase is the period of play between two successive breakdowns. When recording, phases are accompanied by the zone where they occurred.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Defenders Beaten",
			definition: "A tally of how many times a ball carrier successfully evaded or powered through defenders during a single phase of play. As long as there is an attempt in tackle that is a defender beaten. In case of a chip over or kick or step without any attempt in tackle, that is not a defender beaten. Note that Defenders Beaten for Team A should tally with Missed Tackles for Team B.",
			subEvents: [
				{ title: "Evaded Defender", description: "A ball carrier who successfully evades a defender without contact." },
				{ title: "Powered Through Defender", description: "A ball carrier who powers through a tackle attempt." },
				{ title: "Chip/Step Without Contact", description: "A chip over, kick, or step without any tackle attempt is not a defender beaten." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Linebreak",
			definition: "An action where an attacking player successfully breaches the primary defensive line and enters open space beyond the first line of defence. A linebreak is recorded once per continuous attacking action and ends when the ball carrier is tackled, brought to ground, or the phase is ended.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Score",
			definition: "Scoring actions and scoring attempts recorded during a match.",
			subEvents: [
				{ title: "Try", description: "Awarded when a player grounds the ball in the opposition's in-goal area in accordance with the Laws of the Game." },
				{ title: "Penalty Try", description: "Awarded by the referee when a try would probably have been scored but for foul play by the defending team. This event is recorded against the player whose action directly contributed to the penalty try being scored, or for a team effort to the team." },
				{ title: "Successful Conversion", description: "A successful place kick or drop kick taken after a try, resulting in two additional points." },
				{ title: "Missed Conversion", description: "An unsuccessful conversion attempt following a try." },
				{ title: "Successful Penalty", description: "A successful penalty goal kicked through the goalposts, resulting in three points." },
				{ title: "Missed Penalty", description: "An unsuccessful penalty goal attempt." },
				{ title: "Successful Drop Goal", description: "A successful drop kick during open play that passes through the goalposts and over the crossbar, resulting in three points." },
				{ title: "Missed Drop Goal", description: "An unsuccessful drop goal attempt during open play." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Assist",
			definition: "An action by a player that directly contributes to a Linebreak, a Try, or both.",
			subEvents: [
				{ title: "Try Assist", description: "The final pass or kick that directly results in a try." },
				{ title: "Linebreak Assist", description: "The final pass or kick that directly creates a linebreak." },
				{ title: "Linebreak + Try Assist", description: "The same pass or kick directly creates both the linebreak and the try." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Visit in Opponents 22",
			definition: "A statistical marker recorded when the attacking team enters and gains possession within the opposition's 22-metre area, regardless of how possession is gained. This includes situations where the attacking team carries or plays the ball into the opposition 22 and maintains possession; possession is regained inside the opposition 22 through turnover, kick receipt, or restart; a set-piece is taken inside the opposition 22; and if the ball is taken into touch inside the opposition 22 following attacking action, the visit is still recorded based on attacking team entry into the zone, not the final point of possession.",
			subEvents: [
				{ title: "Carry Entry", description: "The attacking team carries or plays the ball into the opposition 22 and maintains possession." },
				{ title: "Turnover Entry", description: "Possession is regained inside the opposition 22 through turnover, kick receipt, or restart." },
				{ title: "Set-piece Entry", description: "A set-piece (e.g., lineout) is taken inside the opposition 22." },
				{ title: "Touch Entry", description: "If the ball is taken into touch inside the opposition 22 following attacking action, the visit is still recorded." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Step Out",
			definition: "An event where a ball carrier in possession of the ball makes contact with the touchline or goes into touch with any part of the body or foot, either accidentally or as a result of pressure, resulting in a lineout being awarded.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Tryline Held Up",
			definition: "An event recorded against an attacking player when they are prevented from grounding the ball by one or more defenders during an attempt to score a try, resulting in no try being awarded.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Ball Carrier Held Up",
			definition: "An event where a ball carrier is held by one or more defenders in contact and is unable to continue play, resulting in the ball becoming unplayable. This typically leads to a scrum being awarded to the defending team. This event is recorded against the ball carrier.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Source of Try",
			definition: "The Source of Try identifies the primary origin of possession or attacking platform from which a try is scored.",
			subEvents: [
				{ title: "General Phase Play", description: "A try scored from open play after multiple phases that cannot be directly attributed to a specific set piece." },
				{ title: "Turnover Won", description: "A try scored from possession gained through a turnover, including breakdown steals, interceptions, counter-rucks, maul turnovers, or ball steals." },
				{ title: "Lineout", description: "A try scored directly from a lineout possession, including lineout moves and subsequent attacking actions." },
				{ title: "Scrum", description: "A try scored directly from a scrum possession, including planned scrum plays." },
				{ title: "Tap", description: "A try scored from a quick tap or set tap penalty/free kick." },
				{ title: "Maul", description: "A try scored directly from a maul, including driving mauls." },
				{ title: "Restart", description: "A try scored from possession gained directly from a restart, including kick-offs, 22-metre dropouts, and goal-line dropouts." },
				{ title: "Attacking Kick", description: "A try scored as a direct result of an attacking kick, including grubbers, chips, cross-field kicks, or other tactical kicks regathered by the attacking team." },
				{ title: "Kick Receipt Counter", description: "A try scored following possession gained from receiving an opposition kick and launching an immediate counter-attack." },
				{ title: "Note", description: "The Source of Try is recorded for all tries scored including Penalty Tries." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"handling-errors": [
		{
			name: "Knock On",
			definition: "An error where a player accidentally loses possession of the ball forward, or the ball is knocked from their hand or arm and travels forward, touching the ground or another player before being regathered. Results in a scrum awarded to the opposing team.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Forward Pass",
			definition: "An illegal pass where the ball is thrown or passed forward relative to the passer or towards the opposition's try line, resulting in a stoppage and a scrum awarded to the opposing team.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Incomplete Pass",
			definition: "A pass attempt that is not successfully received by a teammate, resulting in a loss of possession or stoppage in play. This includes passes that are intercepted or go into touch.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lost Ball in Carry",
			definition: "A loss of possession during a carry due to contact, including the ball being stripped by a defender, knocked back or dropped while in contact. This does not include situations where the ball is retained or recycled into a ruck.",
			subEvents: [
				{ title: "Stripped", description: "The ball is stripped from the ball carrier's grasp." },
				{ title: "Knocked Loose", description: "The ball is knocked loose during a collision." },
				{ title: "Deliberately Dislodged", description: "The ball is deliberately dislodged by a defending player." },
				{ title: "Held Up", description: "The ball carrier is held up in a tackle." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"defense": [
		{
			name: "Tackle",
			definition: "An event where a defender successfully engages the ball carrier in contact, resulting in the attacker being stopped, held up, or brought to ground. A tackle is considered complete when the ball carrier's progress is effectively stopped.",
			subEvents: [
				{ title: "Positive Tackle", description: "A tackle where the defender dominates the collision, driving the attacker backwards.", video: { videoId: "V0UKtnwL7Ss", start: 1795, end: 1800 }},
				{ title: "Negative Tackle", description: "A tackle where the attacker breaks or carries momentum forward through contact.", video: { videoId: "V0UKtnwL7Ss", start: 1270, end: 1274 } },
				{ title: "Held Up Tackle", description: "When the ball carrier is held in contact by one or more defenders resulting in an unplayable maul." },
				{ title: "Neutral Tackle", description: "When neither attacker nor defender shows clear dominance in the collision.", video: { videoId: "V0UKtnwL7Ss", start: 2022, end: 2027 } },
				{ title: "Try Saving Tackle", description: "Recorded when a defender prevents a probable try from being scored through a successful tackle or defensive intervention.", video: { videoId: "V0UKtnwL7Ss", start: 2616, end: 2624 } },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Missed Tackle",
			definition: "An attempted tackle where the defender fails to make effective contact or complete the tackle, allowing the ball carrier to break through or continue their run without being stopped.",
			video: {
				videoId: "V0UKtnwL7Ss",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Turnover",
			definition: "A turnover is recorded when a player or team gains possession directly from the opposition during active play. Only the player primarily responsible for winning possession should be credited with the turnover. Turnovers won from penalties and free kicks are recorded as penalty gains.",
			subEvents: [
				{ title: "Pass Intercept", description: "A player successfully catches or gathers an opposition pass before it reaches the intended receiver." },
				{ title: "Ball Steal", description: "A player legally strips or takes possession of the ball directly from an opposition ball carrier." },
				{ title: "Breakdown Jackal", description: "A player legally wins possession at the breakdown by contesting the ball after a tackle." },
				{ title: "Counter Ruck", description: "A turnover won by driving the opposition off the ball at a ruck." },
				{ title: "Maul Turnover", description: "A turnover won when the defending team successfully stops a maul and gains possession." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Linebreak Against",
			definition: "An event recorded when a defending team's primary defensive line is successfully breached by an attacking player. In individual coding, the event is attributed to the defender who was directly beaten or missed the tackle in the defensive line.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"set-pieces": [
		{
			name: "Scrum",
			definition: "A scrum event is recorded whenever a team is awarded a scrum. The outcome is determined by the result of the scrum, including possession retained, possession lost, penalties won, penalties conceded, or free kicks. The scrum event is assigned to the hooker in rugby 15s and the scrumhalf in rugby 7s and 10s. We credit the scrum steal to the person whose action directly led to the team winning the steal and the rest of the players involved in the scrum with a Team Effort - Scrum Steal.",
			subEvents: [
				{ title: "Won", description: "The team awarded the scrum achieves a positive outcome by winning possession or a penalty/freekick." },
				{ title: "Lost", description: "The team awarded the scrum fails to achieve a positive outcome by losing possession or conceding a penalty/freekick." },
				{ title: "Stolen", description: "The team not awarded the scrum wins possession or a positive outcome from the opposition's scrum." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lineout",
			definition: "A lineout in rugby is a method of restarting play after the ball has gone out of bounds on the sidelines.",
			subEvents: [
				{ title: "Lineout Won", description: "Team A regains possession from their lineout throw." , video: { videoId: "V0UKtnwL7Ss", start: 877, end: 882 }},
				{ title: "Lineout Lost", description: "Team A fails to regain possession from their lineout throw." , video: { videoId: "V0UKtnwL7Ss", start: 1829, end: 1834 }},
				{ title: "Lineout Stolen", description: "Team B successfully steals the ball from Team A's lineout."},
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lineout Throw",
			definition: "A lineout throw is recorded against the hooker (or player taking the throw) and is classified based on whether possession is successfully retained or lost. Every lineout throw should be tagged according to the intended target area of the throw. For successful lineouts, the position recorded is where the ball was caught. For unsuccessful lineouts, the position recorded is where the ball was intended to be thrown.",
			subEvents: [
				{ title: "Won", description: "The throwing team successfully secures possession from the lineout, wins a penalty/freekick during the lineout contest, or the opposing team knocks on in the lineout." },
				{ title: "Lost", description: "The throwing team fails to secure possession from the lineout, by either knocking on, conceding a freekick/penalty, ball not travelling straight, or the throw not being caught by the jumper in the lineout." },
				{ title: "Front Throw", description: "The throw is targeted at the front of the lineout." },
				{ title: "Middle Throw", description: "The throw is targeted at the middle of the lineout." },
				{ title: "Back Throw", description: "The throw is targeted at the back of the lineout." },
				{ title: "Overthrow", description: "The throw travels beyond the intended target." },
				{ title: "Quickthrow", description: "A quick throw-in taken before the lineout is fully formed." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lineout Jumper",
			definition: "A lineout jumper event is recorded against the player contesting for possession in the lineout. In case of a lineout steal, we credit the jumper with a Lineout Jumper - Steal and the lifters of the jumper with a Team Effort - Lineout.",
			subEvents: [
				{ title: "Won", description: "The jumper successfully secures possession for their team from the lineout." },
				{ title: "Lost", description: "The jumper fails to secure possession from their own team's lineout." },
				{ title: "Stolen", description: "The jumper successfully wins possession from the opposition's lineout." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Maul",
			definition: "A maul occurs when the ball carrier is held by one or more opponents while remaining on their feet and is joined by at least one teammate, with all players bound together and moving or contesting for possession. This event is assigned to the player who goes into contact with the ball and initiates the maul.",
			subEvents: [
				{ title: "Successful Maul", description: "A maul that moves the team forward while retaining possession, wins a penalty or free kick, or results in a try." },
				{ title: "Unsuccessful Maul", description: "A maul that fails to make forward progress, loses possession, becomes unplayable, or results in a penalty against the attacking team." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Restart Reception",
			definition: "A Restart Reception is recorded for the receiving team on every legally executed restart kick, regardless of whether a player makes an attempt to catch or recover the ball. If a Restart Reception outcome occurs without a receiving team player attempting to catch or recover the ball, the event should be credited to the receiving team player closest to the ball. If the kicking team knocks on during the chase and the receiving team gains possession, Restart Reception Won is credited to the closest receiving player. If the kicking team regathers the restart uncontested, Restart Reception Lost is credited to the closest receiving player.",
			subEvents: [
				{ title: "Uncontested Won", description: "The receiving team secures possession of the restart without pressure or contest from the kicking team." },
				{ title: "Uncontested Lost", description: "The receiving team fails to secure possession of an uncontested restart." },
				{ title: "Contested Won", description: "The receiving team secures possession despite pressure or a contest from the kicking team." },
				{ title: "Contested Lost", description: "The receiving team fails to secure possession in a contested restart situation." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Restart Retrieval",
			definition: "A Restart Retrieval is recorded for the kicking team when they actively attempt to regather possession from their own restart kick.",
			subEvents: [
				{ title: "Uncontested Won", description: "The kicking team regathers possession without meaningful opposition contest." },
				{ title: "Uncontested Lost", description: "The kicking team attempts to regather possession but is unsuccessful in an uncontested situation." },
				{ title: "Contested Won", description: "The kicking team successfully regathers possession following a contest with the receiving team." },
				{ title: "Contested Lost", description: "The kicking team attempts to regather possession but loses the contest." },
				{ title: "Restart Error", description: "The kicking team commits an error while attempting to regather the restart, resulting in a loss of possession or stoppage in play." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"kicking": [
		{
			name: "Kick from hand",
			definition: "A kick from hand is recorded whenever a player deliberately kicks the ball during open play.",
			subEvents: [
				{ title: "Caught", description: "The kick is successfully caught by the opposition." },
				{ title: "Into Space", description: "A kick that lands in open space and is subsequently recovered by the opposition after bouncing, without being caught directly from the kick." },
				{ title: "Retrieved", description: "The kicking team regathers possession of the ball following the kick." },
				{ title: "Lineout", description: "The kick results in a lineout being awarded." },
				{ title: "50-22", description: "The kick travels from within the team's own half and goes into touch inside the opposition 22-metre area." },
				{ title: "Straight Out", description: "The ball is kicked directly into touch without achieving a territorial or tactical advantage." },
				{ title: "Dead Ball", description: "The kick results in the ball becoming dead in-goal or crossing the dead-ball line." },
				{ title: "Knocked On", description: "The receiving player fails to gather the kick cleanly and knocks the ball on." },
				{ title: "Charged Down", description: "The kick is blocked by an opposition player before travelling downfield." },
				{ title: "Half Time", description: "The kick results in the referee ending the first half." },
				{ title: "Full Time", description: "The kick results in the referee ending the match." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Kick Type",
			definition: "A Kick Type is recorded to classify the technique or tactical intent of a kick made during play.",
			subEvents: [
				{ title: "Up and Under", description: "A high, contestable kick designed to allow the kicking team to compete for possession when the ball comes down.", video: { videoId: "V0UKtnwL7Ss", start: 496, end: 403 } },
				{ title: "Grubber", description: "A low kick played along or close to the ground, typically intended to travel through the defensive line or into space behind the defence.", video: { videoId: "V0UKtnwL7Ss", start: 2332, end: 2337 } },
				{ title: "Cross Kick", description: "A kick played laterally across the field towards a teammate or open space on the opposite side of the pitch.", video: { videoId: "V0UKtnwL7Ss", start: 892, end: 898 } },
				{ title: "Chip Kick", description: "A short kick played over the defensive line with the intention of regathering possession or creating an attacking opportunity behind the defence.", video: { videoId: "V0UKtnwL7Ss", start: 514, end: 520 } },
				{ title: "Box Kick", description: "A kick played from the base of a ruck, maul, or scrum, usually by the scrum-half, to gain territory or create a contestable aerial situation.", video: { videoId: "V0UKtnwL7Ss", start: 378, end: 386 } },
				{ title: "Territorial Kick", description: "A kick primarily intended to gain field position by moving play deeper into opposition territory.", video: { videoId: "V0UKtnwL7Ss", start: 32, end: 38 } },
				{ title: "Kick for Touch", description: "A kick intentionally directed into touch to gain territory or secure a lineout opportunity.", video: { videoId: "V0UKtnwL7Ss", start: 1889, end: 1898 } },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Kick Reception",
			definition: "A Kick Reception is recorded when a player attempts to receive an opposition kick during open play.",
			subEvents: [
				{ title: "Caught", description: "The player successfully catches the kick and retains possession." },
				{ title: "Knocked On", description: "The player fails to secure possession and knocks the ball forward, resulting in a knock-on." },
				{ title: "Knocked Back", description: "The player makes contact with the ball and knocks it backwards, allowing play to continue." },
				{ title: "Missed", description: "The player attempts to receive the kick but fails to make contact with the ball." },
				{ title: "Bounce", description: "Where the player allows the ball to bounce." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"discipline": [
		{
			name: "Penalties Conceded",
			definition: "A penalty conceded is recorded whenever a player is penalized by the referee for an infringement that results in a penalty being awarded to the opposition. Penalties should be coded according to the infringement identified and signalled by the referee. Where possible, analysts should use the referee's verbal communication and arm signals to determine the correct penalty type.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Freekick Conceded",
			definition: "A free kick conceded is recorded whenever a player or team commits an infringement that results in a free kick being awarded to the opposition.",
			subEvents: [
				{ title: "Lineout Freekick", description: "A free kick conceded from a lineout infringement." },
				{ title: "Scrum Freekick", description: "A free kick conceded from a scrum infringement." },
				{ title: "General Play Freekick", description: "A free kick conceded during open play or any phase outside a scrum or lineout." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Cards",
			definition: "A card is recorded when a player is temporarily or permanently sanctioned by the referee for foul play, repeated infringements, or misconduct.",
			subEvents: [
				{ title: "Yellow Card", description: "A temporary suspension." },
				{ title: "Straight Red Card", description: "A permanent dismissal from the match." },
				{ title: "Red Card (Second Yellow)", description: "Two yellow cards awarded to the same player equals a red card." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Penalty Gain",
			definition: "A Penalty Gain is recorded when a team is awarded a penalty and elects a specific option to restart or continue play. The event is classified according to the option chosen by the team.",
			subEvents: [
				{ title: "Unsuccessful Kick for Touch", description: "The team attempts to kick the penalty into touch but fails to gain the intended territorial advantage." },
				{ title: "Quick Tap", description: "The team restarts play immediately from the penalty mark by tapping the ball and running or passing." },
				{ title: "Scrum", description: "The team elects to take a scrum from the penalty." },
				{ title: "Points", description: "The team elects to attempt a shot at goal from the penalty." },
				{ title: "Lineout", description: "The team kicks the ball into touch and is awarded the resulting lineout." },
				{ title: "Set Tap", description: "The team deliberately delays the restart to organise attacking structures before tapping and restarting play." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Advantage Gained",
			definition: "An event recorded when the referee plays an advantage following an infringement by the opposing team, allowing the non-offending team to continue play with the opportunity to gain a territorial or tactical benefit before the penalty is awarded.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"team-effort": [
		{
			name: "Try Assist",
			definition: "Recorded when multiple players contribute significantly to the final action leading to a try, making it difficult to identify a single player as the primary try assist provider.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lineout Steal",
			definition: "Recorded when a lineout steal is the result of a coordinated team effort involving the throw contest, lifting, timing, and pressure, rather than being attributable to a single jumper.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Scrum Steal",
			definition: "Recorded when possession is won against the opposition feed through collective scrum dominance and cannot be credited to an individual player.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"Notes": [
		{ 
			name: "Advantage Play", 
			definition: "If a team is playing under advantage and commits an error during the advantage period that results in the referee calling No Advantage Gained and returning to the initial infringement by the defending team, the subsequent error is not recorded, as play is brought back to the original offence and the error has no impact on the outcome of play.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name:"For every Lineout Throw - Won",
			definition: "there has to be a subsequent Lineout Jumper - Won. For Lineout Throw - Lost, we record Lineout Jumper - Lost if the action or inaction of the jumper also lead to the lineout being lost. eg poor timing, knock-on in lineout, lost contest in the lineout, the jumper concedes a penalty or freekick during the lineout. For every Kick from Hand, there has to be a subsequent Kick Type recorded. A timed out conversion is still considered a Missed Conversion.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		
		}
	]
};


export const basketballDefinitions: Definitions = {
	"offense": [
		{
			name: "2-Point Field Goal Made",
			definition: "A successful shot attempt from inside the three-point arc that scores two points. Recorded when the ball passes through the basket from a 2-point attempt.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "2-Point Field Goal Attempted",
			definition: "A shot attempt from inside the three-point arc that does not result in a made basket. Includes missed shots that are rebounded by either team, blocked shots, and shots that go out of bounds off the shooter.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "3-Point Field Goal Made",
			definition: "A successful shot attempt from behind the three-point arc that scores three points. The shooter must have both feet behind the line at the time of release for the attempt to be classified as a three-pointer.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "3-Point Field Goal Attempted",
			definition: "A shot attempt from behind the three-point arc that does not result in a made basket. Recorded when the shooter has both feet behind the three-point line at release.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Free Throw Made",
			definition: "An unopposed shot attempt from the free throw line that scores one point. Awarded after certain fouls or violations. Recorded when the ball passes through the basket from a free throw attempt.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Free Throw Attempted",
			definition: "An unopposed shot attempt from the free throw line that does not result in a made basket. Recorded on every missed free throw, including the front end of one-and-one or bonus situations.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "And-One",
			definition: "A made field goal (2-point or 3-point) on which the shooter is fouled and awarded a subsequent free throw attempt. Record the made basket under the appropriate field goal category and record the free throw attempt separately. The foul is recorded as a shooting foul.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Points in the Paint",
			definition: "A made field goal scored from within the free throw lane (the paint). Recorded when the shooter releases the ball from inside the lane area. Does not include free throws.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Fast Break Points",
			definition: "Points scored during a fast break opportunity — a possession where the offensive team pushes the ball quickly up the court after a defensive stop, rebound, or steal, before the defense is fully set. Record the made basket and tag it as a fast break score.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Second Chance Points",
			definition: "Points scored on a possession immediately following an offensive rebound. The offensive team retains possession after a missed shot and scores on the same trip. Record the made basket and tag it as a second chance score.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Points off Turnovers",
			definition: "Points scored on a possession immediately following a turnover by the opposing team. The scoring team gains possession from an opponent error and converts it into points on the same trip. Record the made basket and tag it as points off a turnover.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Drive",
			definition: "A purposeful attack of the basket off the dribble from the perimeter, resulting in a shot attempt, pass, or turnover. The player must start outside the paint and dribble into the lane or toward the rim. Recorded when the drive results in a shot, assist, or turnover.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Catch and Shoot",
			definition: "A shot attempt where the player catches a pass and shoots without taking a dribble. The ball must be released before the first dribble. Recorded on both made and missed attempts.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Pull Up Shot",
			definition: "A shot attempt taken after one or more dribbles. The player dribbles into the attempt and pulls up for a jump shot or floater rather than driving to the rim. Recorded on both made and missed attempts.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Post Touch",
			definition: "An offensive possession where a player receives the ball with their back to the basket in the post area (low block or high post) and attempts a shot, pass, or is fouled. Recorded when the player establishes post position and makes a basketball play.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Shot Attempt Blocked",
			definition: "A field goal attempt by a player that is legally deflected by a defender before the ball reaches the basket. Recorded against the offensive player whose shot was blocked and credited to the defender as a block.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"playmaking": [
		{
			name: "Assist",
			definition: "A pass that directly leads to a made field goal by a teammate. The scorer may take up to one dribble after receiving the pass before shooting. If the scorer takes multiple dribbles or executes a significant move, the pass should not be recorded as an assist. Recorded only on made baskets.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Secondary Assist",
			definition: "A pass to a teammate who immediately records an assist on the next pass, without taking a dribble or making a significant move. The secondary assist must occur within one second and without a dribble between the two passes. Also known as a hockey assist.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Free Throw Assist",
			definition: "A pass to a teammate who is fouled in the act of shooting within one dribble of receiving the pass, resulting in free throw attempts. The pass must directly lead to the shooting foul without the recipient taking multiple dribbles.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Screen Assist",
			definition: "An on-ball or off-ball screen set by a player that directly leads to a made field goal by the screened teammate. The screener must make legal contact with the defender and the teammate must score on the same possession as a direct result of the screen action.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Pass",
			definition: "A deliberate transfer of the ball from one player to a teammate using the hands. Recorded when a player intentionally moves the ball to a teammate in an attempt to advance the offense or create a scoring opportunity. Excludes dribble hand-offs unless the recipient immediately shoots.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Turnover",
			definition: "A loss of possession by the offensive team to the defense. Recorded when the offense loses the ball due to a stolen pass, lost dribble, stepping out of bounds, offensive foul, shot clock violation, traveling, double dribble, or thrown ball out of bounds. Each turnover is credited to the player who last possessed the ball or committed the violation.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Bad Pass Turnover",
			definition: "A turnover resulting from an errant pass that goes out of bounds, is intercepted by a defender (steal), or is thrown to a teammate who cannot control it and loses possession. Credited to the passer.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Lost Ball Turnover",
			definition: "A turnover resulting from a player losing control of their dribble, being stripped by a defender, fumbling the ball out of bounds, or traveling. Credited to the player who lost possession.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Offensive Foul Turnover",
			definition: "A turnover resulting from an offensive foul committed by a player in possession of the ball or setting an illegal screen. The foul results in a change of possession. Credited to the player who committed the foul.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Shot Clock Violation",
			definition: "A turnover recorded when the offensive team fails to attempt a shot that hits the rim before the 24-second shot clock expires. Credited to the team as a turnover; no individual player is charged unless the ball is in a specific player's possession at expiration.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"defense": [
		{
			name: "Steal",
			definition: "A defensive action where a player legally takes possession of the ball from an offensive player, causing a turnover. Recorded when a defender intercepts a pass, strips the ball from a dribbler, or recovers a loose ball created by their own defensive pressure. Credited to the player who secures possession or directly causes the turnover.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Block",
			definition: "A defensive action where a defender legally deflects an offensive player's shot attempt before the ball reaches the basket. The block is credited to the defender who makes contact with the ball. A blocked shot is also recorded as a missed field goal attempt against the shooter.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Contested Shot",
			definition: "A defensive action where a defender raises a hand and actively challenges an offensive player's shot attempt at or before the time of release. The defender must be within an arm's length of the shooter and make a legitimate effort to alter the shot. Recorded on both 2-point and 3-point attempts. Does not require the shot to be missed.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Contested 2-Point Shot",
			definition: "A contested shot where the offensive player attempts a 2-point field goal. The defender actively challenges the attempt from inside the three-point arc. Recorded separately from contested 3-point shots to analyze interior vs. perimeter defense.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Contested 3-Point Shot",
			definition: "A contested shot where the offensive player attempts a 3-point field goal. The defender actively challenges the attempt from behind the three-point arc. Recorded separately from contested 2-point shots to analyze perimeter closeout effectiveness.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Deflection",
			definition: "A defensive action where a player gets a hand on a pass or dribble without securing a steal. The ball is disrupted but remains in play or goes out of bounds off the offense. Recorded when the defender touches the ball on a non-shot attempt and alters the offensive flow without creating a turnover.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Charge Drawn",
			definition: "A defensive action where a defender legally establishes position outside the restricted area before an offensive player initiates contact, resulting in an offensive foul and turnover. The defender must have both feet set and absorb the contact. Credited to the defender who draws the charge.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Loose Ball Recovered",
			definition: "A defensive action where a player gains sole possession of a live ball that is not controlled by either team. Includes recovering tipped passes, fumbled exchanges, or 50/50 balls created by defensive pressure. Credited to the player who secures possession for their team.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Boxout",
			definition: "A defensive action where a player makes physical contact with an opponent who is actively pursuing a rebound, using body position to prevent the opponent from securing the rebound. The player must show visible effort to seal the opponent away from the basket. Credited regardless of whether the player secures the rebound themselves.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Personal Foul",
			definition: "An illegal physical contact committed by a defensive player against an offensive player. Includes holding, pushing, illegal use of hands, reaching in, and illegal contact away from the ball. Results in free throws if the foul occurs during a shooting motion or team bonus, or a side-out if not in bonus.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Shooting Foul",
			definition: "A personal foul committed by a defender against an offensive player who is in the act of shooting. The shooter is awarded free throw attempts — one if the shot was a 2-point attempt and missed, two if the shot was a 2-point attempt and missed, or three if the shot was a 3-point attempt and missed. If the shot is made, it is an And-One.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Take Foul",
			definition: "An intentional personal foul committed by a defensive player to stop the clock or prevent a fast break, where the offensive player is not in the act of shooting. In the NBA, this results in one free throw and retained possession for the offense. Recorded as a personal foul against the defender.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"rebounding": [
		{
			name: "Offensive Rebound",
			definition: "A rebound secured by an offensive player after their own team's missed field goal or free throw attempt. The rebound extends the offensive possession and creates a second chance opportunity. Credited to the player who gains control of the ball.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Defensive Rebound",
			definition: "A rebound secured by a defensive player after an opponent's missed field goal or free throw attempt. The rebound ends the opponent's possession and initiates the transition to offense. Credited to the player who gains control of the ball.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Contested Rebound",
			definition: "A rebound secured while an opponent is within an arm's length and actively competing for the same ball. The rebounder must secure possession despite physical opposition and contact. Recorded separately for offensive and defensive rebounds.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Uncontested Rebound",
			definition: "A rebound secured with no opponent within an arm's length or actively competing for the ball. The rebounder secures possession without physical opposition. Recorded separately for offensive and defensive rebounds.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Team Rebound",
			definition: "A rebound credited to the team rather than an individual player. Occurs when the ball goes out of bounds after a missed shot and no individual player clearly secures possession, or when a missed free throw is legally touched by the offense but not controlled. Does not count toward individual player statistics.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"fouls": [
		{
			name: "Personal Foul",
			definition: "An illegal physical contact committed by a player against an opponent. In the defensive context, includes holding, pushing, illegal use of hands, reaching in, and illegal contact. In the offensive context, includes charging, illegal screens, and pushing off. A player is disqualified after 6 personal fouls in an NBA game.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Shooting Foul",
			definition: "A personal foul committed against an offensive player in the act of shooting. Results in free throw attempts for the shooter. The number of attempts depends on the shot type (2 or 3 points) and whether the shot was made. If the shot is made, the basket counts and one free throw is awarded (And-One).",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Offensive Foul",
			definition: "A personal foul committed by an offensive player against a defender. Includes charging (initiating contact with a set defender), illegal screens (moving while screening or extending limbs), and pushing off to create space. Results in a turnover and change of possession. Credited to the offensive player.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Loose Ball Foul",
			definition: "A personal foul committed while neither team has established possession of the ball. Typically occurs during rebounding scrambles or loose ball situations. If committed by the offense, it results in a turnover. If committed by the defense, it results in a side-out or free throws if in bonus.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Technical Foul",
			definition: "A foul called for unsportsmanlike conduct, illegal defense (defensive three seconds), or delay of game. Does not involve physical contact with an opponent. Results in one free throw for the opposing team and retained possession. Credited to the player, coach, or team as specified by the referee.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Flagrant Foul",
			definition: "An unnecessary or excessive contact foul committed against an opponent. A Flagrant Foul 1 results in two free throws and retained possession. A Flagrant Foul 2 results in two free throws, retained possession, and ejection of the offender. Reviewed by instant replay.",
			subEvents: [
				{ title: "Flagrant Foul 1", description: "Unnecessary contact. Results in two free throws and retained possession." },
				{ title: "Flagrant Foul 2", description: "Unnecessary and excessive contact. Results in two free throws, retained possession, and ejection." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Foul Drawn",
			definition: "An offensive action where a player legally initiates contact or forces a defensive player to commit a personal foul. Recorded when an offensive player is fouled and free throws or possession are awarded. Includes shooting fouls drawn, non-shooting fouls drawn, and offensive fouls drawn (charges). Credited to the offensive player who was fouled.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
	"team-effort": [
		{
			name: "Timeout",
			definition: "A stoppage of play requested by a team. Full timeouts last 60 seconds; 20-second timeouts last 20 seconds. Each team is allocated a specific number per game. Recorded when the referee grants the timeout request and stops play.",
			subEvents: [
				{ title: "Full Timeout", description: "A timeout lasting 60 seconds." },
				{ title: "20-Second Timeout", description: "A timeout lasting 20 seconds." },
			],
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Substitution",
			definition: "A player change where a player on the bench replaces a player on the court. Recorded when the substitute legally enters the game during a dead ball or after reporting to the scorer's table. The outgoing player is credited with statistics up to the moment of substitution.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Jump Ball",
			definition: "A method of starting play or resolving possession disputes where the referee tosses the ball between two opposing players. Occurs at the start of each quarter and overtime, and during held-ball situations. The team that gains possession from the tip is credited with the possession.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
		{
			name: "Held Ball",
			definition: "A stoppage where two opposing players have simultaneous possession of the ball, resulting in a jump ball or alternating possession. Recorded when the referee stops play due to neither player being able to gain sole control. Possession is determined by the alternating possession arrow or jump ball.",
			video: {
				videoId: "",
				start: 0,
				end: 0,
			}
		},
	],
};
