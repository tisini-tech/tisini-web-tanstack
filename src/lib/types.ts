export interface PaginatedResponse<T> {
  results: T[]
  count: number
  page_size: number
  page: number
  total_pages: number
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  access_type: string
  status: string
  category: ArticleCategory
  keywords: string[]
  author: ArticleAuthor | null
  created_at: string
  published_at: string
  updated_at?: string
  content?: string
}

export interface ArticleCategory {
  id: number
  name: string
  slug: string
  description: string
}

export interface ArticleAuthor {
  id: number
  username: string
}

export interface ArticleOverview {
  featured: Article
  latest: Article[]
  categories: Record<string, Article[]>
}

export type FixtureDate = string

export interface FixVenue {
  id: number
  name: string
  county: string
  latitude: string
  longitude: string
}

export interface FixReferee {
  id: number
  name: string
  role: string
}

export interface FixBroadcaster {
  id: number
  name: string
  logo: string
  redirect: string
}

export interface Fixture {
  id: number
  team1_id: number
  team2_id: number
  team1_name: string
  team2_name: string
  team1_short_name: string
  team2_short_name: string
  home_score: string
  away_score: string
  home_ht_score: string
  away_ht_score: string
  home_penalties: string
  away_penalties: string
  fixture_type: string
  matchday: string
  league: string
  league_name: string
  series: string
  series_name: string
  division: string
  division_name: string
  stage: string
  stage_name: string
  category: string
  category_name: string
  game_status: string
  game_moment: string
  game_date: string
  minute: number
  second: number
  matchtime: string
  location_id: number
  team1_logo: string
  team2_logo: string
  highlight_url: string
  is_featured: boolean
  venue: FixVenue
  referees: FixReferee[]
  broadcasters: FixBroadcaster[]
}

export interface FixtureSubEvent {
  sub_event_id: string
  sub_event_name: string
  total: number
}

export interface FixtureEvent {
  event_id: number
  event_name: string
  total: number
  sub_events: FixtureSubEvent[]
}

export interface FixtureStats {
  home: FixtureEvent[]
  away: FixtureEvent[]
}

export interface FixtureHighlight {
  id: number
  event_name: string
  event_id: number
  time: string
  team: number
  gameid: number
  narration: string
  player_id: number
  subevent_id: string
  subevent_name?: string
  subplayer_id: string
  subplayer_name: string
  game_minute: string
  game_second: string
  game_moment: string
  teamplayer_id: string
  player_type: string
  pname: string
  jersey_no: string
  subsubevent_id: string
  quarter: string
}

export interface FixtureDetails {
  fixture: {
    id: number
    team1_id: number
    team2_id: number
    team1_name: string
    team2_name: string
    team1_short_name: string
    team2_short_name: string
    home_score: string
    away_score: string
    fixture_type: string
    matchday: string
    league: string
    series: string
    game_status: string
    game_moment: string
    game_date: string
    minute: number
    second: number
    matchtime: string
    location_id: number
    team1_logo: string
    team2_logo: string
    highlight_url: string
    venue: FixVenue
    referees: FixReferee[]
    broadcasters: FixBroadcaster[]
  }
  stats: FixtureStats
  highlights: FixtureHighlight[]
}

export interface FixtureLineup {
  id: number
  fixture_id: number
  date_created: string
  team_player_id: number
  jersey_no: number
  player_type: string
  player: number
  teamid: string
  pname: string
  last_updated: string
  lineupposition: number
  red: number
  gk: number
  passportphoto: string
  minutes_played: number
  rating: number
}

export interface FixtureLineupPosition {
  line: string
  role: string
  slot: number
  label: string
  number: number | null
}

export interface FormationRow {
  line: string
  role: string
  slot: number
  label: string
  number: number | null
}

export interface Formation {
  id: number
  name: string
  description: string
  match_type: number
  columns_per_row: number[]
  /** Pitch bands (goal → attack); each band is ordered left→right slots. */
  rows: FormationRow[][]
}

export interface TeamCoach {
  id: number
  name: string
  date_of_birth: string | null
  photo_url: string | null
  nationality: string | null
}

export interface FixtureLineups {
  home: FixtureLineup[]
  away: FixtureLineup[]
  home_formation: Formation | null
  away_formation: Formation | null
  home_coach: TeamCoach | null
  away_coach: TeamCoach | null
}

