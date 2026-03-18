import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function ScoreTrackerScreen({ navigation, route }) {
  const { matchId } = route.params;
  const { matches, teams, players, updateMatch, updatePlayerStats, user } = useApp();

  const match = matches.find((m) => m.id === matchId);
  const isAdmin = user?.role === 'admin';

  const [editModal, setEditModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null); // '1' or '2'
  const [runs, setRuns] = useState('');
  const [wickets, setWickets] = useState('');
  const [overs, setOvers] = useState('');

  const [resultModal, setResultModal] = useState(false);
  const [resultText, setResultText] = useState('');
  const [winnerId, setWinnerId] = useState(null);

  const [playerModal, setPlayerModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pRuns, setPRuns] = useState('');
  const [pWickets, setPWickets] = useState('');

  if (!match) return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.errorText}>Match not found.</Text>
    </SafeAreaView>
  );

  const team1 = teams.find((t) => t.id === match.team1Id) || {};
  const team2 = teams.find((t) => t.id === match.team2Id) || {};

  const team1Players = players.filter((p) => p.teamId === match.team1Id);
  const team2Players = players.filter((p) => p.teamId === match.team2Id);

  const openEdit = (teamNum) => {
    setEditTeam(teamNum);
    const score = teamNum === '1' ? match.team1Score : match.team2Score;
    setRuns(String(score.runs));
    setWickets(String(score.wickets));
    setOvers(String(score.overs));
    setEditModal(true);
  };

  const saveScore = async () => {
    if (runs === '' || wickets === '' || overs === '') {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const scoreKey = editTeam === '1' ? 'team1Score' : 'team2Score';
    await updateMatch(matchId, {
      [scoreKey]: {
        runs: parseInt(runs) || 0,
        wickets: parseInt(wickets) || 0,
        overs: parseFloat(overs) || 0,
      },
    });
    setEditModal(false);
  };

  const finishMatch = async () => {
    if (!winnerId && !resultText) {
      Alert.alert('Error', 'Please select a winner or enter result');
      return;
    }
    await updateMatch(matchId, {
      status: 'completed',
      result: resultText || (winnerId ? `${teams.find(t => t.id === winnerId)?.name} won` : 'Match Tied'),
      winnerId: winnerId,
    });
    setResultModal(false);
    Alert.alert('Match Completed', 'Standings have been updated!');
  };

  const savePlayerStats = async () => {
    if (!selectedPlayer) return;
    await updatePlayerStats(selectedPlayer.id, {
      runs: (selectedPlayer.runs || 0) + (parseInt(pRuns) || 0),
      wickets: (selectedPlayer.wickets || 0) + (parseInt(pWickets) || 0),
      matches: (selectedPlayer.matches || 0) + 1,
    });
    setPlayerModal(false);
    setPRuns('');
    setPWickets('');
    Alert.alert('Stats Updated', `${selectedPlayer.name}'s stats have been updated.`);
  };

  const ScoreCard = ({ team, score, teamNum }) => (
    <View style={[styles.scoreCard, { borderColor: team.color || '#444' }]}>
      <View style={[styles.scoreCardHeader, { backgroundColor: team.color || '#444' }]}>
        <Text style={styles.scoreCardTeam}>{team.name || 'TBD'}</Text>
        <Text style={styles.scoreCardShort}>{team.shortName || '---'}</Text>
      </View>
      <View style={styles.scoreCardBody}>
        <Text style={styles.bigScore}>
          {score.runs}/{score.wickets}
        </Text>
        <Text style={styles.oversLabel}>({score.overs} overs)</Text>
        {isAdmin && match.status !== 'completed' && (
          <TouchableOpacity style={styles.editScoreBtn} onPress={() => openEdit(teamNum)}>
            <Text style={styles.editScoreBtnText}>✏️ Edit Score</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Score Tracker</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Match Status */}
        <View style={styles.matchStatusRow}>
          <View style={[
            styles.liveTag,
            match.status === 'live' ? styles.liveTagActive : {},
            match.status === 'completed' ? styles.completedTag : {},
          ]}>
            <Text style={[
              styles.liveTagText,
              match.status === 'live' ? styles.liveTagTextActive : {},
              match.status === 'completed' ? styles.completedTagText : {},
            ]}>
              {match.status === 'live' ? '🔴 LIVE' : match.status === 'completed' ? '✅ COMPLETED' : '🕐 UPCOMING'}
            </Text>
          </View>
          <Text style={styles.venueText}>📍 {match.venue} · {match.date}</Text>
        </View>

        {/* Score Cards */}
        <View style={styles.scoreRow}>
          <ScoreCard team={team1} score={match.team1Score} teamNum="1" />
          <View style={styles.vsBox}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <ScoreCard team={team2} score={match.team2Score} teamNum="2" />
        </View>

        {/* Result Banner */}
        {match.result && (
          <View style={styles.resultBanner}>
            <Text style={styles.resultIcon}>🏆</Text>
            <Text style={styles.resultText}>{match.result}</Text>
          </View>
        )}

        {/* Admin Controls */}
        {isAdmin && match.status === 'live' && (
          <View style={styles.adminSection}>
            <Text style={styles.adminSectionTitle}>ADMIN CONTROLS</Text>
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={() => setResultModal(true)}
            >
              <Text style={styles.finishBtnText}>🏁 Finish Match & Update Standings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playerStatsBtn}
              onPress={() => setPlayerModal(true)}
            >
              <Text style={styles.playerStatsBtnText}>👤 Update Player Stats</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Players Section */}
        <Text style={styles.sectionTitle}>PLAYING XI</Text>

        <View style={styles.playersSection}>
          <Text style={[styles.teamPlayerHeader, { color: team1.color }]}>{team1.name}</Text>
          {team1Players.map((p) => (
            <View key={p.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{p.name}</Text>
              <Text style={styles.playerRole}>{p.role}</Text>
              <Text style={styles.playerStats}>{p.runs}R  {p.wickets}W  {p.matches}M</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={[styles.teamPlayerHeader, { color: team2.color }]}>{team2.name}</Text>
          {team2Players.map((p) => (
            <View key={p.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{p.name}</Text>
              <Text style={styles.playerRole}>{p.role}</Text>
              <Text style={styles.playerStats}>{p.runs}R  {p.wickets}W  {p.matches}M</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Score Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update Score — {editTeam === '1' ? team1.name : team2.name}</Text>
            <Text style={styles.modalLabel}>Runs</Text>
            <TextInput
              style={styles.modalInput}
              value={runs}
              onChangeText={setRuns}
              keyboardType="numeric"
              placeholder="e.g. 145"
              placeholderTextColor="#445566"
            />
            <Text style={styles.modalLabel}>Wickets</Text>
            <TextInput
              style={styles.modalInput}
              value={wickets}
              onChangeText={setWickets}
              keyboardType="numeric"
              placeholder="e.g. 6"
              placeholderTextColor="#445566"
            />
            <Text style={styles.modalLabel}>Overs</Text>
            <TextInput
              style={styles.modalInput}
              value={overs}
              onChangeText={setOvers}
              keyboardType="decimal-pad"
              placeholder="e.g. 20.0"
              placeholderTextColor="#445566"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveScore}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Finish Match Modal */}
      <Modal visible={resultModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Finish Match</Text>
            <Text style={styles.modalLabel}>Select Winner</Text>
            <TouchableOpacity
              style={[styles.winnerOption, winnerId === team1.id && styles.winnerSelected]}
              onPress={() => { setWinnerId(team1.id); setResultText(`${team1.name} won!`); }}
            >
              <Text style={styles.winnerOptionText}>{team1.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.winnerOption, winnerId === team2.id && styles.winnerSelected]}
              onPress={() => { setWinnerId(team2.id); setResultText(`${team2.name} won!`); }}
            >
              <Text style={styles.winnerOptionText}>{team2.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.winnerOption, winnerId === 'tie' && styles.winnerSelected]}
              onPress={() => { setWinnerId(null); setResultText('Match Tied!'); }}
            >
              <Text style={styles.winnerOptionText}>Match Tied</Text>
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Result Description</Text>
            <TextInput
              style={styles.modalInput}
              value={resultText}
              onChangeText={setResultText}
              placeholder="e.g. Team Alpha won by 24 runs"
              placeholderTextColor="#445566"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setResultModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={finishMatch}>
                <Text style={styles.saveBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Player Stats Modal */}
      <Modal visible={playerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Update Player Stats</Text>
              {[...team1Players, ...team2Players].map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.playerSelectRow, selectedPlayer?.id === p.id && styles.playerSelectRowActive]}
                  onPress={() => { setSelectedPlayer(p); setPRuns(''); setPWickets(''); }}
                >
                  <Text style={styles.playerSelectName}>{p.name}</Text>
                  <Text style={styles.playerSelectTeam}>{teams.find(t => t.id === p.teamId)?.name}</Text>
                </TouchableOpacity>
              ))}
              {selectedPlayer && (
                <>
                  <Text style={styles.modalLabel}>Add Runs for {selectedPlayer.name}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={pRuns}
                    onChangeText={setPRuns}
                    keyboardType="numeric"
                    placeholder="Runs scored this match"
                    placeholderTextColor="#445566"
                  />
                  <Text style={styles.modalLabel}>Add Wickets</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={pWickets}
                    onChangeText={setPWickets}
                    keyboardType="numeric"
                    placeholder="Wickets taken this match"
                    placeholderTextColor="#445566"
                  />
                </>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setPlayerModal(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={savePlayerStats}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  backBtn: { width: 60 },
  backText: { color: '#4D96FF', fontSize: 18, fontWeight: '600' },
  screenTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  matchStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  liveTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#1E3A5F',
  },
  liveTagActive: { backgroundColor: '#FF000022', borderWidth: 1, borderColor: '#FF6B6B' },
  completedTag: { backgroundColor: '#1A3A2A', borderWidth: 1, borderColor: '#2E7D32' },
  liveTagText: { color: '#8899AA', fontWeight: '700', fontSize: 12 },
  liveTagTextActive: { color: '#FF6B6B' },
  completedTagText: { color: '#6BCB77' },
  venueText: { color: '#8899AA', fontSize: 11 },
  scoreRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#112240',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
  },
  scoreCardHeader: {
    padding: 10,
    alignItems: 'center',
  },
  scoreCardTeam: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  scoreCardShort: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  scoreCardBody: { padding: 12, alignItems: 'center' },
  bigScore: { color: '#FFFFFF', fontSize: 30, fontWeight: '900' },
  oversLabel: { color: '#8899AA', fontSize: 11, marginTop: 2 },
  editScoreBtn: {
    marginTop: 10,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  editScoreBtnText: { color: '#4D96FF', fontSize: 12, fontWeight: '700' },
  vsBox: { alignItems: 'center' },
  vsText: { color: '#445566', fontWeight: '900', fontSize: 14 },
  resultBanner: {
    backgroundColor: '#1A3A2A',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginBottom: 16,
  },
  resultIcon: { fontSize: 22 },
  resultText: { color: '#6BCB77', fontSize: 15, fontWeight: '700', flex: 1 },
  adminSection: { paddingHorizontal: 16, marginBottom: 20 },
  adminSectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  finishBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  finishBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  playerStatsBtn: {
    backgroundColor: '#2A9D8F22',
    borderWidth: 1,
    borderColor: '#2A9D8F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  playerStatsBtnText: { color: '#2A9D8F', fontWeight: '800', fontSize: 14 },
  sectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  playersSection: {
    backgroundColor: '#112240',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  teamPlayerHeader: { fontSize: 14, fontWeight: '800', marginBottom: 8 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  playerName: { color: '#FFFFFF', fontSize: 13, flex: 1 },
  playerRole: { color: '#8899AA', fontSize: 11, width: 80, textAlign: 'center' },
  playerStats: { color: '#F4A261', fontSize: 11, width: 90, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#1E3A5F', marginVertical: 12 },
  errorText: { color: '#FF6B6B', textAlign: 'center', marginTop: 50, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#112240',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  modalLabel: { color: '#8899AA', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 10, letterSpacing: 1 },
  modalInput: {
    backgroundColor: '#0A1628',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#8899AA', fontWeight: '700' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800' },
  winnerOption: {
    backgroundColor: '#0A1628',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  winnerSelected: { borderColor: '#2E7D32', backgroundColor: '#1A3A2A' },
  winnerOptionText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  playerSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    marginBottom: 6,
  },
  playerSelectRowActive: { borderColor: '#2A9D8F', backgroundColor: '#0A2A28' },
  playerSelectName: { color: '#FFFFFF', fontWeight: '600' },
  playerSelectTeam: { color: '#8899AA', fontSize: 12 },
});
