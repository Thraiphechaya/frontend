import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // ✅ ตรวจสอบว่ามี Token หรือไม่ ถ้ามีให้ไปหน้า Home
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Token in AsyncStorage:", token);
        if (token) {
          navigation.replace('Home'); // ไปหน้า Home อัตโนมัติ
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    checkLoginStatus();
  }, []);

  // ✅ ฟังก์ชันสมัครสมาชิก
  const handleRegister = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      console.log("Registering with:", { email, password, name, phone });

      const response = await axios.post('http://10.0.2.2:8000/api/register', {
        email,
        password,
        name,
        phone,
      });

      console.log("API Response:", response.data);

      if (response.status === 200 && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert("Success", "สมัครสมาชิกสำเร็จ!");
        navigation.replace('Login'); // ไปหน้า Home
      } else {
        Alert.alert("Register Failed", response.data.message || "No token received");
      }
    } catch (error) {
      console.error("Register Error:", error);
      Alert.alert("Network Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CD853F',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CD853F',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#CD853F',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
