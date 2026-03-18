import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function PlayerDashboard({ navigation }) {
  const { setUser, matches, teams, standings, players } = useApp();

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  const getTeam = (id) => teams.find((t) => t.id === id) || { name: 'TBD', color: '#666', shortName: '???' };

  const topBatsman = [...players].sort((a, b) => b.runs - a.runs)[0];
  const topBowler = [...players].sort((a, b) => b.wickets - a.wickets)[0];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setUser(null);
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.playerTitle}>🏏 Player View</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tournament Banner */}
        <View style={styles.tournamentBanner}>
          <Text style={styles.bannerIcon}>🏏</Text>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerTitle}>BBL 2024</Text>
            <Text style={styles.bannerSub}>School Cricket Tournament</Text>
          </View>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>VIEWER</Text>
          </View>
        </View>

        {/* Live Match Alert */}
        {liveMatches.length > 0 && (
          <TouchableOpacity
            style={styles.liveAlert}
            onPress={() => navigation.navigate('Matches')}
          >
            <View style={styles.liveDot} />
            <Text style={styles.liveAlertText}>
              🔴 LIVE: {getTeam(liveMatches[0].team1Id).name} vs {getTeam(liveMatches[0].team2Id).name}
            </Text>
            <Text style={styles.liveAlertScore}>
              {liveMatches[0].team1Score.runs}/{liveMatches[0].team1Score.wickets} · {liveMatches[0].team2Score.runs}/{liveMatches[0].team2Score.wickets}
            </Text>
            <Text style={styles.liveArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: '#FF6B6B' }]}>
            <Text style={styles.statNum}>{liveMatches.length}</Text>
            <Text style={styles.statLabel}>Live</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#4D96FF' }]}>
            <Text style={styles.statNum}>{upcomingMatches.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#6BCB77' }]}>
            <Text style={styles.statNum}>{completedMatches.length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* Quick Nav */}
        <Text style={styles.sectionTitle}>TOURNAMENT INFO</Text>

        <View style={styles.navGrid}>
          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Matches')}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navLabel}>Matches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Standings')}>
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navLabel}>Standings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Players')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Players</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Teams')}>
            <Text style={styles.navIcon}>🏟️</Text>
            <Text style={styles.navLabel}>Teams</Text>
          </TouchableOpacity>
        </View>

        {/* Points Table Preview */}
        <Text style={styles.sectionTitle}>POINTS TABLE</Text>
        <View style={styles.pointsTableCard}>
          <View style={styles.pointsTableHeader}>
            <Text style={[styles.pointsHeaderCell, { flex: 2 }]}>TEAM</Text>
            <Text style={styles.pointsHeaderCell}>P</Text>
            <Text style={styles.pointsHeaderCell}>W</Text>
            <Text style={styles.pointsHeaderCell}>L</Text>
            <Text style={styles.pointsHeaderCell}>PTS</Text>
          </View>
          {standings.map((s, i) => {
            const team = getTeam(s.teamId);
            return (
              <View key={s.teamId} style={styles.pointsRow}>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: '#8899AA', width: 16 }}>{i + 1}</Text>
                  <View style={[styles.teamDot, { backgroundColor: team.color }]} />
                  <Text style={styles.pointsTeamName}>{team.name}</Text>
                </View>
                <Text style={styles.pointsCell}>{s.played}</Text>
                <Text style={[styles.pointsCell, { color: '#6BCB77' }]}>{s.won}</Text>
                <Text style={[styles.pointsCell, { color: '#FF6B6B' }]}>{s.lost}</Text>
                <Text style={[styles.pointsCell, { color: '#F4A261', fontWeight: '800' }]}>{s.points}</Text>
              </View>
            );
          })}
        </View>

        {/* Top Performers */}
        {(topBatsman?.runs > 0 || topBowler?.wickets > 0) && (
          <>
            <Text style={styles.sectionTitle}>TOP PERFORMERS</Text>
            <View style={styles.performerRow}>
              {topBatsman?.runs > 0 && (
                <View style={styles.performerCard}>
                  <Text style={styles.performerEmoji}>🏏</Text>
                  <Text style={styles.performerType}>Top Scorer</Text>
                  <Text style={styles.performerName}>{topBatsman.name}</Text>
                  <Text style={styles.performerStat}>{topBatsman.runs} runs</Text>
                  <Text style={[styles.performerTeam, { color: getTeam(topBatsman.teamId).color }]}>
                    {getTeam(topBatsman.teamId).name}
                  </Text>
                </View>
              )}
              {topBowler?.wickets > 0 && (
                <View style={styles.performerCard}>
                  <Text style={styles.performerEmoji}>🎯</Text>
                  <Text style={styles.performerType}>Top Bowler</Text>
                  <Text style={styles.performerName}>{topBowler.name}</Text>
                  <Text style={styles.performerStat}>{topBowler.wickets} wickets</Text>
                  <Text style={[styles.performerTeam, { color: getTeam(topBowler.teamId).color }]}>
                    {getTeam(topBowler.teamId).name}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Upcoming Fixtures */}
        {upcomingMatches.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>UPCOMING FIXTURES</Text>
            {upcomingMatches.slice(0, 3).map((match) => {
              const t1 = getTeam(match.team1Id);
              const t2 = getTeam(match.team2Id);
              return (
                <View key={match.id} style={styles.fixtureCard}>
                  <View style={styles.fixtureTeams}>
                    <View style={styles.fixtureSide}>
                      <View style={[styles.fixtureBadge, { backgroundColor: t1.color }]}>
                        <Text style={styles.fixtureBadgeText}>{t1.shortName}</Text>
                      </View>
                      <Text style={styles.fixtureTeamName}>{t1.name}</Text>
                    </View>
                    <Text style={styles.fixtureVs}>VS</Text>
                    <View style={[styles.fixtureSide, { alignItems: 'flex-end' }]}>
                      <View style={[styles.fixtureBadge, { backgroundColor: t2.color }]}>
                        <Text style={styles.fixtureBadgeText}>{t2.shortName}</Text>
                      </View>
                      <Text style={styles.fixtureTeamName}>{t2.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.fixtureDate}>📅 {match.date} · 📍 {match.venue}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  welcomeText: { color: '#8899AA', fontSize: 12 },
  playerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  logoutBtn: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#FF6B6B', fontWeight: '700', fontSize: 13 },
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
  bannerIcon: { fontSize: 32 },
  bannerInfo: { flex: 1 },
  bannerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  bannerSub: { color: '#8899AA', fontSize: 12 },
  bannerBadge: {
    backgroundColor: '#4D96FF22',
    borderWidth: 1,
    borderColor: '#4D96FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bannerBadgeText: { color: '#4D96FF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  liveAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF000011',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B6B' },
  liveAlertText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', flex: 1 },
  liveAlertScore: { color: '#F4A261', fontWeight: '700' },
  liveArrow: { color: '#FF6B6B', fontSize: 20 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNum: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  statLabel: { color: '#8899AA', fontSize: 11, fontWeight: '600', marginTop: 2 },
  sectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  navCard: {
    width: '47%',
    backgroundColor: '#112240',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  navIcon: { fontSize: 30, marginBottom: 8 },
  navLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pointsTableCard: {
    backgroundColor: '#112240',
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  pointsTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E3A5F',
    padding: 10,
    paddingHorizontal: 14,
  },
  pointsHeaderCell: {
    flex: 1,
    color: '#8899AA',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  teamDot: { width: 8, height: 8, borderRadius: 4 },
  pointsTeamName: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  pointsCell: { flex: 1, color: '#DDDDDD', textAlign: 'center', fontSize: 13 },
  performerRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  performerCard: {
    flex: 1,
    backgroundColor: '#112240',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  performerEmoji: { fontSize: 28, marginBottom: 4 },
  performerType: { color: '#8899AA', fontSize: 10, letterSpacing: 1, fontWeight: '600' },
  performerName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  performerStat: { color: '#F4A261', fontSize: 18, fontWeight: '900', marginTop: 2 },
  performerTeam: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  fixtureCard: {
    backgroundColor: '#112240',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  fixtureTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fixtureSide: { alignItems: 'flex-start', gap: 4 },
  fixtureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fixtureBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  fixtureTeamName: { color: '#DDDDDD', fontSize: 12 },
  fixtureVs: { color: '#445566', fontWeight: '900', fontSize: 13 },
  fixtureDate: { color: '#8899AA', fontSize: 11, textAlign: 'center' },
});
