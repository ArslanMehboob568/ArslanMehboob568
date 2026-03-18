import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function PlayersScreen({ navigation }) {
  const { players, teams, addPlayer, user } = useApp();
  const isAdmin = user?.role === 'admin';

  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [sortBy, setSortBy] = useState('runs');
  const [addModal, setAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Batsman');
  const [newTeamId, setNewTeamId] = useState('');

  const getTeam = (id) => teams.find((t) => t.id === id) || { name: 'Unknown', color: '#666' };

  const filtered = players
    .filter((p) => selectedTeamFilter === 'all' || p.teamId === selectedTeamFilter)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const handleAddPlayer = async () => {
    if (!newName.trim() || !newTeamId) {
      Alert.alert('Error', 'Please enter player name and select a team');
      return;
    }
    const newPlayer = {
      id: 'p' + Date.now(),
      name: newName.trim(),
      teamId: newTeamId,
      role: newRole,
      runs: 0,
      wickets: 0,
      matches: 0,
    };
    await addPlayer(newPlayer);
    setAddModal(false);
    setNewName('');
    setNewTeamId('');
    setNewRole('Batsman');
  };

  const topRuns = [...players].sort((a, b) => b.runs - a.runs)[0];
  const topWickets = [...players].sort((a, b) => b.wickets - a.wickets)[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Player Stats</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Performers */}
        {(topRuns?.runs > 0 || topWickets?.wickets > 0) && (
          <>
            <Text style={styles.sectionTitle}>TOP PERFORMERS</Text>
            <View style={styles.topPerformersRow}>
              {topRuns?.runs > 0 && (
                <View style={styles.performerCard}>
                  <Text style={styles.performerBat}>🏏</Text>
                  <Text style={styles.performerLabel}>Top Scorer</Text>
                  <Text style={styles.performerName}>{topRuns.name}</Text>
                  <Text style={styles.performerStat}>{topRuns.runs} runs</Text>
                  <Text style={[styles.performerTeam, { color: getTeam(topRuns.teamId).color }]}>
                    {getTeam(topRuns.teamId).name}
                  </Text>
                </View>
              )}
              {topWickets?.wickets > 0 && (
                <View style={styles.performerCard}>
                  <Text style={styles.performerBat}>🎯</Text>
                  <Text style={styles.performerLabel}>Top Wicket-Taker</Text>
                  <Text style={styles.performerName}>{topWickets.name}</Text>
                  <Text style={styles.performerStat}>{topWickets.wickets} wickets</Text>
                  <Text style={[styles.performerTeam, { color: getTeam(topWickets.teamId).color }]}>
                    {getTeam(topWickets.teamId).name}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Filters */}
        <Text style={styles.sectionTitle}>ALL PLAYERS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedTeamFilter === 'all' && styles.filterChipActive]}
            onPress={() => setSelectedTeamFilter('all')}
          >
            <Text style={[styles.filterChipText, selectedTeamFilter === 'all' && styles.filterChipTextActive]}>
              All Teams
            </Text>
          </TouchableOpacity>
          {teams.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.filterChip, selectedTeamFilter === t.id && styles.filterChipActive, { borderColor: t.color }]}
              onPress={() => setSelectedTeamFilter(t.id)}
            >
              <Text style={[styles.filterChipText, selectedTeamFilter === t.id && { color: t.color }]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {['runs', 'wickets', 'matches'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
              onPress={() => setSortBy(s)}
            >
              <Text style={[styles.sortBtnText, sortBy === s && styles.sortBtnTextActive]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>PLAYER</Text>
          <Text style={styles.headerCell}>M</Text>
          <Text style={styles.headerCell}>R</Text>
          <Text style={styles.headerCell}>W</Text>
        </View>

        {/* Players */}
        {filtered.map((player, index) => {
          const team = getTeam(player.teamId);
          return (
            <View key={player.id} style={[styles.playerRow, index % 2 === 0 && styles.playerRowEven]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: team.color + '33' }]}>
                    <Text style={[styles.roleText, { color: team.color }]}>{player.role}</Text>
                  </View>
                  <Text style={[styles.teamTag, { color: team.color }]}>{team.name}</Text>
                </View>
              </View>
              <Text style={styles.cell}>{player.matches}</Text>
              <Text style={[styles.cell, { color: '#F4A261', fontWeight: '700' }]}>{player.runs}</Text>
              <Text style={[styles.cell, { color: '#4D96FF', fontWeight: '700' }]}>{player.wickets}</Text>
            </View>
          );
        })}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Player Modal */}
      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Player</Text>

            <Text style={styles.modalLabel}>Player Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Babar Azam"
              placeholderTextColor="#445566"
            />

            <Text style={styles.modalLabel}>Role</Text>
            <View style={styles.roleRow}>
              {['Batsman', 'Bowler', 'All-Rounder', 'WK-Batsman'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, newRole === r && styles.roleOptionActive]}
                  onPress={() => setNewRole(r)}
                >
                  <Text style={[styles.roleOptionText, newRole === r && styles.roleOptionTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Select Team</Text>
            {teams.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.teamOption, newTeamId === t.id && { borderColor: t.color, backgroundColor: t.color + '22' }]}
                onPress={() => setNewTeamId(t.id)}
              >
                <View style={[styles.teamOptionDot, { backgroundColor: t.color }]} />
                <Text style={styles.teamOptionText}>{t.name}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddPlayer}>
                <Text style={styles.saveBtnText}>Add Player</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  addBtn: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    width: 60,
    alignItems: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  sectionTitle: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  topPerformersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  performerCard: {
    flex: 1,
    backgroundColor: '#112240',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  performerBat: { fontSize: 28, marginBottom: 4 },
  performerLabel: { color: '#8899AA', fontSize: 10, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  performerName: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  performerStat: { color: '#F4A261', fontSize: 18, fontWeight: '900', marginTop: 2 },
  performerTeam: { fontSize: 11, marginTop: 2, fontWeight: '600' },
  filterRow: { paddingHorizontal: 16, paddingBottom: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#112240',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  filterChipActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  filterChipText: { color: '#8899AA', fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#FFFFFF' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  sortLabel: { color: '#8899AA', fontSize: 12, marginRight: 4 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#112240',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  sortBtnActive: { backgroundColor: '#4D96FF22', borderColor: '#4D96FF' },
  sortBtnText: { color: '#8899AA', fontSize: 12 },
  sortBtnTextActive: { color: '#4D96FF', fontWeight: '700' },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E3A5F',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    color: '#8899AA',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  playerRowEven: { backgroundColor: '#112240' + '44' },
  playerName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  playerMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  roleBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: '600' },
  teamTag: { fontSize: 10 },
  cell: { flex: 1, color: '#DDDDDD', textAlign: 'center', fontSize: 14 },
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
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#0A1628',
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  roleOptionActive: { borderColor: '#2A9D8F', backgroundColor: '#0A2A28' },
  roleOptionText: { color: '#8899AA', fontSize: 12 },
  roleOptionTextActive: { color: '#2A9D8F', fontWeight: '700' },
  teamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 12,
    marginBottom: 6,
    gap: 10,
  },
  teamOptionDot: { width: 12, height: 12, borderRadius: 6 },
  teamOptionText: { color: '#FFFFFF', fontWeight: '600' },
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
});
