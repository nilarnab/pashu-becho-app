import React, { useEffect, useState, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Header from './UniversalHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SideMenu from 'react-native-side-menu-updated'

const data = [
    {
        title: "Lets Get Productive",
        body: "Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
        imgUrl: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
        title: "Time to get Charged",
        body: "Aenean ut eros et nisl sagittis vestibulum. Donec posuere vulputate arcu. Proin faucibus arcu quis ante. Curabitur at lacus ac velit ornare lobortis. ",
        imgUrl: "https://images.pexels.com/photos/914912/pexels-photo-914912.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
        title: "Start the day",
        body: "Phasellus ullamcorper ipsum rutrum nunc. Nullam quis ante. Etiam ultricies nisi vel augue. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.",
        imgUrl: "https://images.pexels.com/photos/50676/coffee-mugs-t-brown-drink-50676.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
];





export const HomeScreen = (props) => {
    const [searchText, setSearchText] = useState("");
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

    // useEffect(() => {
    //     if (SideMenu) {
    //         setSideWidth('20%')
    //         setMainWidth('80%')
    //     }
    //     else {
    //         setSideWidth('0%')
    //         setMainWidth('100%')
    //     }
    // }, [SideMenu])


    const Home = (props) => {


        console.log(props)

        return (
            <>

                <Header setState={setSideMenu} State={SideMenu} />


                <View style={styles.screen}>
                    <TextInput style={styles.input}
                        editable
                        maxLength={40}
                        value={searchText}
                        onChange={(e) => { setSearchText(e.nativeEvent.text); }}
                        placeholder="Start Typing to search ..."
                    />
                    {/* <Pressable title='Search' onPress={async () => {
                        console.log(searchText);
                        const result = await fetch(`https://desolate-gorge-42271.herokuapp.com/search/query?query=${searchText}`, { method: 'POST' })
                        const response = (await result.json()).data;
                        setProducts(response);
                        console.log(response);
                    }} style={styles.button}></Pressable> */}
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

    button:
    {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 3,
        height: 40,
        width: 30,
        backgroundColor: 'white',
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
        paddingHorizontal: 10
    },
    slider: {
    },
    input: {
        borderWidth: 0,
        borderBottomColor: '#e1e3e1',
        borderBottomWidth: 1,
        marginBottom: 1,
        fontSize: 15,
        width: '90%',
        padding: 10,
        borderRadius: 8,
    },

    navigation: {
        backgroundColor: 'tomato'
    }
});