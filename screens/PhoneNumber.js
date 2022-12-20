import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_URL } from '../env'


export default function PhoneNumber(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [confirm, setConfirm] = useState(null);


    const startSession = async (uid, phone) => {
        // make  a new session with uid and phonenumber
        console.log("starting session")

        // call the server 
        const resp = await fetch(BASE_URL + `sessionManage/create?uuid=${uid}&phone_num=${phone}`, { method: 'POST' })
        var resp_json = await resp.json();

        console.log(resp_json)
        console.log("session started")

        return resp_json.user
    }


    const addUserToCache = async (uid, user) => {

        // adding user to cache
        console.log("adding data to cache")
        console.log(user)
        // initialization
        var name = user.name
        var email = user.email
        var uuid = uid
        var user_id = user._id.toString()

        if (!name) name = ''
        if (!email) email = ''

        // adding pairs in async storage
        await AsyncStorage.setItem('name', name)
        await AsyncStorage.setItem('phone', phoneNumber)
        await AsyncStorage.setItem('uuid', uuid)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('user_id', user_id)

        console.log("added in cache")

    }

    useEffect(async () => {

        // check if user is already logged in
        var user = auth()._user

        if (user) {
            console.log("user already logged in")
            console.log(user)
            var uid = user.uid
            var phone = user.phoneNumber
            console.log("starting session with", uid, phone)

            // now suppposed to start a new session in mongo db
            var user_data = await startSession(uid, phone)

            // now populate cache storage 
            await addUserToCache(uid, user_data)

            // complete
            props.navigation.navigate("Main");

        }

        auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log("user state changed to logged in")
                uid = user.uid
                phone = user.phoneNumber
                console.log("starting session with", uid, phone)

                // now suppposed to start a new session in mongo db
                var user_data = await startSession(uid, phone)

                // now populate cache storage 
                await addUserToCache(uid, user_data)

                // complete
                props.navigation.navigate("Main");
            }
            else {
                // reset state if you need to  
                console.log("not logged int")
                // dispatch({ type: "reset_user" });
            }
        });
    }, []);




    async function signIn(phoneNumber) {
        // setConverse("Sending Verification code .. ")
        console.log("trying to sing in")
        // phoneNumber = "+91" + phoneNumber
        console.log(phoneNumber)
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            alert(error);
        }
    }

    async function confirmVerificationCode(code) {

        try {
            await confirm.confirm(code);
            console.log("auth complete")
            props.navigation.navigate('Main')

        } catch (error) {
            setConfirm(null);
            alert(error);
        }
    }

    if (confirm) {


        return (
            <>
                <View>
                    <TextInput
                        onChangeText={(text) => { setAuthToken(text) }}
                        placeholder="Otp">
                    </TextInput>
                    <Button title='send otp' onPress={async () => {
                        await confirmVerificationCode(authToken)
                    }}></Button>
                </View>
            </>
        )
    }
    else {
        return (
            <>
                <View>
                    <TextInput
                        onChangeText={(text) => { setPhoneNumber(text) }}
                        placeholder="Phone number">
                    </TextInput>
                    <Button title='send otp' onPress={async () => {
                        await signIn(phoneNumber)
                    }}></Button>
                </View>

            </>

        )

    }


}

