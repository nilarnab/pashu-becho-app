import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'


export default function PhoneNumber(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [authentication, setAuthentication] = useState(1);


    const fetch_session = async () => {

        console.log("session checking")

        var user_id = await AsyncStorage.getItem('user_phone')

        console.log(user_id)

        if (user_id != null) {
            console.log('navigating to main page')
            props.navigation.navigate('Main')
        }
        else {
            console.log("staying in the screen")
        }
    }


    useEffect(() => {

        console.log("fetching")
        console.log(props)
        fetch_session()
    }, [])

    const handleAuth = async (props) => {
        console.log("waiting for auth");
        const resp_raw = await fetch(`https://desolate-gorge-42271.herokuapp.com/phoneVerify?phone_num=+91${phoneNumber}`, { method: 'GET' })
        var resp = await resp_raw.json()
        console.log("response 1")
        console.log(resp.token)
        setAuthToken(resp.token)
        setAuthentication(2)
        // await requestOtp(phoneNumber)
        const resp2 = await fetch(`https://desolate-gorge-42271.herokuapp.com/phoneVerify/waitAuth?token=${resp.token}`, { method: 'GET' })
        var response = await resp2.json()
        console.log("response 2")
        console.log(response)
        if (response.verdict) {

            // setting up session
            console.log('setting up session')
            console.log('phone_num', phoneNumber)
            const resp = await fetch(BASE_URL + `userInfo/get_by_phone?phone_num=${phoneNumber}`, { method: 'POST' })
            var data_raw = await resp.json();

            console.log(data_raw)
            var user_id = data_raw.user[0]._id
            var user_email = data_raw.user[0].email
            var user_phone = phoneNumber

            console.log(user_id)
            console.log(user_email)
            console.log(user_phone)

            await AsyncStorage.setItem('user_id', user_id)
            await AsyncStorage.setItem('user_email', user_email)
            await AsyncStorage.setItem('user_phone', user_phone)

            console.log("session is set")

            // navigating to main page
            console.log("navigating to next page")
            props.navigation.navigate('Main')


        }
        else {
            setAuthentication(1)
        }
    }

    if (authentication == 2)
        return <WebView source={{ uri: `http://www.buybold.ml/register?token=${authToken}&phone=${phoneNumber}` }}></WebView>
    else if (authentication == 1) {

        return <View style={styles.screen}>
            <Text style={styles.text}>Enter Phone Number</Text>
            <TextInput
                autoFocus
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="10 digit Mobile Number"
            />
            <Button title="LogIn" onPress={async () => {
                if (phoneNumber.length == 10) {

                    await handleAuth(props);
                }
                else { alert(phoneNumber + "is not a valid number") }
            }} />
            <Text style={{ color: "red", marginTop: 100 }}></Text>

        </View>
    }

    else if (authentication === 3) {
        props.navigation.navigate('Main')
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 2,
        borderColor: 'lightblue',
        width: 300,
        marginVertical: 30,
        fontSize: 25,
        padding: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 25,
    },
});