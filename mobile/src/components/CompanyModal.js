import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const CompanyModal = ({ company, onClose, onDonate }) => {
  const [amount, setAmount] = useState('');
  const [showPix, setShowPix] = useState(false);
  const [copied, setCopied] = useState(false);

  const presets = ['10', '20', '50', '100'];

  const handleConfirm = () => {
    const parsedAmount = parseFloat(amount);
    if (amount && !isNaN(parsedAmount) && parsedAmount > 0) {
      setShowPix(true);
    }
  };

  const copyPix = async () => {
    await Clipboard.setStringAsync(company.pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalize = () => {
    onDonate(company, parseFloat(amount));
    onClose();
  };

  return (
    <Modal
      visible={!!company}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {showPix ? 'Chave PIX Gerada' : `Doar para ${company.name}`}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            {!showPix ? (
              // ENTER AMOUNT STEP
              <View style={styles.body}>
                <Text style={styles.companyDescription}>{company.description}</Text>
                
                <Text style={styles.label}>Escolha ou digite um valor (R$):</Text>
                
                {/* Presets */}
                <View style={styles.presetContainer}>
                  {presets.map((val) => (
                    <TouchableOpacity 
                      key={val} 
                      style={[styles.presetBtn, amount === val && styles.presetBtnActive]}
                      onPress={() => setAmount(val)}
                    >
                      <Text style={[styles.presetText, amount === val && styles.presetTextActive]}>
                        R$ {val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Manual Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencyPrefix}>R$</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor="#999"
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.confirmBtn, (!amount || parseFloat(amount) <= 0) && styles.btnDisabled]}
                  onPress={handleConfirm}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  <Text style={styles.confirmBtnText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // SHOW PIX KEY STEP
              <View style={styles.body}>
                <View style={styles.successBadge}>
                  <FontAwesome6 name="circle-check" size={48} color="#2e7d32" />
                </View>

                <Text style={styles.successAmount}>R$ {parseFloat(amount).toFixed(2)}</Text>
                
                <View style={styles.pixBox}>
                  <Text style={styles.pixBoxLabel}>Chave PIX ({company.name}):</Text>
                  
                  <View style={styles.pixRow}>
                    <Text style={styles.pixKeyText} numberOfLines={1}>{company.pix}</Text>
                    
                    <TouchableOpacity style={[styles.copyBtn, copied && styles.copyBtnActive]} onPress={copyPix}>
                      <FontAwesome6 name={copied ? "check" : "copy"} size={14} color={copied ? "#fff" : "#512da8"} />
                      <Text style={[styles.copyBtnText, copied && styles.copyBtnTextActive]}>
                        {copied ? 'Copiado!' : 'Copiar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.instructionText}>
                  Abra o app do seu banco, faça o pagamento via PIX e clique abaixo para finalizar o registro.
                </Text>

                <TouchableOpacity style={styles.finalizeBtn} onPress={handleFinalize}>
                  <Text style={styles.finalizeBtnText}>Finalizar Doação</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    width: '100%',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
    fontSize: 16,
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
  body: {
    padding: 20,
  },
  companyDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  presetBtnActive: {
    backgroundColor: '#512da8',
    borderColor: '#512da8',
  },
  presetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#512da8',
  },
  presetTextActive: {
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    height: '100%',
  },
  confirmBtn: {
    backgroundColor: '#512da8',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#512da8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  btnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  successBadge: {
    alignItems: 'center',
    marginVertical: 12,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  pixBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  pixBoxLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  pixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  pixKeyText: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0d7f7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  copyBtnActive: {
    backgroundColor: '#2e7d32',
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#512da8',
  },
  copyBtnTextActive: {
    color: '#fff',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  finalizeBtn: {
    backgroundColor: '#2e7d32',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  finalizeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CompanyModal;
