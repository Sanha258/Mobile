import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Alert, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

function makePassword(length = 12) {
  // Caracteres mais fortes: letras maiúsculas, minúsculas, números e símbolos
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export default function Home({ navigation }) {
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appName, setAppName] = useState('');

  const savePassword = async (pw, name) => {
    try {
      const existing = await AsyncStorage.getItem('history');
      const arr = existing ? JSON.parse(existing) : [];
      const newEntry = {
        password: pw,
        appName: name,
        timestamp: Date.now(),
      };
      arr.unshift(newEntry);
      await AsyncStorage.setItem('history', JSON.stringify(arr));
    } catch (e) {
      console.warn('could not save password', e);
    }
  };

  const handleGenerate = () => {
    const pw = makePassword();
    setPassword(pw);
  };

  const handleCopy = () => {
    if (password) {
      Clipboard.setStringAsync(password);
      Alert.alert('Copiado', 'Senha copiada para a área de transferência');
    }
  };

  const handleSave = () => {
    if (password) {
      setModalVisible(true);
      setAppName('');
    } else {
      Alert.alert('Atenção', 'Gere uma senha primeiro');
    }
  };

  const handleCreate = () => {
    if (appName.trim() === '') {
      Alert.alert('Atenção', 'Informe o nome do aplicativo');
      return;
    }
    savePassword(password, appName);
    setModalVisible(false);
    Alert.alert('Salvo', 'Senha salva com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GERADOR DE SENHA</Text>
      <Image style={styles.image} source={require('./pass.png')} />

      <View style={styles.codeArea}>
        <Text selectable style={styles.codeText}>{password || '--------'}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={[styles.button, styles.generateButton]} onPress={handleGenerate}>
          <Text style={styles.buttonText}>GERAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.copyButton]} onPress={handleCopy}>
          <Text style={styles.buttonText}>COPIAR</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>SALVAR</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => navigation.navigate('History')}>
        <Text style={styles.linkText}>Ver Senhas</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cadastro de Senhas</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={password}
              editable={false}
              placeholder="Senha gerada"
            />
            <TextInput
              style={styles.input}
              placeholder="Nome do aplicativo (ex: Facebook)"
              value={appName}
              onChangeText={setAppName}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButtonCreate, appName.trim() === '' && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={appName.trim() === ''}
              >
                <Text style={styles.modalButtonText}>Criar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#0057D9',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  codeArea: {
    width: '100%',
    minHeight: 60,
    backgroundColor: '#4DB5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 6,
  },
  generateButton: {
    backgroundColor: '#1976D2',
  },
  copyButton: {
    backgroundColor: '#1976D2',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0057D9',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButtonCancel: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCreate: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#4CAF50',
  },
});