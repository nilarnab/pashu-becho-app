import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, Touchable, TouchableOpacity, Image, } from 'react-native';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import { FaHeart } from "react-icons/fa";
import Icon from "react-native-vector-icons/Ionicons";

const Header = ({ setState, State }) => {

    const [sideState, setSideState] = useState(0)

    const handleSideBar = () => {

    }


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
        height: 50,
        backgroundColor: '#ffff',
        elevation: 2,
        flexDirection: 'row'
    },

    left_icons: {
        width: 80,
        height: '100%',
        padding: 15
    },

    right_icons:
    {
        width: 80,
        height: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        right: 0
    }

})

export default Header;