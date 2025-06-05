import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Pressable } from 'react-native';
import { ScrumTeamQueryServiceDto } from '@panda-project/use-case';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MobileScrumTeamQueryService } from '@/services/MobileScrumTeamQueryService';

type ScrumTeamData = ScrumTeamQueryServiceDto['scrumTeam'];

export default function ScrumTeamScreen() {
  const [scrumTeam, setScrumTeam] = useState<ScrumTeamData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const loadScrumTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryService = new MobileScrumTeamQueryService();
      const result = await queryService.exec();
      
      if (result.error) {
        setError(String(result.error));
      } else {
        setScrumTeam(result.data.scrumTeam);
      }
    } catch (err) {
      setError('スクラムチームの読み込みに失敗しました');
      console.error('Error loading scrum team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScrumTeam();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>スクラムチームを読み込み中...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <IconSymbol size={48} name="exclamationmark.triangle" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable 
            style={[styles.retryButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={loadScrumTeam}
          >
            <ThemedText style={styles.retryButtonText}>再試行</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  if (!scrumTeam) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <IconSymbol size={48} name="person.3" color={Colors[colorScheme ?? 'light'].text} />
          <ThemedText style={styles.emptyText}>スクラムチームが作成されていません</ThemedText>
          <ThemedText style={styles.emptySubText}>
            まずはスクラムチームを作成してください
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <IconSymbol size={32} name="person.3.fill" color={Colors[colorScheme ?? 'light'].tint} />
            <ThemedText type="title" style={styles.headerTitle}>スクラムチーム</ThemedText>
          </View>
          <Pressable 
            style={[styles.refreshButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={loadScrumTeam}
            disabled={loading}
          >
            <IconSymbol size={16} name="arrow.clockwise" color="white" />
          </Pressable>
        </View>

        {/* Product Owner Card */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} name="crown.fill" color="#FFD700" />
            <ThemedText type="subtitle" style={styles.roleTitle}>プロダクトオーナー</ThemedText>
          </View>
          <View style={styles.memberInfo}>
            <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <ThemedText style={styles.avatarText}>PO</ThemedText>
            </View>
            <View style={styles.memberDetails}>
              <ThemedText type="defaultSemiBold" style={styles.memberName}>
                {scrumTeam.productOwner.name}
              </ThemedText>
              <ThemedText style={styles.memberRole}>
                ID: {scrumTeam.productOwner.employeeId}
                {scrumTeam.productOwner.isDeveloper && ' • 開発者兼任'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Scrum Master Card */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} name="star.fill" color="#FF6B6B" />
            <ThemedText type="subtitle" style={styles.roleTitle}>スクラムマスター</ThemedText>
          </View>
          <View style={styles.memberInfo}>
            <View style={[styles.avatar, { backgroundColor: '#FF6B6B' }]}>
              <ThemedText style={styles.avatarText}>SM</ThemedText>
            </View>
            <View style={styles.memberDetails}>
              <ThemedText type="defaultSemiBold" style={styles.memberName}>
                {scrumTeam.scrumMaster.name}
              </ThemedText>
              <ThemedText style={styles.memberRole}>
                ID: {scrumTeam.scrumMaster.employeeId}
                {scrumTeam.scrumMaster.isDeveloper && ' • 開発者兼任'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Developers Card */}
        <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol size={24} name="laptopcomputer" color="#4ECDC4" />
            <ThemedText type="subtitle" style={styles.roleTitle}>
              開発者 ({scrumTeam.developers.length}名)
            </ThemedText>
          </View>
          {scrumTeam.developers.map((developer, index) => (
            <View key={developer.employeeId} style={styles.memberInfo}>
              <View style={[styles.avatar, { backgroundColor: '#4ECDC4' }]}>
                <ThemedText style={styles.avatarText}>D{index + 1}</ThemedText>
              </View>
              <View style={styles.memberDetails}>
                <ThemedText type="defaultSemiBold" style={styles.memberName}>
                  {developer.name}
                </ThemedText>
                <ThemedText style={styles.memberRole}>
                  ID: {developer.employeeId}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Team Summary */}
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
          <ThemedText type="subtitle" style={styles.summaryTitle}>チーム概要</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>総メンバー数:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {scrumTeam.developers.length + 2}名
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>開発者数:</ThemedText>
            <ThemedText style={styles.summaryValue}>{scrumTeam.developers.length}名</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>兼任状況:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {(scrumTeam.productOwner.isDeveloper ? 1 : 0) + 
               (scrumTeam.scrumMaster.isDeveloper ? 1 : 0)}名が兼任
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubText: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 12,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    marginLeft: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4ECDC4',
  },
});
