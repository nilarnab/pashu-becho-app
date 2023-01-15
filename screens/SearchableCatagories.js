
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Text, ScrollView, Touchable, TouchableOpacity, ImageBackground } from "react-native";
import { BASE_URL } from '../env'
import { SLIDER_WIDTH } from "./CarouselCardItem";



const SearchableCatagories = (props) => {
    const [scategoryData, setscategoryData] = useState([]);
    useEffect(() => {
        // fecth will be here (guess so)
        fetch(BASE_URL + 'categoryDefine/getCategories?type=1')
            .then(res => res.json())
            .then(result => { setscategoryData(result); })
    }, []);

    // console.log("searchable")
    // console.log(props)

    const searchItem = async (searchText) => {
        // console.log("seraching for", searchText)
        const result = await fetch(BASE_URL + `search/query?query=${searchText}`, { method: 'GET' })
        const response = (await result.json()).data;
        props.setCatagorySearchProducts(response);
        // console.log(response);
    }

    const bigCatagoryActionCenter = async ({ item }) => {

        props.setIgnoreSearch(true)
        props.setHideHeader(true)
        if (item["action"] == 'SEARCH') {
            // console.log("search for", item['title'])
            searchItem(item['title'])
        }
    }


    const QuadItem = ({ item }) => {

        if ("image" in item) {
            return (
                <>
                    <TouchableOpacity style={styles.catItemSmall} onPress={async () => {

                        if (item["action"] == 'SEARCH') {
                            // console.log("search for", item['title'])
                        }
                    }}>
                        <ImageBackground source={{ uri: item.image }} resizeMode="cover" style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 8
                        }} imageStyle={{ borderRadius: 8 }}>
                        </ImageBackground>
                        {/* <Text>{item.title}</Text> */}
                    </TouchableOpacity>
                </>
            )
        }
        else
            return (
                <>
                    <TouchableOpacity style={styles.catItemSmall} onPress={async () => {

                        if (item["action"] == 'SEARCH') {
                            // console.log("search for", item['title'])
                        }
                    }}>
                        {/* <Text>{item.title}</Text> */}
                    </TouchableOpacity>
                </>
            )
    }

    const CatagoryItem = ({ item }) => {
        if ('subcategory' in item) {
            if (item['subcategory'].length == 4) {
                return (
                    <>
                        <View style={styles.catItemQuad}>
                            <QuadItem item={item.subcategory[0]} />
                            <QuadItem item={item.subcategory[1]} />
                            <QuadItem item={item.subcategory[2]} />
                            <QuadItem item={item.subcategory[3]} />
                        </View>
                    </>
                )
            }
        }

        if ("image" in item) {

            return (
                <>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius:5,
                        // borderWidth:1,
                        margin:"auto",
                        marginVertical:5,
                    }}>
                        <TouchableOpacity style={styles.catItem} onPress={() => bigCatagoryActionCenter({ item })}>
                            <ImageBackground source={{ uri: item.image }} resizeMode="cover" style={{
                                width: '100%',
                                height: '100%',
                            }} imageStyle={{ borderRadius: 10 }}>
                            </ImageBackground>
                        </TouchableOpacity>
                        <Text style={{
                            transform: [
                                {
                                    translateY: -10
                                }
                            ],
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: 'green'
                        }}>{item.title}</Text>
                    </View>
                </>
            )
        }
        else {
            return (
                <>
                    <TouchableOpacity style={styles.catItem} onPress={() => bigCatagoryActionCenter({ item })}>
                        {/* <Text>{item.title}</Text> */}
                    </TouchableOpacity>

                </>
            )
        }
    }

    // console.log("searchable prop")
    // console.log(props)
    return (
                <FlatList
                style={styles.catContainer}
                    horizontal={false}
                    data={scategoryData}
                    renderItem={CatagoryItem}
                    initialNumToRender={1}
                    // TODO: Fix in production
                    keyExtractor={item => Math.random()}

                />
    )
}


const styles = StyleSheet.create({
    catContainer: {
        height: 'auto',
        flex: 1,
        flexDirection: "row",
        width:SLIDER_WIDTH - 100,
        marginHorizontal: 10,
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 10,
        shadowColor:'gray',
        borderColor: 'lightgrey',
        borderWidth: 1,
        flexWrap:'wrap',
        padding:10,
    },
    catItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 100,
        height: 60,
        width: 60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 0,
        margin: 10

    },
    catItemQuad: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 25,
        padding: 11,
        height: 100,
        width: 100,
        margin: 4

    },

    catagoryText: {
        fontWeight: '800',
        fontSize: 25,
        marginTop: 20,
        marginLeft: 12,
    },

    catItemSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 0,
        height: 30,
        width: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 0,
        margin: 2

    },
})

export default SearchableCatagories