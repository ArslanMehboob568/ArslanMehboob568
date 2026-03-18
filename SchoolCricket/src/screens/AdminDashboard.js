import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function AdminDashboard({ navigation }) {
  const { user, setUser, matches, teams, standings, players } = useApp();

  const completedMatches = matches.filter((m) => m.status === 'completed').length;
  const liveMatches = matches.filter((m) => m.status === 'live').length;
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').length;

  const topTeam = standings.length > 0 ? teams.find((t) => t.id === standings[0]?.teamId) : null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
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

  const MenuCard = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={[styles.menuCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '22' }]}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>⚡ Admin Panel</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tournament Header */}
        <View style={styles.tournamentHeader}>
          <Text style={styles.tournamentHeaderIcon}>🏏</Text>
          <View>
            <Text style={styles.tournamentHeaderTitle}>BBL Tournament 2024</Text>
            <Text style={styles.tournamentHeaderSub}>School Cricket · Admin Control</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: '#F4A261' }]}>
            <Text style={styles.statNumber}>{liveMatches}</Text>
            <Text style={styles.statLabel}>Live</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#2A9D8F' }]}>
            <Text style={styles.statNumber}>{upcomingMatches}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#6BCB77' }]}>
            <Text style={styles.statNumber}>{completedMatches}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statBox, { borderColor: '#4D96FF' }]}>
            <Text style={styles.statNumber}>{teams.length}</Text>
            <Text style={styles.statLabel}>Teams</Text>
          </View>
        </View>

        {/* Leader Banner */}
        {topTeam && standings[0]?.points > 0 && (
          <View style={styles.leaderBanner}>
            <Text style={styles.leaderLabel}>🏆 Points Leader</Text>
            <Text style={styles.leaderTeam}>{topTeam.name}</Text>
            <Text style={styles.leaderPoints}>{standings[0].points} pts · NRR {standings[0].nrr > 0 ? '+' : ''}{standings[0].nrr}</Text>
          </View>
        )}

        {/* Section Title */}
        <Text style={styles.sectionTitle}>MANAGE TOURNAMENT</Text>

        <MenuCard
          icon="📋"
          title="Matches"
          subtitle={`${liveMatches} live · ${upcomingMatches} upcoming`}
          color="#F4A261"
          onPress={() => navigation.navigate('Matches')}
        />
        <MenuCard
          icon="📊"
          title="Points Table"
          subtitle="Team standings & rankings"
          color="#4D96FF"
          onPress={() => navigation.navigate('Standings')}
        />
        <MenuCard
          icon="👤"
          title="Player Stats"
          subtitle={`${players.length} registered players`}
          color="#2A9D8F"
          onPress={() => navigation.navigate('Players')}
        />
        <MenuCard
          icon="🏟️"
          title="Teams"
          subtitle={`${teams.length} teams in tournament`}
          color="#E63946"
          onPress={() => navigation.navigate('Teams')}
        />
        <MenuCard
          icon="➕"
          title="Add Match"
          subtitle="Schedule a new match"
          color="#6BCB77"
          onPress={() => navigation.navigate('AddMatch')}
        />
        <MenuCard
          icon="🎯"
          title="Score Tracker"
          subtitle="Update live match scores"
          color="#FF6B6B"
          onPress={() => navigation.navigate('Matches')}
        />

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
  adminName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  logoutBtn: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#FF6B6B', fontWeight: '700', fontSize: 13 },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112240',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  tournamentHeaderIcon: { fontSize: 36 },
  tournamentHeaderTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  tournamentHeaderSub: { color: '#8899AA', fontSize: 12, marginTop: 2 },
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
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#8899AA', fontSize: 10, marginTop: 2, fontWeight: '600' },
  leaderBanner: {
    backgroundColor: '#1A3A2A',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
  },
  leaderLabel: { color: '#A5D6A7', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  leaderTeam: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 2 },
  leaderPoints: { color: '#6BCB77', fontSize: 13, marginTop: 2 },
  sectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112240',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: { fontSize: 22 },
  menuInfo: { flex: 1 },
  menuTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  menuSubtitle: { color: '#8899AA', fontSize: 12, marginTop: 2 },
  menuArrow: { color: '#8899AA', fontSize: 22, fontWeight: '300' },
});
