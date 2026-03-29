import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

export default function History({ navigation }) {
  const [items, setItems] = useState([]);
  const [visibleStates, setVisibleStates] = useState([]);

  const loadHistory = async () => {
    try {
      const existing = await AsyncStorage.getItem('history');
      let arr = existing ? JSON.parse(existing) : [];

      // Migração: se for string (formato antigo), transforma em objeto
      arr = arr.map(item => {
        if (typeof item === 'string') {
          return { password: item, appName: 'Sem nome', timestamp: Date.now() };
        }
        return item;
      });

      setItems(arr);
      setVisibleStates(new Array(arr.length).fill(false));
    } catch (e) {
      console.warn('could not load history', e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('history');
      setItems([]);
      setVisibleStates([]);
    } catch (e) {
      console.warn('could not clear history', e);
    }
  };

  const deleteItem = async (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    await AsyncStorage.setItem('history', JSON.stringify(newItems));
    setItems(newItems);
    setVisibleStates(new Array(newItems.length).fill(false));
  };

  const toggleVisibility = (index) => {
    const newStates = [...visibleStates];
    newStates[index] = !newStates[index];
    setVisibleStates(newStates);
  };

  const copyPassword = (password) => {
    Clipboard.setStringAsync(password);
    Alert.alert('Copiado', 'Senha copiada para a área de transferência');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item, index }) => {
    if (!item || typeof item !== 'object' || !item.password) return null;
    const appName = item.appName || 'Aplicativo';
    const password = item.password;
    const isVisible = visibleStates[index];

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.appName}>{appName}</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => toggleVisibility(index)}>
              <Text style={styles.emoji}>👁️</Text>
            </Pressable>
            <Pressable onPress={() => copyPassword(password)}>
              <Text style={styles.emoji}>📋</Text>
            </Pressable>
            <Pressable onPress={() => deleteItem(index)}>
              <Text style={styles.emoji}>🗑️</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.password}>
          {isVisible ? password : '•'.repeat(password.length)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE SENHAS</Text>

      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma senha gerada ainda</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>VOLTAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057D9',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    width: '100%',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
  },
  emoji: {
    fontSize: 20,
  },
  password: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#555',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
    textAlign: 'center',
  },
});