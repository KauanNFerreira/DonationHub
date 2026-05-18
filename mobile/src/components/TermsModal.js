import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Termos e Privacidade</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
            <Text style={styles.paragraph}>
              Ao criar uma conta no DonationHub, você concorda com os termos aqui descritos. O aplicativo foi desenvolvido para facilitar o contato entre doadores e recebedores. Não nos responsabilizamos por transações feitas fora da plataforma.
            </Text>

            <Text style={styles.sectionTitle}>2. Uso de Dados</Text>
            <Text style={styles.paragraph}>
              Os seus dados pessoais (nome, e-mail) serão utilizados apenas para fins de autenticação e comunicação dentro da plataforma. Não venderemos ou compartilharemos seus dados com terceiros.
            </Text>

            <Text style={styles.sectionTitle}>3. Responsabilidade do Usuário</Text>
            <Text style={styles.paragraph}>
              Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Informe imediatamente qualquer uso não autorizado da sua conta.
            </Text>

            <Text style={styles.sectionTitle}>4. Política de Doações</Text>
            <Text style={styles.paragraph}>
              Todas as doações cadastradas devem ser itens lícitos e em condições adequadas de uso. A plataforma reserva-se o direito de remover anúncios que violem nossas regras de convivência.
            </Text>

            <Text style={styles.sectionTitle}>5. Direitos Autorais</Text>
            <Text style={styles.paragraph}>
              Todo o conteúdo deste aplicativo, incluindo textos, gráficos, logotipos, ícones de botões, imagens e software, é de propriedade do DonationHub ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais.
            </Text>

            <Text style={[styles.paragraph, styles.conclusion]}>
              Por favor, leia atentamente. Ao clicar em "Aceitar", você afirma ter lido e concordado com todos os termos.
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.buttonReject} onPress={onClose}>
              <Text style={styles.buttonRejectText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonAccept} 
              onPress={() => {
                onAccept();
                onClose();
              }}
            >
              <Text style={styles.buttonAcceptText}>Aceitar Termos</Text>
            </TouchableOpacity>
          </View>
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
    height: '80%',
    paddingBottom: 24,
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
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#512da8',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  conclusion: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  buttonReject: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  buttonRejectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  buttonAccept: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#512da8',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonAcceptText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default TermsModal;
