import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

const STATUS_COLORS = {
  upcoming: '#4D96FF',
  live: '#FF6B6B',
  completed: '#6BCB77',
};

const STATUS_LABELS = {
  upcoming: '🕐 Upcoming',
  live: '🔴 Live',
  completed: '✅ Completed',
};

export default function MatchesScreen({ navigation, route }) {
  const { matches, teams, updateMatch, user } = useApp();
  const isAdmin = user?.role === 'admin';
  const [filter, setFilter] = useState('all');

  const getTeam = (id) => teams.find((t) => t.id === id) || { name: 'TBD', color: '#666' };

  const filtered = filter === 'all' ? matches : matches.filter((m) => m.status === filter);

  const startMatch = (match) => {
    Alert.alert('Start Match', `Start ${getTeam(match.team1Id).name} vs ${getTeam(match.team2Id).name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start', onPress: () => {
          updateMatch(match.id, { status: 'live' });
        }
      },
    ]);
  };

  const MatchCard = ({ match }) => {
    const team1 = getTeam(match.team1Id);
    const team2 = getTeam(match.team2Id);
    const statusColor = STATUS_COLORS[match.status];

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => isAdmin && match.status !== 'upcoming'
          ? navigation.navigate('ScoreTracker', { matchId: match.id })
          : null}
      >
        <View style={styles.matchHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_LABELS[match.status]}</Text>
          </View>
          <Text style={styles.matchDate}>📅 {match.date}</Text>
        </View>

        <View style={styles.teamsRow}>
          {/* Team 1 */}
          <View style={styles.teamSide}>
            <View style={[styles.teamBadge, { backgroundColor: team1.color }]}>
              <Text style={styles.teamBadgeText}>{team1.shortName || team1.name.slice(0, 3).toUpperCase()}</Text>
            </View>
            <Text style={styles.teamName}>{team1.name}</Text>
            {match.status !== 'upcoming' && (
              <Text style={styles.scoreText}>
                {match.team1Score.runs}/{match.team1Score.wickets}
              </Text>
            )}
            {match.status !== 'upcoming' && (
              <Text style={styles.oversText}>({match.team1Score.overs} ov)</Text>
            )}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
            {match.status === 'completed' && match.winnerId && (
              <Text style={styles.winnerBadge}>🏆</Text>
            )}
          </View>

          {/* Team 2 */}
          <View style={styles.teamSide}>
            <View style={[styles.teamBadge, { backgroundColor: team2.color }]}>
              <Text style={styles.teamBadgeText}>{team2.shortName || team2.name.slice(0, 3).toUpperCase()}</Text>
            </View>
            <Text style={styles.teamName}>{team2.name}</Text>
            {match.status !== 'upcoming' && (
              <Text style={styles.scoreText}>
                {match.team2Score.runs}/{match.team2Score.wickets}
              </Text>
            )}
            {match.status !== 'upcoming' && (
              <Text style={styles.oversText}>({match.team2Score.overs} ov)</Text>
            )}
          </View>
        </View>

        {match.result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{match.result}</Text>
          </View>
        )}

        <View style={styles.venueRow}>
          <Text style={styles.venueText}>📍 {match.venue}</Text>
        </View>

        {isAdmin && (
          <View style={styles.adminActions}>
            {match.status === 'upcoming' && (
              <TouchableOpacity style={styles.startBtn} onPress={() => startMatch(match)}>
                <Text style={styles.startBtnText}>▶ Start Match</Text>
              </TouchableOpacity>
            )}
            {match.status === 'live' && (
              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() => navigation.navigate('ScoreTracker', { matchId: match.id })}
              >
                <Text style={styles.trackBtnText}>📊 Track Score</Text>
              </TouchableOpacity>
            )}
            {match.status === 'completed' && (
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => navigation.navigate('ScoreTracker', { matchId: match.id })}
              >
                <Text style={styles.viewBtnText}>👁 View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Matches</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'live', 'upcoming', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏏</Text>
            <Text style={styles.emptyText}>No {filter} matches</Text>
          </View>
        ) : (
          filtered.map((match) => <MatchCard key={match.id} match={match} />)
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#112240',
    alignItems: 'center',
  },
  filterTabActive: { backgroundColor: '#2E7D32' },
  filterText: { color: '#8899AA', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  matchCard: {
    backgroundColor: '#112240',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  matchDate: { color: '#8899AA', fontSize: 12 },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamSide: { flex: 1, alignItems: 'center' },
  teamBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  teamName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  scoreText: { color: '#F4A261', fontSize: 22, fontWeight: '900', marginTop: 4 },
  oversText: { color: '#8899AA', fontSize: 11 },
  vsContainer: { alignItems: 'center', paddingHorizontal: 10 },
  vsText: { color: '#445566', fontSize: 14, fontWeight: '900' },
  winnerBadge: { fontSize: 20, marginTop: 4 },
  resultBox: {
    backgroundColor: '#1A3A2A',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  resultText: { color: '#6BCB77', fontSize: 13, fontWeight: '700' },
  venueRow: { marginBottom: 8 },
  venueText: { color: '#8899AA', fontSize: 12 },
  adminActions: { marginTop: 4 },
  startBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  trackBtn: {
    backgroundColor: '#FF6B6B22',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackBtnText: { color: '#FF6B6B', fontWeight: '700', fontSize: 14 },
  viewBtn: {
    backgroundColor: '#4D96FF22',
    borderWidth: 1,
    borderColor: '#4D96FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewBtnText: { color: '#4D96FF', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#8899AA', fontSize: 16 },
});
