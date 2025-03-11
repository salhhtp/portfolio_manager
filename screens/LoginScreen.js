import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import AuthService from '../services/AuthService';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const token = await AuthService.login(username, password);
            if (token) {
                navigation.replace('Home'); // Move to Home screen
            }
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Login</Title>
            <TextInput
                mode="outlined"
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff'
    },
    input: {
        marginVertical: 10,
        backgroundColor: '#333'
    },
    button: {
        marginVertical: 20,
        borderRadius: 8,
    }
});
