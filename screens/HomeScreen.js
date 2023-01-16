import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, Image, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, TouchableOpacity, ImageBackground, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Header from './UniversalHeader';
import { BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useIsFocused } from '@react-navigation/native'
import SideBar from '../SideBar';


export const HomeScreen = (props) => {
    const [products, setProducts] = useState([])

    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    const [SideMenu, setSideMenu] = useState(0)
    const [mainWidth, setMainWidth] = useState('100%')
    const fadeAnim = useRef(new Animated.Value(0)).current

    const [sideWidth, setSideWidth] = useState('0%')

    const [hideHeader, setHideHeader] = useState(false);
    const [ignoreSearch, setIgnoreSearch] = useState(false);
    const [catagorySearchProducts, setCatagorySearchProducts] = useState([]);

    const isFocused = useIsFocused()

    useEffect(() => {

        if (SideMenu == 1) {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 200,
                    duration: 1000,
                    useNativeDriver: false
                }
            ).start();
        }
        else {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false
                }
            ).start();
        }
    }, [SideMenu])

    useEffect(() => {

        const sendPagePopularityMetric = async () => {

            if (isFocused) {
                var userId = await AsyncStorage.getItem('user_id')
                fetch(BASE_URL + `monitor/send_metric?metric=PAGE_ENGAGEMENT&pagename=HOME&userid=${userId}`, { method: 'GET' })
            }

        }

        // sendPagePopularityMetric()

    }, [isFocused])


    componentDidMount = () => {
        console.log("component did mount")
    }


    const Home = (props) => {


        return (
            <>
                <View>
                    <ImageBackground
                        // source={{ uri: '' }}
                        resizeMode="stretch"
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Header setState={setSideMenu} State={SideMenu} hideHeader={hideHeader} setHideHeader={setHideHeader} setProducts={setProducts} setIgnoreSearch={setIgnoreSearch} />

                        <InfiniteList
                            list={products}
                            hideHeader={hideHeader}
                            setHideHeader={setHideHeader}
                            setProducts={setProducts}
                            setIgnoreSearch={setIgnoreSearch}
                            ignoreSearch={ignoreSearch}
                            catagorySearchProducts={catagorySearchProducts}
                            setCatagorySearchProducts={setCatagorySearchProducts}
                            navigation={props.props.navigation}
                        />
                    </ImageBackground>
                </View>
            </>
        )
    }



    return (

        <View style={styles.containter}>
            <Animated.View style={{
                width: fadeAnim,
                height: '100%',
                backgroundColor: 'rgb(240, 240, 245)',
            }}>
                <SideBar props={props.navigation} setState={setSideMenu} />
            </Animated.View>

            <View style={{
                width: mainWidth,
                height: '100%',
                backgroundColor: 'white',
                elevation: 1
            }}>
                <Home props={props} />
            </View>

        </View>
        /* <SideBar />
                <Home props={props} /> */
    );

}

const styles = StyleSheet.create({

    //--------------

    containter: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffff',
        elevation: 2,
        flexDirection: 'row'
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
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginRight: 10
    },
    button:
    {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 3,
        height: 40,
        width: 30,
        // backgroundColor: 'white',
        elevation: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        borderRadius: 8
    },
    container: {
        backgroundColor: '#fff',
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
    slider: {
    },
    input: {
        borderWidth: 0,
        borderBottomColor: '#e1e3e1',
        borderBottomWidth: 1,
        marginBottom: 1,
        fontSize: 15,
        color: "black",
        width: '80%',
        padding: 10,
        borderRadius: 8,
    },

    navigation: {
        backgroundColor: 'tomato'
    }
});