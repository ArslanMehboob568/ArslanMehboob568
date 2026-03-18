import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_STANDINGS,
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [standings, setStandings] = useState(INITIAL_STANDINGS);

  // Load persisted data on startup
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedMatches = await AsyncStorage.getItem('matches');
      const savedStandings = await AsyncStorage.getItem('standings');
      const savedPlayers = await AsyncStorage.getItem('players');
      const savedTeams = await AsyncStorage.getItem('teams');
      if (savedMatches) setMatches(JSON.parse(savedMatches));
      if (savedStandings) setStandings(JSON.parse(savedStandings));
      if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
      if (savedTeams) setTeams(JSON.parse(savedTeams));
    } catch (e) {
      console.log('Load error', e);
    }
  };

  const saveMatches = async (data) => {
    setMatches(data);
    await AsyncStorage.setItem('matches', JSON.stringify(data));
  };

  const saveStandings = async (data) => {
    setStandings(data);
    await AsyncStorage.setItem('standings', JSON.stringify(data));
  };

  const savePlayers = async (data) => {
    setPlayers(data);
    await AsyncStorage.setItem('players', JSON.stringify(data));
  };

  const saveTeams = async (data) => {
    setTeams(data);
    await AsyncStorage.setItem('teams', JSON.stringify(data));
  };

  // Update a match score and recalculate standings
  const updateMatch = async (matchId, updates) => {
    const updatedMatches = matches.map((m) =>
      m.id === matchId ? { ...m, ...updates } : m
    );
    await saveMatches(updatedMatches);

    // Recalculate standings if match is completed
    if (updates.status === 'completed') {
      recalculateStandings(updatedMatches);
    }
  };

  const recalculateStandings = async (allMatches) => {
    const newStandings = teams.map((team) => ({
      teamId: team.id,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      nrr: 0.0,
      runsFor: 0,
      oversFor: 0,
      runsAgainst: 0,
      oversAgainst: 0,
    }));

    allMatches
      .filter((m) => m.status === 'completed')
      .forEach((match) => {
        const t1 = newStandings.find((s) => s.teamId === match.team1Id);
        const t2 = newStandings.find((s) => s.teamId === match.team2Id);
        if (!t1 || !t2) return;

        t1.played += 1;
        t2.played += 1;

        // NRR data
        const overs1 = parseFloat(match.team1Score.overs) || 20;
        const overs2 = parseFloat(match.team2Score.overs) || 20;
        t1.runsFor += match.team1Score.runs;
        t1.oversFor += overs1;
        t1.runsAgainst += match.team2Score.runs;
        t1.oversAgainst += overs2;
        t2.runsFor += match.team2Score.runs;
        t2.oversFor += overs2;
        t2.runsAgainst += match.team1Score.runs;
        t2.oversAgainst += overs1;

        if (match.winnerId === match.team1Id) {
          t1.won += 1;
          t1.points += 2;
          t2.lost += 1;
        } else if (match.winnerId === match.team2Id) {
          t2.won += 1;
          t2.points += 2;
          t1.lost += 1;
        } else {
          t1.tied += 1;
          t1.points += 1;
          t2.tied += 1;
          t2.points += 1;
        }
      });

    // Calculate NRR
    newStandings.forEach((s) => {
      const rr1 = s.oversFor > 0 ? s.runsFor / s.oversFor : 0;
      const rr2 = s.oversAgainst > 0 ? s.runsAgainst / s.oversAgainst : 0;
      s.nrr = parseFloat((rr1 - rr2).toFixed(3));
    });

    // Sort by points then NRR
    newStandings.sort((a, b) => b.points - a.points || b.nrr - a.nrr);
    await saveStandings(newStandings);
  };

  const updatePlayerStats = async (playerId, statsUpdate) => {
    const updatedPlayers = players.map((p) =>
      p.id === playerId ? { ...p, ...statsUpdate } : p
    );
    await savePlayers(updatedPlayers);
  };

  const addTeam = async (team) => {
    const newTeams = [...teams, team];
    await saveTeams(newTeams);
    const newStanding = { teamId: team.id, played: 0, won: 0, lost: 0, tied: 0, points: 0, nrr: 0.0 };
    await saveStandings([...standings, newStanding]);
  };

  const addPlayer = async (player) => {
    await savePlayers([...players, player]);
  };

  const addMatch = async (match) => {
    await saveMatches([...matches, match]);
  };

  const resetData = async () => {
    await saveMatches(INITIAL_MATCHES);
    await saveStandings(INITIAL_STANDINGS);
    await savePlayers(INITIAL_PLAYERS);
    await saveTeams(INITIAL_TEAMS);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        teams,
        players,
        matches,
        standings,
        updateMatch,
        updatePlayerStats,
        addTeam,
        addPlayer,
        addMatch,
        resetData,
        saveTeams,
        savePlayers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
