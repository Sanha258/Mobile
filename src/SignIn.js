import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './components/CustomAlert';

export default function SignIn({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  React.useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      const usersJson = await AsyncStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        showAlert('SignIn realizado com sucesso!');
        setTimeout(() => {
          navigation.replace('Home');
        }, 1500);
      } else {
        Alert.alert('Erro', 'E-mail ou senha inválidos.');
      }
    } catch (error) {
      console.warn('Erro ao buscar usuários', error);
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onHide={() => setAlertVisible(false)}
      />
      <Text style={styles.title}>SIGN IN</Text>
      <View style={styles.inputContainer}>
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
      </View>
      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>ENTRAR</Text>
      </Pressable>
      <View style={styles.signupLink}>
        <Text style={styles.signupText}>Não tem uma conta? </Text>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLinkText}>Crie agora</Text>
        </Pressable>
      </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0057D9',
    marginBottom: 40,
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
  signupLink: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#333333',
  },
  signupLinkText: {
    fontSize: 14,
    color: '#0057D9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});