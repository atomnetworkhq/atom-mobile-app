import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../App';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(AuthContext);
  
    const handleLogin = async () => {
      try {
        const response = await fetch('http://atom.atomnetwork.xyz:3000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          signIn(data.token);
        } else {
          Alert.alert('Error', data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'An error occurred during login');
      }
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 40,
      backgroundColor: '#333',
      color: '#fff',
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    linkText: {
      color: '#007AFF',
      marginTop: 15,
    },
  });
