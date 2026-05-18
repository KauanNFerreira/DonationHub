import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const HistoryModal = ({ donations = [], onClose }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Histórico de Doações</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State vs List */}
          {donations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="circle-xmark" size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Nenhuma doação encontrada</Text>
              <Text style={styles.emptySubtitle}>Comece a doar para ver seu histórico aqui!</Text>
            </View>
          ) : (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total de Doações</Text>
                  <Text style={styles.summaryVal}>{donations.length}</Text>
                </View>
                <View style={[styles.summaryItem, styles.summaryItemRight]}>
                  <Text style={styles.summaryLabel}>Valor Acumulado</Text>
                  <Text style={[styles.summaryVal, styles.highlightText]}>R$ {totalDonated.toFixed(2)}</Text>
                </View>
              </View>

              {/* Scrollable list */}
              <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {donations.map((donation, index) => (
                  <View key={donation.id || index} style={styles.itemCard}>
                    <View style={styles.itemIconCircle}>
                      <FontAwesome6 name="circle-check" size={18} color="#2e7d32" />
                    </View>
                    
                    <View style={styles.itemDetails}>
                      <View style={styles.itemRow}>
                        <Text style={styles.companyName} numberOfLines={1}>{donation.company_name}</Text>
                        <Text style={styles.amountText}>R$ {donation.amount.toFixed(2)}</Text>
                      </View>
                      
                      <View style={styles.itemRowFooter}>
                        <FontAwesome6 name="calendar-days" size={10} color="#888" style={{ marginRight: 4 }} />
                        <Text style={styles.dateText}>{formatDate(donation.created_at)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#999',
    lineHeight: 28,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    margin: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemRight: {
    borderLeftWidth: 1,
    borderLeftColor: '#cbd5e1',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  highlightText: {
    color: '#512da8',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  itemRowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#888',
  },
});

export default HistoryModal;
