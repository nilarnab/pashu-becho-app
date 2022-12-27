import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, Touchable, TouchableOpacity, Image, } from 'react-native';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import { FaHeart } from "react-icons/fa";
import Icon from "react-native-vector-icons/Ionicons";
import { BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const SideBar = (props) => {

    return (
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Side bar</Text>
            <TouchableOpacity onPress={async () => {

                console.log("logging out")

                await AsyncStorage.removeItem('name')
                await AsyncStorage.removeItem('phone')
                await AsyncStorage.removeItem('uuid')
                await AsyncStorage.removeItem('email')
                await AsyncStorage.removeItem('user_id')

                await auth().signOut()

                props.navigation.navigate('Phone')

            }} style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', color: 'white' }}>
                <Text style={{ color: 'white' }}>Logout</Text>
            </TouchableOpacity>

        </View>
    )
}