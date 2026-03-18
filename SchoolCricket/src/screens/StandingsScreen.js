import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function StandingsScreen({ navigation }) {
  const { standings, teams, matches } = useApp();

  const getTeam = (id) => teams.find((t) => t.id === id) || { name: 'Unknown', color: '#666' };

  const positionColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#8899AA'];
  const positionIcons = ['🥇', '🥈', '🥉', '4️⃣'];

  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Points Table</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tournament Info */}
        <View style={styles.tournamentBanner}>
          <Text style={styles.tournamentBannerIcon}>🏏</Text>
          <View>
            <Text style={styles.tournamentBannerTitle}>BBL 2024</Text>
            <Text style={styles.tournamentBannerSub}>School Cricket · Points Table</Text>
          </View>
          <View style={styles.matchesPlayed}>
            <Text style={styles.matchesPlayedNum}>{completedMatches.length}</Text>
            <Text style={styles.matchesPlayedLabel}>Played</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 0.4 }]}>#</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>TEAM</Text>
          <Text style={styles.headerCell}>P</Text>
          <Text style={styles.headerCell}>W</Text>
          <Text style={styles.headerCell}>L</Text>
          <Text style={styles.headerCell}>PTS</Text>
          <Text style={styles.headerCell}>NRR</Text>
        </View>

        {standings.map((s, index) => {
          const team = getTeam(s.teamId);
          const isTop = index === 0 && s.points > 0;
          return (
            <View
              key={s.teamId}
              style={[
                styles.tableRow,
                isTop && styles.tableRowTop,
                index % 2 === 0 ? styles.tableRowEven : {},
              ]}
            >
              <Text style={[styles.positionIcon, { flex: 0.4 }]}>
                {positionIcons[index] || String(index + 1)}
              </Text>
              <View style={[styles.teamCell, { flex: 2 }]}>
                <View style={[styles.teamDot, { backgroundColor: team.color }]} />
                <Text style={styles.teamCellName}>{team.name}</Text>
              </View>
              <Text style={styles.cell}>{s.played}</Text>
              <Text style={[styles.cell, { color: '#6BCB77', fontWeight: '700' }]}>{s.won}</Text>
              <Text style={[styles.cell, { color: '#FF6B6B' }]}>{s.lost}</Text>
              <Text style={[styles.cell, { color: '#F4A261', fontWeight: '900', fontSize: 16 }]}>
                {s.points}
              </Text>
              <Text style={[styles.cell, { color: s.nrr >= 0 ? '#6BCB77' : '#FF6B6B', fontSize: 11 }]}>
                {s.nrr > 0 ? '+' : ''}{s.nrr}
              </Text>
            </View>
          );
        })}

        {/* Qualification Info */}
        <View style={styles.qualBox}>
          <Text style={styles.qualTitle}>Qualification Guide</Text>
          <View style={styles.qualRow}>
            <View style={[styles.qualDot, { backgroundColor: '#FFD700' }]} />
            <Text style={styles.qualText}>1st & 2nd qualify for Finals</Text>
          </View>
          <View style={styles.qualRow}>
            <View style={[styles.qualDot, { backgroundColor: '#C0C0C0' }]} />
            <Text style={styles.qualText}>3rd & 4th play Eliminator</Text>
          </View>
        </View>

        {/* Recent Results */}
        {completedMatches.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>RECENT RESULTS</Text>
            {completedMatches.slice(-3).reverse().map((match) => {
              const t1 = getTeam(match.team1Id);
              const t2 = getTeam(match.team2Id);
              return (
                <View key={match.id} style={styles.resultCard}>
                  <View style={styles.resultTeams}>
                    <Text style={[styles.resultTeamName, match.winnerId === t1.id && styles.winnerText]}>
                      {t1.name}
                    </Text>
                    <View style={styles.resultScores}>
                      <Text style={styles.resultScore}>{match.team1Score.runs}/{match.team1Score.wickets}</Text>
                      <Text style={styles.resultVs}>vs</Text>
                      <Text style={styles.resultScore}>{match.team2Score.runs}/{match.team2Score.wickets}</Text>
                    </View>
                    <Text style={[styles.resultTeamName, match.winnerId === t2.id && styles.winnerText, { textAlign: 'right' }]}>
                      {t2.name}
                    </Text>
                  </View>
                  {match.result && (
                    <Text style={styles.resultDesc}>{match.result}</Text>
                  )}
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 30 }} />
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
  tournamentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112240',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  tournamentBannerIcon: { fontSize: 32 },
  tournamentBannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  tournamentBannerSub: { color: '#8899AA', fontSize: 12 },
  matchesPlayed: {
    marginLeft: 'auto',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  matchesPlayedNum: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  matchesPlayedLabel: { color: '#A5D6A7', fontSize: 10, fontWeight: '600' },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    backgroundColor: '#1E3A5F',
    marginHorizontal: 16,
    borderRadius: 10,
  },
  headerCell: {
    flex: 1,
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  tableRowEven: { backgroundColor: '#112240' + '44' },
  tableRowTop: {
    backgroundColor: '#1A3A2A',
    borderRadius: 10,
    marginBottom: 2,
  },
  positionIcon: { fontSize: 16, textAlign: 'center' },
  teamCell: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teamDot: { width: 10, height: 10, borderRadius: 5 },
  teamCellName: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  cell: { flex: 1, color: '#DDDDDD', textAlign: 'center', fontSize: 14 },
  qualBox: {
    backgroundColor: '#112240',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  qualTitle: { color: '#8899AA', fontWeight: '700', fontSize: 12, marginBottom: 8, letterSpacing: 1 },
  qualRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  qualDot: { width: 10, height: 10, borderRadius: 5 },
  qualText: { color: '#CCCCCC', fontSize: 12 },
  sectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: '#112240',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  resultTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultTeamName: { color: '#8899AA', fontSize: 12, flex: 1 },
  winnerText: { color: '#6BCB77', fontWeight: '700' },
  resultScores: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultScore: { color: '#F4A261', fontWeight: '800', fontSize: 14 },
  resultVs: { color: '#445566', fontSize: 11 },
  resultDesc: { color: '#8899AA', fontSize: 12, textAlign: 'center', marginTop: 4 },
});
