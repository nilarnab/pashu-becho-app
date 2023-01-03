import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

import { BASE_URL } from '../env'
import { APP_NAME } from '../env';


export default function PhoneNumber(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMesssage, setErrorMessage] = useState(null);

    // Handle user state changes
    async function onAuthStateChanged(user) {
        if (user) {
            // console.log("user state changed to logged in")
            uid = user.uid
            phone = user.phoneNumber
            // console.log("starting session with", uid, phone)

            // now suppposed to start a new session in mongo db
            var user_data = await startSession(uid, phone)

            // now populate cache storage 
            await addUserToCache(uid, user_data)

            // complete
            props.navigation.navigate("Main");
        }
        else {
            // reset state if you need to  
            // console.log("not logged int")
            // dispatch({ type: "reset_user" });
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    const startSession = async (uid, phone) => {
        // make  a new session with uid and phonenumber
        // console.log("starting session")

        // call the server 
        const resp = await fetch(BASE_URL + `sessionManage/create?uuid=${uid}&phone_num=${phone}`, { method: 'POST' })
        var resp_json = await resp.json();

        // console.log(resp_json)
        // console.log("session started")

        return resp_json.user
    }


    const addUserToCache = async (uid, user) => {

        // adding user to cache
        // console.log("adding data to cache")
        // console.log(user)
        // console.log(uid)
        // initialization
        var name = user.name
        var email = user.email
        var uuid = uid
        var user_id = user._id

        if (!name) name = ''
        if (!email) email = ''

        // adding pairs in async storage
        await AsyncStorage.setItem('name', name)
        await AsyncStorage.setItem('phone', phoneNumber)
        await AsyncStorage.setItem('uuid', uuid)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('user_id', user_id)

        // console.log("added in cache")

    }

    async function signIn(phoneNumber) {
        // setConverse("Sending Verification code .. ")
        // console.log("trying to sing in")
        // phoneNumber = "+91" + phoneNumber
        console.log(phoneNumber, phoneNumber.length)
        try {

            if (phoneNumber.length != 13) {
                setErrorMessage("Uh, phone number should be 10 digits long")
            }
            else {
                const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
                setConfirm(confirmation);
            }
        } catch (error) {
            alert(error);
        }
    }

    async function confirmVerificationCode() {


        // first see if already logged in
        var user = auth().currentUser
        if (user) {
            // console.log("explicit check, already logged in")
            await onAuthStateChanged(user)
            props.navigation.navigate('Main')
        }
        else {
            try {
                // console.log("user not logged in, trying")
                await confirm.confirm(authToken);
                // console.log("auth complete")
                props.navigation.navigate('Main')

            } catch (error) {
                setConfirm(null);
                alert(error);
            }

        }

    }

    const Loader = () => {
        if (loading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Bars size={25} color="green" />
                </View>
            )
        }
        else {
            return (
                <>

                </>
            )
        }
    }


    if (confirm) {


        return (
            <>
                <View style={{ alignItems: 'center', marginTop: '10%' }}>

                    <TextInput
                        onChangeText={(text) => { setAuthToken(text) }}
                        placeholder="Otp"
                        autoComplete="sms-otp" // android
                        textContentType="oneTimeCode" // ios
                        placeholderTextColor="gray"
                        style={{ color: 'black', borderBottomColor: 'gray', borderBottomWidth: 1, width: '40%' }}>
                    </TextInput>
                    <Loader />
                    <Button title='send otp' onPress={async () => {
                        setLoading(true)
                        await confirmVerificationCode(authToken)
                        setLoading(false)
                    }}></Button>
                </View>
            </>
        )
    }
    else {
        return (
            <SafeAreaView style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
                <View style={{ alignItems: 'center', marginTop: '20%', }}>

                    <Text style={{ fontSize: 30, color: 'grey' }}>Hey, watcha doing !</Text>


                    <Text style={{ fontSize: 40, marginVertical: 30, fontWeight: 'bold', color: 'grey' }}>Welcome to {APP_NAME}</Text>

                    <Loader />

                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'grey' }}>Enter Phone Number</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>+91</Text>
                        <TextInput
                            onChangeText={(text) => { setPhoneNumber('+91' + text) }}
                            placeholder=""
                            placeholderTextColor="gray"
                            autoComplete="tel" // android
                            textContentType="telephoneNumber" // ios
                            keyboardType="phone-pad"
                            style={{
                                color: 'black',
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                                width: '60%',
                                textContentType: 'telephoneNumber',
                                marginLeft: 10,
                                fontSize: 20,
                            }}>
                        </TextInput>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity onPress={async () => {
                            setLoading(true)
                            await signIn(phoneNumber)
                            setLoading(false)
                        }} style={{
                            marginTop: 10,
                            marignHorizontal: 20,
                            backgroundColor: 'white',
                            color: 'green',
                            borderRadius: 10,
                            padding: 10,
                            width: '100%',
                            borderColor: 'green',
                            borderWidth: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ color: 'green', fontSize: 20 }}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 15, color: 'red' }}>{errorMesssage}</Text>
                    </View>
                </View>

            </SafeAreaView>

        )

    }


}

