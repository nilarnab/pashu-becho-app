import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, Image, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, TouchableOpacity, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Header from './UniversalHeader';
import { BASE_URL } from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


const SearchBar = (props) => {

    const [searchText, setSearchText] = useState("");
    const [hideHeader, setHideHeader] = useState(props.hideHeader)

    console.log("search bar props")
    console.log(props)

    // var searchText = props.searchText
    // var setSearchText = props.setSearchText
    var setProducts = props.setProducts


    const ResetButton = (props) => {
        console.log("reset button props")
        console.log(props)

        if (hideHeader) {

            return (
                <>
                    <TouchableOpacity title='Search' onPress={async () => {
                        console.log(searchText);
                        const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'GET' })
                        const response = (await result.json()).data;
                        setProducts(response);
                        console.log(response);

                        setHideHeader(false)
                        props.setHideHeader(false)

                    }} style={styles.searchButton} ><Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/restart--v2.png" }} style={{ height: 20, width: 20 }} /></TouchableOpacity>

                </>
            )
        }
    }

    return (
        <>
            <TextInput style={styles.input}
                editable
                maxLength={40}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Start Typing to search ..."
                placeholderTextColor="#000"
            />

            <TouchableOpacity title='Search' onPress={async () => {
                console.log(searchText);
                const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'GET' })
                const response = (await result.json()).data;
                setProducts(response);
                console.log(response);
                setHideHeader(true)
                props.setHideHeader(true)

            }} style={styles.searchButton} >

                <Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/search.png" }} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
            <ResetButton setHideHeader={props.setHideHeader} hideHeader={props.hideHeader} />

        </>
    )
}


export const HomeScreen = (props) => {
    const [products, setProducts] = useState([])

    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    const [SideMenu, setSideMenu] = useState(0)
    const [sideWidth, setSideWidth] = useState('0%')
    const [mainWidth, setMainWidth] = useState('100%')

    const fadeAnim = useRef(new Animated.Value(0)).current
    const [hideHeader, setHideHeader] = useState(false);

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


    const Home = (props) => {


        console.log(props)

        return (
            <>

                <Header setState={setSideMenu} State={SideMenu} />

                <View style={styles.screen}>
                    <SearchBar setProducts={setProducts} hideHeader={hideHeader} setHideHeader={setHideHeader} />
                </View>
                <InfiniteList list={products} hideHeader={hideHeader} />

            </>
        )
    }

    const SideBar = () => {

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

    return (

        <View style={styles.containter}>
            <Animated.View style={{
                width: fadeAnim,
                height: '100%',
                backgroundColor: 'rgb(240, 240, 245)',
            }}>
                <SideBar />
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