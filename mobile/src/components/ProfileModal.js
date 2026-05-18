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
  ActivityIndicator,
  Alert
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileModal = ({ user, onClose, setUser }) => {
  // Ajuste do nome para lidar com a diferença de campos user.nome (do backend) ou user.name (do front antigo)
  const initialName = user?.nome || user?.name || '';
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg('O nome não pode ficar em branco!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Como o backend utiliza SQLite remoto e o frontend guarda o objeto atualizado,
      // nós atualizamos os dados locais do usuário no AsyncStorage.
      const updatedUser = { 
        ...user, 
        nome: name.trim(),
        name: name.trim() // mantem compatibilidade
      };

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (setUser) {
        setUser(updatedUser);
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMsg('Não foi possível salvar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={!!user}
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
              <Text style={styles.headerTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <FontAwesome6 name="circle-exclamation" size={14} color="#c62828" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Body / Form */}
            <View style={styles.body}>
              
              {/* Field: Email (Read Only) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>E-mail (Não pode ser alterado)</Text>
                <View style={[styles.inputContainer, styles.inputDisabled]}>
                  <FontAwesome6 name="envelope" size={14} color="#aaa" style={styles.inputIcon} />
                  <Text style={styles.disabledText}>{user?.email}</Text>
                </View>
              </View>

              {/* Field: Name (Editable) */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Nome Completo</Text>
                <View style={styles.inputContainer}>
                  <FontAwesome6 name="user" size={14} color="#512da8" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Seu nome"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity 
                style={[styles.saveBtn, loading && styles.btnDisabled]} 
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>

            </View>

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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#c62828',
    fontWeight: '500',
  },
  body: {
    padding: 20,
    gap: 16,
  },
  fieldGroup: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    paddingLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    height: '100%',
  },
  disabledText: {
    fontSize: 14,
    color: '#64748b',
  },
  saveBtn: {
    backgroundColor: '#512da8',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#512da8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  btnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default ProfileModal;
