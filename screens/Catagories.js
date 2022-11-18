
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";

const Catagories = () => {
    return (
        <View style={styles.catContainer}>
            <View style={styles.catItem}>
                <Text>Catagory 1</Text>
            </View>
            <View style={styles.catItem}>
                <Text>Catagory 2</Text>
            </View>
            <View style={styles.catItem}>
                <Text>Catagory 3</Text>
            </View>
            <View style={styles.catItem}>
                <Text>Catagory 4</Text>
            </View>
            <View style={styles.catItem}>
                <Text>Catagory 5</Text>
            </View>
            <View style={styles.catItem}>
                <Text>Catagory 6</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    catContainer: {
        height: 'auto',
        flex: 1,
        flexDirection: "row",
        marginHorizontal: "auto",
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    catItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        height: 120,
        width: 120,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        margin: 2

    },
})

export default Catagories