import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, } from 'react-native';


const Header = ({ navigation }) => {

    const handleSideBar = () => {

    }

    console.log(navigation)

    return (
        <>
            <View style={styles.containter}>

                <View style={styles.left_icons}>

                </View>

                <View style={styles.right_icons}>

                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({

    containter: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffff',
        elevation: 2,
        flexDirection: 'row'
    },

    left_icons: {
        width: 80,
        height: '100%',
        backgroundColor: 'tomato'
    },

    right_icons:
    {
        width: 80,
        height: '100%',
        backgroundColor: 'green',
        position: 'absolute',
        right: 0
    }

})

export default Header;