import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, Touchable, TouchableOpacity, Image, } from 'react-native';
import FontAwesome, { SolidIcons, RegularIcons, BrandIcons } from 'react-native-fontawesome';
import { FaHeart } from "react-icons/fa";
import Icon from "react-native-vector-icons/Ionicons";
import { BASE_URL } from '../env';

const SearchBar = (props) => {

    const [searchText, setSearchText] = useState("");
    const [hideHeader, setHideHeader] = useState(props.hideHeader)

    // console.log("search bar props")
    // console.log(props)

    // var searchText = props.searchText
    // var setSearchText = props.setSearchText
    var setProducts = props.setProducts


    const ResetButton = (props) => {
        // console.log("reset button props")
        // console.log(props)

        if (hideHeader) {

            return (
                <>
                    <TouchableOpacity title='Search' onPress={async () => {
                        // console.log(searchText);
                        const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'GET' })
                        const response = (await result.json()).data;
                        setProducts(response);
                        // console.log(response);

                        setHideHeader(false)
                        props.setHideHeader(false)
                        props.setIgnoreSearch(false)

                    }} style={styles.searchButton} ><Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/restart--v2.png" }} style={{ height: 20, width: 20, marginBottom: 15 }} /></TouchableOpacity>

                </>
            )
        }
    }

    const SearchButtonIcon = () => {
        if (searchText.length == 0) {
            return (
                <>
                    <Image source={{ uri: "https://img.icons8.com/ios/50/null/search--v1.png" }} style={{ height: 20, width: 20, marginBottom: 15 }} />
                </>
            )
        }
        else {
            return (
                <>
                    <Image source={{ uri: "https://img.icons8.com/3d-fluency/94/null/search.png" }} style={{ height: 20, width: 20, marginBottom: 15 }} />
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
                // console.log(searchText);
                // console.log("in searching")
                const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'GET' })
                const response = (await result.json()).data;
                setProducts(response);
                setHideHeader(true)
                props.setHideHeader(true)
                props.setIgnoreSearch(false)

            }} style={styles.searchButton} >
                <SearchButtonIcon />
            </TouchableOpacity>
            <ResetButton setHideHeader={props.setHideHeader} hideHeader={props.hideHeader} setIgnoreSearch={props.setIgnoreSearch} />

        </>
    )
}


const Header = ({ setState, State, setProducts, setHideHeader, hideHeader, setIgnoreSearch }) => {

    const [sideState, setSideState] = useState(0)

    const handleSideBar = () => {

    }


    const BurgerIcon = () => {

        if (State == 0) {

            return (
                <>
                    <Image source={{ uri: "https://img.icons8.com/material/24/null/menu--v1.png" }} style={{ height: 20, width: 20 }}></Image>
                </>
            )
        }
        else {
            return (
                <Image source={{ uri: "https://img.icons8.com/material/24/null/arrow-pointing-left--v2.png" }} style={{ height: 20, width: 20 }}></Image>
            )
        }
    }

    // console.log(setState)

    return (
        <>
            <View style={styles.containter}>

                <View style={styles.left_icons}>
                    <TouchableOpacity
                        onPress={() => {
                            if (State == 0) {
                                setState(1)
                            }
                            else {
                                setState(0)
                            }
                        }}>
                        <BurgerIcon />
                    </TouchableOpacity>

                </View>

                <View style={styles.right_icons}>
                    <View style={styles.screen}>
                        <SearchBar setProducts={setProducts} hideHeader={hideHeader} setHideHeader={setHideHeader} setIgnoreSearch={setIgnoreSearch} />
                    </View>
                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({

    containter: {
        width: '100%',
        height: 60,
        backgroundColor: '#ffff',
        elevation: 2,
        flexDirection: 'row'
    },

    left_icons: {
        width: 80,
        height: '100%',
        padding: 20
    },

    right_icons:
    {
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        position: 'absolute',
        right: 0,
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
    },

    input: {
        marginBottom: 1,
        fontSize: 15,
        color: "black",
        width: '80%',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10
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

})

export default Header;