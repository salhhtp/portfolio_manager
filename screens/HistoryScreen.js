import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button } from 'react-native-paper';
import PortfolioService from '../services/PortfolioService';

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await PortfolioService.getHistory();
            setHistory(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.header}>Portfolio History</Title>
            {loading && <ActivityIndicator animating size="large" style={{ marginVertical: 20 }} />}
            {history.length === 0 && !loading && (
                <Paragraph style={styles.noHistory}>No historical data available.</Paragraph>
            )}
            {history.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Content>
                        <Title>{item.title || `Record #${index + 1}`}</Title>
                        <Paragraph>Tickers: {item.tickers?.join(', ')}</Paragraph>
                        <Paragraph>Period: {item.period}</Paragraph>
                        <Paragraph>Recommendation: {JSON.stringify(item.recommendation)}</Paragraph>
                    </Card.Content>
                </Card>
            ))}
            <Button mode="contained" onPress={fetchHistory} style={styles.button}>
                Refresh History
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        flexGrow: 1
    },
    header: {
        textAlign: 'center',
        marginVertical: 20,
        color: '#fff'
    },
    card: {
        backgroundColor: '#2c2c2c',
        marginVertical: 10,
        borderRadius: 8
    },
    noHistory: {
        color: '#ccc',
        textAlign: 'center',
        marginVertical: 20
    },
    button: {
        marginVertical: 20,
        borderRadius: 8
    }
});
