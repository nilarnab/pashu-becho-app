import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, Image, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, TouchableOpacity, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Header from './UniversalHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideMenu from 'react-native-side-menu-updated'
import { black } from 'react-native-paper/lib/typescript/styles/colors';
import { BASE_URL } from '../env';

const SearchBar = (props) => {

    const [searchText, setSearchText] = useState("");

    console.log("search bar props")
    console.log(props)

    // var searchText = props.searchText
    // var setSearchText = props.setSearchText
    var setProducts = props.setProducts

    return (
        <>
            <TextInput style={styles.input}
                editable
                maxLength={40}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Start Typing to search ..."
            />
            <TouchableOpacity title='Search' onPress={async () => {
                console.log(searchText);
                const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'POST' })
                const response = (await result.json()).data;
                setProducts(response);
                console.log(response);

            }} style={styles.searchButton} ><Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/search.png" }} style={{ height: 20, width: 20 }} /></TouchableOpacity>

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
                    <SearchBar setProducts={setProducts} />
                </View>
                <InfiniteList list={products} />

            </>
        )
    }

    const SideBar = () => {

        return (
            <View style={{ width: 10, backgroundColor: 'black' }}>
                <Text>Side bar</Text>
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
        width: '90%',
        padding: 10,
        borderRadius: 8,
    },

    navigation: {
        backgroundColor: 'tomato'
    }
});