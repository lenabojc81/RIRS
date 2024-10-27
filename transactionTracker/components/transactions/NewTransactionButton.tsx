import React from "react";
import { Pressable, StyleSheet, Touchable, TouchableOpacity, useColorScheme } from "react-native";
import { Text, View } from "@/components/Themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router/build/useNavigation";
import { Link } from "expo-router";

export default function NewTransactionButton() {
    const colorScheme = useColorScheme();
    const color = Colors[colorScheme ?? 'light'].tint;

    return (
        <View style={styles.container}>
            <Link href="/newTransaction" asChild >
                <Pressable>
                    <AntDesign size={50} name="pluscircle" color={color} />
                </Pressable>
            </Link>
            {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
});