// Initial tournament data
export const CREDENTIALS = {
  admin: { username: 'admin', password: 'punjab144', role: 'admin' },
  player: { username: 'player', password: 'player', role: 'player' },
};

export const INITIAL_TEAMS = [
  { id: '1', name: 'Team Alpha', shortName: 'ALP', color: '#E63946' },
  { id: '2', name: 'Team Bravo', shortName: 'BRV', color: '#2A9D8F' },
  { id: '3', name: 'Team Charlie', shortName: 'CHR', color: '#E9C46A' },
  { id: '4', name: 'Team Delta', shortName: 'DLT', color: '#457B9D' },
];

export const INITIAL_PLAYERS = [
  // Team Alpha
  { id: 'p1', name: 'Ali Raza', teamId: '1', role: 'Batsman', runs: 0, wickets: 0, matches: 0 },
  { id: 'p2', name: 'Usman Khan', teamId: '1', role: 'Bowler', runs: 0, wickets: 0, matches: 0 },
  { id: 'p3', name: 'Bilal Ahmed', teamId: '1', role: 'All-Rounder', runs: 0, wickets: 0, matches: 0 },
  // Team Bravo
  { id: 'p4', name: 'Hamza Sheikh', teamId: '2', role: 'Batsman', runs: 0, wickets: 0, matches: 0 },
  { id: 'p5', name: 'Tariq Mehmood', teamId: '2', role: 'Bowler', runs: 0, wickets: 0, matches: 0 },
  { id: 'p6', name: 'Zain Abbas', teamId: '2', role: 'All-Rounder', runs: 0, wickets: 0, matches: 0 },
  // Team Charlie
  { id: 'p7', name: 'Faizan Butt', teamId: '3', role: 'Batsman', runs: 0, wickets: 0, matches: 0 },
  { id: 'p8', name: 'Raza Mir', teamId: '3', role: 'Bowler', runs: 0, wickets: 0, matches: 0 },
  { id: 'p9', name: 'Shahid Afridi Jr', teamId: '3', role: 'All-Rounder', runs: 0, wickets: 0, matches: 0 },
  // Team Delta
  { id: 'p10', name: 'Naeem Ullah', teamId: '4', role: 'Batsman', runs: 0, wickets: 0, matches: 0 },
  { id: 'p11', name: 'Danish Kaneria Jr', teamId: '4', role: 'Bowler', runs: 0, wickets: 0, matches: 0 },
  { id: 'p12', name: 'Asad Butt', teamId: '4', role: 'All-Rounder', runs: 0, wickets: 0, matches: 0 },
];

export const INITIAL_MATCHES = [
  {
    id: 'm1',
    team1Id: '1',
    team2Id: '2',
    status: 'upcoming',
    date: '2024-03-15',
    venue: 'Main Ground',
    team1Score: { runs: 0, wickets: 0, overs: 0 },
    team2Score: { runs: 0, wickets: 0, overs: 0 },
    result: null,
    winnerId: null,
  },
  {
    id: 'm2',
    team1Id: '3',
    team2Id: '4',
    status: 'upcoming',
    date: '2024-03-16',
    venue: 'Main Ground',
    team1Score: { runs: 0, wickets: 0, overs: 0 },
    team2Score: { runs: 0, wickets: 0, overs: 0 },
    result: null,
    winnerId: null,
  },
  {
    id: 'm3',
    team1Id: '1',
    team2Id: '3',
    status: 'upcoming',
    date: '2024-03-17',
    venue: 'Main Ground',
    team1Score: { runs: 0, wickets: 0, overs: 0 },
    team2Score: { runs: 0, wickets: 0, overs: 0 },
    result: null,
    winnerId: null,
  },
  {
    id: 'm4',
    team1Id: '2',
    team2Id: '4',
    status: 'upcoming',
    date: '2024-03-18',
    venue: 'Main Ground',
    team1Score: { runs: 0, wickets: 0, overs: 0 },
    team2Score: { runs: 0, wickets: 0, overs: 0 },
    result: null,
    winnerId: null,
  },
];

export const INITIAL_STANDINGS = [
  { teamId: '1', played: 0, won: 0, lost: 0, points: 0, nrr: 0.0 },
  { teamId: '2', played: 0, won: 0, lost: 0, points: 0, nrr: 0.0 },
  { teamId: '3', played: 0, won: 0, lost: 0, points: 0, nrr: 0.0 },
  { teamId: '4', played: 0, won: 0, lost: 0, points: 0, nrr: 0.0 },
];