export type SubEvent = {
  sub_event_id: string
  sub_event_name: string
  total: number
}

export type TopPlayer = {
  player_id: number
  name: string
  passportphoto: string
  team_player_id: string
  nationality: string
  team_id: number
  team_name: string
  team_short_name: string
  team_logo: string
  total: number
  sub_events: SubEvent[]
}

export type TopEventPlayer = {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
  next: string
  previous: string
  items: TopPlayer[]
}

export type Live = {
  opponent: string
  score: string
  status: string
}

export type Standing = {
  D: number
  GA: number
  GD: number
  GF: number
  L: number
  P: number
  Pts: number
  W: number
  live: Live | null
  id: number
  team_name: string
  short_name: string
  logo: string
}

export type Stage = {
  id: number
  name: string
  standings: Standing[]
}

export type Standings = {
  competition: number
  season: number
  division: number
  type: string
  matches_played: number
  standings: Standing[]
  stages: Stage[]
  division_standings: [
    {
      position: number
      team_id: number
      team_name: string
      team_short_name: string
      team_logo: string
      points: number
    },
  ]
  overall_standings: [
    {
      position: number
      team_id: number
      team_name: string
      team_short_name: string
      team_logo: string
      total_points: number
      division_points: [
        {
          division_id: number
          division_name: string
          points: number
        },
      ]
    },
  ]
}

export interface QuestionChoice {
  id: number
  question: number
  text: string
  team: number
}

export interface Question {
  choices: QuestionChoice[]
  id: number
  question_set: number
  answer_type: string
  text: string
  order: number
  image_url: string | null
  points: number
  timer_seconds: number
  is_required: boolean
  team: number
  metric: number
  metric_detail: number
}

export interface EngParticipation {
  has_played: boolean
}

export interface Engagement {
  id: number
  title: string
  description: string
  image_url: string | null
  type: string
  play_mode: string
  status: string
  starts_at: string
  ends_at: string
  is_public: boolean
  is_payable: boolean
  amount_payable: string
  prize_description: string | null
  company: number
  match: number | null
  questions?: Question[]
}

export interface EngSubmitResponse {
  message: string
  error: string
}

export interface EngUser {
  id: number
  username: string
}

export interface EngLeaderboard {
  user: EngUser
  id: number
  question_set: number
  score: number
  time_used: number
  has_paid: boolean
  live_session: number
  joined_at_question: number
  completed_at: string | null
}

export interface Country {
  id: number
  name: string
  iso_code2: string
}

export interface VoteCause {
  company: number | null
  date_from: string
  date_to: string
  formation: Formation | null
  id: number
  image_url: string | null
  picks_required: number | null
  reason: string
  tournament: number | null
  vote_mode: string
}

export interface PlayerOfTheWeek {
  participant_id: number
  name: string
  image_url: string | null
  slot: number
  picks: number
  team_name: string
  team_logo: string
  player: VotePlayer | null
}

export interface Slot {
  slot: number
  role: string
  label: string
  line: string
  players: PlayerOfTheWeek[]
}

export interface VoteParticipant {
  id: number
  reason: string
  image_url: string | null
  tournament: number | null
  date_from: string
  date_to: string
  total_votes: number
  participants: Participant[]
  company: number | null
  formation: Formation | null
  has_voted: boolean
  picks_required: number | null
  vote_mode: string
  team_of_the_week: PlayerOfTheWeek[]
  slots: Slot[]
  ballots_casted: number | null
}

export interface VotePlayer {
  current_position: string
  id: number
  name: string
  passportphoto: string | null
}

export interface Participant {
  id: number
  voting_cause: number
  name: string
  image_url: string | null
  description: string | null
  total_votes: number
  /** Total votes cast across the poll at the time of this response. */
  votes_casted?: number
  team_name: string | null
  team_logo: string | null
  player: VotePlayer | null
  /** Formation slot when assigned (slate polls). */
  slot: number | null
}

export interface BallotPick {
  participant_id: number
  name: string
  slot: number | null
  team_name: string | null
  team_logo: string | null
}

export interface BallotResult {
  id: number
  voting_cause: number
  picks: BallotPick[]
}
