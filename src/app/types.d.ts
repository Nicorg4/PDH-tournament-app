export interface Player {
    id: number;
    name: string;
    team?: Team;
    price: number;
    position: string;
}

export interface Match {
  match_id: number;
  team_A_id: number;
  team_B_id: number;
  team_A_name: string;
  team_A_logo: string;
  team_B_name: string;
  team_B_logo: string;
  team_A_score: number | null;
  team_B_score: number | null;
  winner_team_id: number | null;
  team_A_penalty_score: number | null;
  team_B_penalty_score: number | null;
  phase: number;
  user_A_id: number;
  user_A_name: string;
  user_A_picture: string;
  user_B_id: number;
  user_B_name: string;
  user_B_picture: string;
  isDraw: boolean;
  match_day: number;
  group_id: number;
}

export interface User {
    id: number;
    username: string;
    picture: string;
}

export interface Team {
    id: number;
    name: string;
    logo: string;
    user: User;
}

interface TeamStats {
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goal_diff: number;
}

interface GroupTeam {
    team: Team;
    stats: TeamStats;
}

export interface Group {
    group_id: number;
    teams: GroupTeam[];
}

export interface GroupsResponse {
    groups: Group[];
}

export interface Pair {
    user: User;
    team: Team;
}

export interface ManagerData {
    id: number,
    username: string,
    picture: string,
    team_name: string,
    team_logo: string,
}

export interface FormattedPlayer {
  id: number,
  name: string;
  number: number;
  position: string;
  team_id: number;
  on_sale: boolean;
}

export interface Transfer {
    id: string;
    player: Player;
    from: Team;
    to: Team;
    price: number;
}

export interface Auction {
  id: number;
  player: Player;
  team: Team;
}