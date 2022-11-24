import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Linking, TouchableOpacity, Image, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input'

const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'


export default function PhoneNumber(props) {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [authToken, setAuthToken] = useState(null);
    const [authentication, setAuthentication] = useState(1);
    const [confirm, setConfirm] = useState(null);
    const [convers, setConverse] = useState('Write your phone number above')


    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                // Obviously, you can add more statements here, 
                //       e.g. call an action creator if you use Redux. 

                // navigate the user away from the login screens: 
                console.log(user)
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
        setConverse("Sending Verification code .. ")
        console.log("trying to sing in")
        phoneNumber = "+91" + phoneNumber
        console.log(phoneNumber)
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            alert(error);
        }

        setConverse("Write your phone number above")
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
                <SafeAreaView>

                    <TextInput
                        onChangeText={code => { setAuthToken(code) }}
                        placeholder="code ? ">

                    </TextInput>
                    <Button title="verify otp" onPress={async () => {
                        await confirmVerificationCode(authToken)
                    }} />
                </SafeAreaView>
            </>
        )
    }
    else {
        return (


            <>
                <SafeAreaView style={{
                    backgroundColor: 'white',
                    height: '100%'
                }}>
                    <ScrollView>
                        <View style={styles.phoneSpace}>

                            <Image source={require('../resources/images/otp_image.jpeg')} style={{
                                borderTopRightRadius: 20,
                                height: 350,
                                width: 750,
                                marginLeft: 30,
                                borderWidth: 1,
                            }} />

                            <View style={{
                                alignItems: 'center'
                            }}>

                                <Text style={{
                                    fontSize: 50,
                                    color: 'black',
                                    marginLeft: 10,
                                    transform: [{ translateY: -60 }]
                                }}>
                                    <Text style={{
                                        color: 'tomato'
                                    }}>P</Text>hone <Text style={{
                                        color: 'tomato'
                                    }}>N</Text>umber?
                                </Text>

                                <Text style={{
                                    fontSize: 15,
                                    transform: [{ translateY: -50 }]
                                }}>
                                    Uh, Can we have your phone number ?
                                </Text>
                            </View>

                            <OTPInputView
                                style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center', transform: [{ translateY: -90 }] }}
                                pinCount={10}
                                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                onCodeChanged={code => { setPhoneNumber(code) }}
                                autoFocusOnLoad
                                codeInputFieldStyle={styles.underlineStyleBase}
                                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                onCodeFilled={async (code) => {
                                    console.log(`Code is ${code}, you are good to go!`)
                                    await signIn(code)
                                }}
                            />

                            <Text style={{
                                fontSize: 15,
                                transform: [{ translateY: -100 }],
                                color: 'red'
                            }}>
                                {convers}
                            </Text>


                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        )

    }


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    phoneSpace: {
        justifyContent: "center",
        alignItems: 'center',
        margin: '5%'
    },

    phoneSpaceD: {
        justifyContent: "center",
        alignItems: 'center',
        margin: '15%',
        opacity: 0.4
    },

    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        height: 50,
        width: 200,
        borderRadius: 8,
        borderColor: 'tomato',
        margin: 20,
        backgroundColor: 'white',
    },


    buttonTextLocation: {
        color: 'tomato'
    },

    input: {
        borderBottomWidth: 1,
        borderColor: 'tomato',
        width: 300,
        marginVertical: 30,
        fontSize: 25,
        padding: 10,
        borderRadius: 8,
    },


    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: "gray",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 2,
        color: 'black'
    },

    underlineStyleHighLighted: {
        borderColor: "tomato",
    },
});