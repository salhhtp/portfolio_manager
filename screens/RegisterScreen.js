import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import AuthService from '../services/AuthService';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await AuthService.registerUser(username, password);
            Alert.alert('Success', 'User registered! You can now login.');
            navigation.goBack(); // Return to Login
        } catch (error) {
            Alert.alert('Registration Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Register</Title>
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
            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Register
            </Button>
            <Button mode="text" onPress={() => navigation.goBack()}>
                Already have an account? Login
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
