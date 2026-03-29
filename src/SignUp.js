
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './components/CustomAlert';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente e verifique se as senhas coincidem.');
      return;
    }

    try {
      
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      if (users.some(user => user.email === email)) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      showAlert('Cadastro realizado com sucesso!');

      setTimeout(() => {
        navigation.navigate('SignIn', { email });
      }, 1500);
    } catch (error) {
      console.warn('Erro ao salvar usuário', error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onHide={() => setAlertVisible(false)}
      />
      <Text style={styles.title}>SIGN UP</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>REGISTRAR</Text>
      </Pressable>
      <Pressable style={styles.backLink} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.backLinkText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0057D9',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#61d7ec',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 20,
  },
  backLinkText: {
    fontSize: 14,
    color: '#0057D9',
    textDecorationLine: 'underline',
  },
});