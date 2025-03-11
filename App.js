import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

// Custom dark theme for Paper
const theme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0066cc',
        accent: '#00bcd4',
        background: '#1e1e1e',
        surface: '#2c2c2c',
        text: '#ffffff',
        placeholder: '#aaa',
        disabled: '#555',
    },
};

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Investment Portfolio' }} />
                    <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Portfolio History' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
