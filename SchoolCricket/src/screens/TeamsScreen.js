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

const TEAM_COLORS = ['#E63946', '#2A9D8F', '#E9C46A', '#457B9D', '#6BCB77', '#FF6B6B', '#4D96FF', '#F4A261'];

export default function TeamsScreen({ navigation }) {
  const { teams, players, standings, addTeam, user } = useApp();
  const isAdmin = user?.role === 'admin';

  const [addModal, setAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newShort, setNewShort] = useState('');
  const [newColor, setNewColor] = useState(TEAM_COLORS[0]);

  const getStanding = (teamId) => standings.find((s) => s.teamId === teamId) || { played: 0, won: 0, lost: 0, points: 0 };
  const getPlayers = (teamId) => players.filter((p) => p.teamId === teamId);

  const handleAddTeam = async () => {
    if (!newName.trim() || !newShort.trim()) {
      Alert.alert('Error', 'Please enter team name and short name');
      return;
    }
    const team = {
      id: 't' + Date.now(),
      name: newName.trim(),
      shortName: newShort.trim().toUpperCase().slice(0, 4),
      color: newColor,
    };
    await addTeam(team);
    setAddModal(false);
    setNewName('');
    setNewShort('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Teams</Text>
        {isAdmin && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {teams.map((team) => {
          const standing = getStanding(team.id);
          const teamPlayers = getPlayers(team.id);
          return (
            <View key={team.id} style={[styles.teamCard, { borderColor: team.color }]}>
              <View style={[styles.teamHeader, { backgroundColor: team.color }]}>
                <View style={styles.teamHeaderLeft}>
                  <Text style={styles.teamShortName}>{team.shortName}</Text>
                  <View>
                    <Text style={styles.teamFullName}>{team.name}</Text>
                    <Text style={styles.teamPlayerCount}>{teamPlayers.length} players</Text>
                  </View>
                </View>
                <View style={styles.teamPoints}>
                  <Text style={styles.teamPointsNum}>{standing.points}</Text>
                  <Text style={styles.teamPointsLabel}>PTS</Text>
                </View>
              </View>

              <View style={styles.teamStats}>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatNum}>{standing.played}</Text>
                  <Text style={styles.teamStatLabel}>Played</Text>
                </View>
                <View style={styles.teamStatDivider} />
                <View style={styles.teamStatItem}>
                  <Text style={[styles.teamStatNum, { color: '#6BCB77' }]}>{standing.won}</Text>
                  <Text style={styles.teamStatLabel}>Won</Text>
                </View>
                <View style={styles.teamStatDivider} />
                <View style={styles.teamStatItem}>
                  <Text style={[styles.teamStatNum, { color: '#FF6B6B' }]}>{standing.lost}</Text>
                  <Text style={styles.teamStatLabel}>Lost</Text>
                </View>
                <View style={styles.teamStatDivider} />
                <View style={styles.teamStatItem}>
                  <Text style={[styles.teamStatNum, { color: standing.nrr >= 0 ? '#6BCB77' : '#FF6B6B' }]}>
                    {standing.nrr > 0 ? '+' : ''}{standing.nrr || '0.00'}
                  </Text>
                  <Text style={styles.teamStatLabel}>NRR</Text>
                </View>
              </View>

              {/* Player List */}
              {teamPlayers.length > 0 && (
                <View style={styles.playersList}>
                  <Text style={styles.playersListTitle}>Squad</Text>
                  <View style={styles.playersWrap}>
                    {teamPlayers.map((p) => (
                      <View key={p.id} style={[styles.playerChip, { borderColor: team.color + '66' }]}>
                        <Text style={styles.playerChipText}>{p.name}</Text>
                        <Text style={[styles.playerChipRole, { color: team.color }]}>{p.role}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Team Modal */}
      <Modal visible={addModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Team</Text>

            <Text style={styles.modalLabel}>Team Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Team Eagles"
              placeholderTextColor="#445566"
            />

            <Text style={styles.modalLabel}>Short Name (3-4 chars)</Text>
            <TextInput
              style={styles.modalInput}
              value={newShort}
              onChangeText={setNewShort}
              placeholder="e.g. EGL"
              placeholderTextColor="#445566"
              maxLength={4}
              autoCapitalize="characters"
            />

            <Text style={styles.modalLabel}>Team Color</Text>
            <View style={styles.colorRow}>
              {TEAM_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, newColor === c && styles.colorDotSelected]}
                  onPress={() => setNewColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddTeam}>
                <Text style={styles.saveBtnText}>Add Team</Text>
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
  teamCard: {
    backgroundColor: '#112240',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  teamHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamShortName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  teamFullName: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  teamPlayerCount: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  teamPoints: { alignItems: 'center' },
  teamPointsNum: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  teamPointsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  teamStats: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
  },
  teamStatItem: { flex: 1, alignItems: 'center' },
  teamStatNum: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  teamStatLabel: { color: '#8899AA', fontSize: 10, fontWeight: '600', marginTop: 2 },
  teamStatDivider: { width: 1, backgroundColor: '#1E3A5F' },
  playersList: { padding: 14 },
  playersListTitle: { color: '#8899AA', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  playersWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  playerChip: {
    backgroundColor: '#0A1628',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  playerChipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  playerChipRole: { fontSize: 9, fontWeight: '600', marginTop: 1 },
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
  modalLabel: { color: '#8899AA', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 12, letterSpacing: 1 },
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
  colorRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 4 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: '#FFFFFF' },
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
