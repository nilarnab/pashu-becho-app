import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, Touchable, TouchableOpacity, Image, } from 'react-native';

import { BASE_URL } from '../env';




const Header = ({ setState, State }) => {

    const BurgerIcon = () => {

        if (State == 0) {

            return (
                <>
                    <Image source={{ uri: "https://img.icons8.com/material/24/null/menu--v1.png" }} style={{ height: 20, width: 20 }}></Image>
                </>
            )
        }
        else {
            return (
                <Image source={{ uri: "https://img.icons8.com/material/24/null/arrow-pointing-left--v2.png" }} style={{ height: 20, width: 20 }}></Image>
            )
        }
    }

    console.log(setState)

    return (
        <>
            <View style={styles.containter}>

                <View style={styles.left_icons}>
                    <TouchableOpacity
                        onPress={() => {
                            if (State == 0) {
                                setState(1)
                            }
                            else {
                                setState(0)
                            }
                        }}>
                        <BurgerIcon />
                    </TouchableOpacity>

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
        height: 60,
        backgroundColor: '#ffff',
        elevation: 2,
        flexDirection: 'row'
    },

    left_icons: {
        width: 80,
        height: '100%',
        padding: 20
    },

    right_icons:
    {
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        right: 0,
    },

    //----------------
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        padding: 20,
        borderRadius: 100,
        backgroundColor: 'white',
    },

    input: {
        marginBottom: 1,
        fontSize: 15,
        color: "black",
        width: '80%',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10
    },

    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: '90%',
        marginLeft: '5%',
        marginTop: 10,
    },

})

export default Header;