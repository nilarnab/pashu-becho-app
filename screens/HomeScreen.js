import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, Pressable, ScrollView, } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'
import CarouselComp from "./CarouselComp"
import { red100 } from 'react-native-paper/lib/typescript/styles/colors';

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

const Home = () => {
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([])

    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    return (
        <>

            <View style={styles.screen}>
                <TextInput style={styles.input}
                    editable
                    underlineColorAndroid={
                        'red'
                    }
                    selectionColor={
                        'red'
                    }
                    maxLength={40}
                    value={searchText}
                    onChange={(e) => { setSearchText(e.nativeEvent.text); }}
                    placeholder="Start Typing to search ..."
                />
                <Pressable title='Search' onPress={async () => {
                    console.log(searchText);
                    const result = await fetch(`https://desolate-gorge-42271.herokuapp.com/search/query?query=${searchText}`, { method: 'POST' })
                    const response = (await result.json()).data;
                    setProducts(response);
                    console.log(response);
                }} style={styles.button}></Pressable>
            </View>



            <InfiniteList list={products} />

        </>
    )
}


export const HomeScreen = () => {

    return (
        Home()
    );

}

const styles = StyleSheet.create({

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
        elevation: 5,
        shadowColor: "red",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        borderRadius: 25
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
        marginBottom: 5,
        fontSize: 15,
        width: 250,
        padding: 10,
        borderRadius: 8,
    },

    navigation: {
        backgroundColor: 'tomato'
    }
});