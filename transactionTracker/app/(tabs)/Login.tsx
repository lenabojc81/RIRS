import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigation = useNavigation();

  const validateFields = (): boolean => {
    if (!email) {
      setMessage('Email je obvezen.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setMessage('Vpiši veljaven email.');
      return false;
    }
    if (!password) {
      setMessage('Geslo je obvezno.');
      return false;
    }
    if (password.length < 6) {
      setMessage('Geslo mora biti dolgo vsaj 6 znakov.');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setMessage('Geslo mora vsebovati vsaj eno veliko začetnico, eno malo, eno številko in en poseben znak.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await login(email, password);
      if (response && response.email) {
        setMessage(`User logged in: ${response.email}`);
        setEmail('');
        setPassword('');
        
      } else {
        setMessage('Login failed: Invalid response structure.');
      }
    } catch (error) {
      setMessage(`Login error: ${(error as any).message}`);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Geslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Prijava" onPress={handleLogin} />
      <Button title="Še nimaš uporabniškega računa? Registriraj se" onPress={handleNavigateToRegister} />
      {message ? <Text style={styles.errorText}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
