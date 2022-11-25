import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'


export default function PhoneNumber(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [confirm, setConfirm] = useState(null);


    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {

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
            // props.navigation.navigate('Main')

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

