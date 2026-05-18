import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  Linking
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75; // Drawer ocupará 75% da largura da tela

const MenuDrawer = ({ 
  isOpen, 
  onClose, 
  setShowProfile, 
  setShowHistory, 
  setShowCompanyDonation, 
  handleLogout, 
  user 
}) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current; // Inicia escondido fora da tela (à esquerda)

  useEffect(() => {
    if (isOpen) {
      // Slida para dentro da tela
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slida para fora da tela
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleLinkPress = () => {
    Linking.openURL('https://pmv-tech.github.io/Website-about-us/').catch(err => 
      console.error("Não foi possível carregar a URL:", err)
    );
  };

  if (!isOpen) return null;

  return (
    <Modal
      transparent={true}
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop escuro para fechar ao clicar fora */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Drawer Content */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          
          {/* User Info Header */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <FontAwesome6 name="circle-user" size={48} color="#fff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Seja bem-vindo,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.nome || user?.name || 'Usuário'}!
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuList}>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setShowProfile(true); onClose(); }}
            >
              <FontAwesome6 name="user-gear" size={16} color="#512da8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setShowHistory(true); onClose(); }}
            >
              <FontAwesome6 name="clock-rotate-left" size={16} color="#512da8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Histórico de Doações</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => { setShowCompanyDonation(true); onClose(); }}
            >
              <FontAwesome6 name="heart" size={16} color="#512da8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Apoie nosso Projeto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleLinkPress}
            >
              <FontAwesome6 name="circle-info" size={16} color="#512da8" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Nossa Empresa (Web)</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]} 
              onPress={() => { handleLogout(); onClose(); }}
            >
              <FontAwesome6 name="right-from-bracket" size={16} color="#c62828" style={styles.menuIcon} />
              <Text style={styles.logoutItemText}>Sair da Conta</Text>
            </TouchableOpacity>

          </View>

          {/* Bottom Footer version info */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>DonationHub v1.0.0 (Expo)</Text>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 16,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#512da8',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  menuList: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    height: 52,
  },
  menuIcon: {
    marginRight: 16,
    width: 20,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  logoutItem: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutItemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c62828',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default MenuDrawer;
