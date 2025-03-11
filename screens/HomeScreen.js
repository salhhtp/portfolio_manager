import React, { useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import PortfolioService from '../services/PortfolioService';

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
    const [tickers, setTickers] = useState('');
    const [period, setPeriod] = useState('1y');
    const [budget, setBudget] = useState(''); // Budget as a string
    const [portfolio, setPortfolio] = useState(null);
    const [projectedProfit, setProjectedProfit] = useState(null);
    const [loading, setLoading] = useState(false);

    const getPortfolio = async () => {
        if (!tickers) {
            Alert.alert('Error', 'Please enter at least one ticker.');
            return;
        }
        setLoading(true);
        try {
            // Convert tickers input into an array
            const tickerArray = tickers.split(',').map(t => t.trim()).filter(t => t);
            if (tickerArray.length === 0) {
                Alert.alert('Error', 'Please enter valid tickers.');
                setLoading(false);
                return;
            }
            // Parse budget as a number; if empty or invalid, default to 0
            const budgetValue = parseFloat(budget) || 0;

            const result = await PortfolioService.getRecommendation(tickerArray, period, budgetValue);
            setPortfolio(result.recommendation);
            setProjectedProfit(result.projected_profit);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderChart = () => {
        if (!portfolio) return null;
        const labels = Object.keys(portfolio);
        const dataValues = labels.map(key => portfolio[key] * 100);
        return (
            <BarChart
                data={{
                    labels: labels,
                    datasets: [{ data: dataValues }]
                }}
                width={screenWidth - 40}
                height={220}
                fromZero={true}
                chartConfig={{
                    backgroundColor: '#1e1e1e',
                    backgroundGradientFrom: '#1e1e1e',
                    backgroundGradientTo: '#1e1e1e',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 153, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
            />
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.header}>Investment Portfolio Recommendation</Title>

            <TextInput
                mode="outlined"
                label="Tickers (e.g., AAPL, MSFT, GOOGL)"
                value={tickers}
                onChangeText={setTickers}
                style={styles.input}
            />

            <Picker
                selectedValue={period}
                style={styles.picker}
                onValueChange={(itemValue) => setPeriod(itemValue)}
            >
                <Picker.Item label="1 Year" value="1y" />
                <Picker.Item label="2 Years" value="2y" />
                <Picker.Item label="5 Years" value="5y" />
            </Picker>

            <TextInput
                mode="outlined"
                label="Budget (USD)"
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={getPortfolio}
                style={styles.button}
                icon="chart-bar"
            >
                Get Recommendation
            </Button>

            {loading && <ActivityIndicator animating={true} size="large" style={{ marginVertical: 20 }} />}

            {portfolio && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.resultHeader}>Recommended Portfolio Allocation</Title>
                        {Object.keys(portfolio).map(ticker => (
                            <Paragraph key={ticker} style={styles.resultText}>
                                {ticker}: {(portfolio[ticker] * 100).toFixed(2)}%
                            </Paragraph>
                        ))}
                        {renderChart()}
                        {projectedProfit !== null && (
                            <Paragraph style={styles.resultText}>
                                Projected Profit: ${projectedProfit.toFixed(2)}
                            </Paragraph>
                        )}
                    </Card.Content>
                </Card>
            )}

            <Button mode="text" onPress={() => navigation.navigate('History')} style={styles.navButton}>
                View Portfolio History
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center'
    },
    header: {
        textAlign: 'center',
        marginVertical: 20,
        color: '#fff'
    },
    input: {
        marginVertical: 10,
        backgroundColor: '#333'
    },
    picker: {
        backgroundColor: '#333',
        color: '#fff',
        marginVertical: 10
    },
    button: {
        marginVertical: 20,
        borderRadius: 8
    },
    card: {
        backgroundColor: '#2c2c2c',
        padding: 10,
        borderRadius: 8
    },
    resultHeader: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#fff'
    },
    resultText: {
        color: '#ccc',
        marginVertical: 4
    },
    navButton: {
        marginTop: 20
    }
});
