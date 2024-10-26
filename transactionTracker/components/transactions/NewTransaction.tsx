import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, Touchable, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { initialTransaction, ITransaction } from "@/interfaces/ITransaction";
import { baseURL } from "@/global";


export default function NewTransaction() {
    const [transaction, setTransaction] = useState<ITransaction>(initialTransaction);

    const colorScheme = useColorScheme();
    const color = Colors[colorScheme ?? 'light'].tint;

    const handleTransactionType = (isExpense: boolean) => {
        setTransaction({ ...transaction, expense: isExpense, date: new Date() });
    };

    const saveTransaction = async () => {
        if (!transaction.name.trim()) {
            Alert.alert('Validation Error', 'Please enter the name of the transaction.');
            return;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid amount greater than 0.');
            return;
        }
        try {
            const response = await fetch(`${baseURL}/transaction/newTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                Alert.alert('Success', 'Transaction saved successfully!');
                setTransaction(initialTransaction);
            } else {
                Alert.alert('Error', 'Failed to save transaction.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while saving the transaction.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name of Transaction</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the name of transaction"
                placeholderTextColor={color}
                value={transaction.name}
                onChangeText={text => setTransaction({ ...transaction, name: text })}
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
                style={styles.input}
                value={Number(transaction.amount).toString()}
                onChangeText={text => {
                    if (/^\d*\.?\d*$/.test(text)) {
                        setTransaction({ ...transaction, amount: Number(text) });
                    }
                }}
            />

            <Text style={styles.label}>Type of Transaction</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={styles.radioButtonContainer}
                    onPress={() => handleTransactionType(false)}
                >
                    <View style={styles.outerCircle}>
                        {!transaction.expense && <View style={styles.innerCircle} />}
                    </View>
                    <Text style={styles.radioText}>Income</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioButtonContainer}
                    onPress={() => handleTransactionType(true)}
                >
                    <View style={styles.outerCircle}>
                        {transaction.expense && <View style={styles.innerCircle} />}
                    </View>
                    <Text style={styles.radioText}>Expense</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => saveTransaction()} style={styles.button}>
                <Text style={styles.buttonText}>Save Transaction</Text>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: 'white',
    },
    radioContainer: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-around',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#007bff',
    },
    radioText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});