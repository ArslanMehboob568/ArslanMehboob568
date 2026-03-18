import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function AddMatchScreen({ navigation }) {
  const { teams, addMatch } = useApp();

  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('Main Ground');

  const handleCreate = async () => {
    if (!team1Id || !team2Id) {
      Alert.alert('Error', 'Please select both teams');
      return;
    }
    if (team1Id === team2Id) {
      Alert.alert('Error', 'Teams must be different');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Error', 'Please enter match date');
      return;
    }
    const newMatch = {
      id: 'm' + Date.now(),
      team1Id,
      team2Id,
      status: 'upcoming',
      date: date.trim(),
      venue: venue.trim() || 'Main Ground',
      team1Score: { runs: 0, wickets: 0, overs: 0 },
      team2Score: { runs: 0, wickets: 0, overs: 0 },
      result: null,
      winnerId: null,
    };
    await addMatch(newMatch);
    Alert.alert('Match Added!', 'New match has been scheduled.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const TeamSelector = ({ label, selectedId, onSelect, excludeId }) => (
    <View style={styles.selectorBox}>
      <Text style={styles.selectorLabel}>{label}</Text>
      {teams.map((team) => (
        <TouchableOpacity
          key={team.id}
          style={[
            styles.teamOption,
            selectedId === team.id && { borderColor: team.color, backgroundColor: team.color + '22' },
            excludeId === team.id && styles.teamOptionDisabled,
          ]}
          onPress={() => excludeId !== team.id && onSelect(team.id)}
          disabled={excludeId === team.id}
        >
          <View style={[styles.teamDot, { backgroundColor: excludeId === team.id ? '#445566' : team.color }]} />
          <Text style={[styles.teamOptionText, excludeId === team.id && styles.teamOptionTextDisabled]}>
            {team.name}
          </Text>
          {selectedId === team.id && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Add Match</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>🏏 Schedule a new match for BBL 2024</Text>
        </View>

        <TeamSelector
          label="SELECT TEAM 1"
          selectedId={team1Id}
          onSelect={setTeam1Id}
          excludeId={team2Id}
        />

        <View style={styles.vsRow}>
          <View style={styles.vsDivider} />
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsDivider} />
        </View>

        <TeamSelector
          label="SELECT TEAM 2"
          selectedId={team2Id}
          onSelect={setTeam2Id}
          excludeId={team1Id}
        />

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>MATCH DATE</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="e.g. 2024-03-20"
            placeholderTextColor="#445566"
          />

          <Text style={styles.inputLabel}>VENUE</Text>
          <TextInput
            style={styles.input}
            value={venue}
            onChangeText={setVenue}
            placeholder="e.g. Main Ground"
            placeholderTextColor="#445566"
          />
        </View>

        {/* Preview */}
        {team1Id && team2Id && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Match Preview</Text>
            <View style={styles.previewTeams}>
              <Text style={[styles.previewTeamName, { color: teams.find(t => t.id === team1Id)?.color }]}>
                {teams.find(t => t.id === team1Id)?.name}
              </Text>
              <Text style={styles.previewVs}>VS</Text>
              <Text style={[styles.previewTeamName, { color: teams.find(t => t.id === team2Id)?.color }]}>
                {teams.find(t => t.id === team2Id)?.name}
              </Text>
            </View>
            <Text style={styles.previewDate}>📅 {date || 'Date TBD'} · 📍 {venue}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Schedule Match</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  infoBox: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  infoText: { color: '#8899AA', fontSize: 13 },
  selectorBox: {
    backgroundColor: '#112240',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E3A5F',
  },
  selectorLabel: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  teamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  teamOptionDisabled: { opacity: 0.4 },
  teamDot: { width: 12, height: 12, borderRadius: 6 },
  teamOptionText: { color: '#FFFFFF', fontWeight: '600', flex: 1 },
  teamOptionTextDisabled: { color: '#445566' },
  checkMark: { color: '#6BCB77', fontWeight: '900', fontSize: 18 },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 12,
  },
  vsDivider: { flex: 1, height: 1, backgroundColor: '#1E3A5F' },
  vsText: { color: '#445566', fontWeight: '900', fontSize: 16 },
  inputSection: {
    backgroundColor: '#112240',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#8899AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0A1628',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  previewCard: {
    backgroundColor: '#1A3A2A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E7D32',
    marginBottom: 16,
    alignItems: 'center',
  },
  previewTitle: { color: '#A5D6A7', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  previewTeams: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  previewTeamName: { fontSize: 16, fontWeight: '800' },
  previewVs: { color: '#445566', fontWeight: '900' },
  previewDate: { color: '#8899AA', fontSize: 12 },
  createBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
