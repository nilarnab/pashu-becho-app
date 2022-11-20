import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import Geolocation from 'react-native-geolocation-service';
import MapView from "react-native-maps";


export const Location = (props) => {

    state = {
        location: null
    };

    const findCoordinates = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
            },
            (error) => {
                console.error(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    async function requestPermissions() {

        console.log("requesting permission")
        if (Platform.OS === 'ios') {
            const auth = await Geolocation.requestAuthorization('whenInUse');
            if (auth === 'granted') {
                findCoordinates();
            }
        }

        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            console.log(granted)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                findCoordinates();
            }
        }
    }


    return (
        <>
            <SafeAreaView>
                <Text>This is supposed to be the location page</Text>
                <TouchableOpacity onPress={requestPermissions}>
                    <Text>Find My Coords?</Text>
                    <Text>Location: {state.location}</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        height: '100%',
        width: '100%'
    },
});

