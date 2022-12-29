import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, Image, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, TouchableOpacity, } from 'react-native';
import { BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';





const SideBar = ({ props, setState }) => {

    return (
        <>
            <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white', height: '100%' }}>

                {/* <Image source={{ uri: 'https://images.pexels.com/photos/3776166/pexels-photo-3776166.jpeg?auto=compress&cs=tinysrgb&w=800' }} style={{ width: '100%', height: 200 }} /> */}

                <View style={{ marginTop: 20 }}>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={async () => {
                            setState(0)
                            props.navigate('Home')
                        }} style={styles.tabTab}>
                            <Text style={styles.tabTextStyle}>Move to Home</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={async () => {
                            setState(0)
                            props.navigate('Profile')
                        }} style={styles.tabTab}>
                            <Text style={styles.tabTextStyle}>See Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={async () => {
                            setState(0)
                            props.navigate('Cart')
                        }} style={styles.tabTab}>
                            <Text style={styles.tabTextStyle}>Visit Cart Items</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={async () => {
                            setState(0)
                            props.navigate('OldOrderStatus')
                        }} style={styles.tabTab}>
                            <Text style={styles.tabTextStyle}>See Old Orders</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={async () => {
                            setState(0)
                            await AsyncStorage.removeItem('name')
                            await AsyncStorage.removeItem('phone')
                            await AsyncStorage.removeItem('uuid')
                            await AsyncStorage.removeItem('email')
                            await AsyncStorage.removeItem('user_id')

                            if (auth().currentUser) {
                                await auth().signOut()
                            }

                            props.navigate('Phone')

                        }} style={
                            styles.tabTab
                        }>
                            <Text style={{
                                color: 'red',
                                textAlign: 'center',
                                width: 100,
                            }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        width: 200,
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    tabTab:
    {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabTextStyle: {
        color: 'grey',
        textAlign: 'center',
        width: 100,
    }

})



export default SideBar