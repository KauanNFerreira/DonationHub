import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

// Components
import CookieConsent from './src/components/CookieConsent';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setCurrentPage('home');
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão no mobile:', error);
      // Se der erro, limpa os dados corrompidos
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
    } finally {
      setInitializing(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setCurrentPage('welcome');
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#512da8" />
      </View>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen onNavigate={setCurrentPage} />;
      case 'login':
        return (
          <LoginScreen 
            onNavigate={setCurrentPage} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'register':
        return <RegisterScreen onNavigate={setCurrentPage} />;
      case 'home':
        return (
          <HomeScreen 
            user={user} 
            setUser={setUser} 
            onLogout={handleLogout} 
          />
        );
      default:
        return <WelcomeScreen onNavigate={setCurrentPage} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Renders active screen */}
      {renderPage()}
      
      {/* Cookie consent banner rendered globally */}
      <CookieConsent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
