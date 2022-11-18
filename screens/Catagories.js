
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";

const data = [
    {
        'title': 'trimmer'
    },
    {
        'title': 'catagory2'
    },
    {
        'title': 'catagory2'
    },

]

const CatagoryItem = ({ item }) => {
    return (
        <>
            <View style={styles.catItem}>
                <Text>{item.title}</Text>
            </View>
        </>
    )
}


const Catagories = () => {
    return (
        <FlatList
            horizontal
            data={data}
            renderItem={CatagoryItem}
            initialNumToRender={1}
            // TODO: Fix in production
            keyExtractor={item => Math.random()}

        />
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