import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [slideAnim] = useState(new Animated.Value(300)); // Começa escondido abaixo da tela

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const consent = await AsyncStorage.getItem('cookieConsent');
      if (!consent) {
        setShowBanner(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error('Erro ao verificar consentimento de cookies:', error);
    }
  };

  const handleChoice = async (choice) => {
    try {
      await AsyncStorage.setItem('cookieConsent', choice);
      // Animação de saída
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowBanner(false));
      console.log(`Cookies ${choice === 'accepted' ? 'aceitos' : 'rejeitados'} pelo usuário.`);
    } catch (error) {
      console.error('Erro ao salvar consentimento de cookies:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>🍪</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Nós usamos cookies</Text>
          <Text style={styles.description}>
            Utilizamos cookies e armazenamento local para melhorar sua experiência no aplicativo, personalizar conteúdo e garantir segurança.
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonReject} onPress={() => handleChoice('rejected')}>
          <Text style={styles.buttonRejectText}>Rejeitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAccept} onPress={() => handleChoice('accepted')}>
          <Text style={styles.buttonAcceptText}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  buttonReject: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonRejectText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  buttonAccept: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#512da8',
    borderRadius: 8,
  },
  buttonAcceptText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CookieConsent;
