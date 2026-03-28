import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;

  const handleRegister = () => {
    if (isFormValid) {
      navigation.navigate('SignIn', { email });
    } else {
      Alert.alert('Atenção', 'Preencha todos os campos corretamente e verifique se as senhas coincidem.');
    }
  };

  return (
    <View style={styles.container}>
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