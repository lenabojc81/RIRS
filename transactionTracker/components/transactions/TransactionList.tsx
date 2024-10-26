import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { ITransaction } from "@/interfaces/ITransaction";
import { baseURL } from "@/global";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TransactionsScreen() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setRefreshing(true);
            const response = await fetch(`${baseURL}/transaction/getTransactions`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
                //console.log(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    const renderTransaction = ({ item }: { item: ITransaction }) => (
        <View style={styles.transactionItem}>
            {item.expense ? (<AntDesign size={50} name="downcircleo" color={Colors.light.pastelRed} />) : (<AntDesign size={50} name="upcircleo" color={Colors.light.pastelGreen} />)}
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionName}>{item.name}</Text>
                <Text style={styles.transactionAmount}>€{item.amount.toFixed(2)}</Text>
            </View>
            <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Transaction List</Text> */}
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id || Math.random().toString()} // Assuming each transaction has a unique `_id` field
                renderItem={renderTransaction}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing}
                        onRefresh={fetchTransactions}
                        tintColor={Colors.light.tint}
                    />
                }
            />            
            {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 70,
        // marginTop: 70,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#cccccc',
    },
    icon: {
        marginHorizontal: 10,
    },
    transactionDetails: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#cccccc',
    },
    transactionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    transactionAmount: {
        fontSize: 16,
        color: Colors.light.text,
        marginHorizontal: 10,
    },
    transactionDate: {
        fontSize: 14,
        color: Colors.light.secondaryText,
        marginLeft: 10,
    },
});