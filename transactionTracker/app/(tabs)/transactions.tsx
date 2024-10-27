import { SafeAreaView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import React from "react";
import TransactionList from "@/components/transactions/TransactionList";
import NewTransactionButton from "@/components/transactions/NewTransactionButton";

export default function TransactionsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <TransactionList />
            <View style={styles.buttonContainer}>
                <NewTransactionButton />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
         flex: 1,
        //  alignItems: 'center',
        //  justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    buttonContainer: {
         position: 'absolute',
         bottom: 25,
         alignSelf: 'center',
    },
});