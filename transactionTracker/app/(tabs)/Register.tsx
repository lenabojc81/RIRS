import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigation = useNavigation();

  const validateFields = (): boolean => {
    if (!username) {
      setMessage('Username is required.');
      return false;
    }
    if (!email) {
      setMessage('Email is required.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setMessage('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      const response = await register(email, password, username);
      if (response && response.email) {
        setMessage(`User registered: ${response.email}`);
        setEmail('');
        setPassword('');
        setUsername('');
        navigation.navigate('Login');
      } else {
        setMessage('Registration failed: Invalid response structure.');
      }
    } catch (error) {
      setMessage(`Registration error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Uporabniško ime"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
      <Button title="Registracija" onPress={handleRegister} />
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

export default Register;
