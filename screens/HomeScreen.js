import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, ScrollView } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'

// import { Router, Scene } from 'react-native-router-flux'

/* <Router>
      <Scene key = "root">
         <Scene key = "home" component = {Home} title = "Home" initial = {true} />
         <Scene key = "locVer" component = {LocVer} title = "Locatio Verification" />
      </Scene>
   </Router> */


// const Routes = () => (
//     <Router>
//        <Scene key = "root">
//           <Scene key = "home" component = {Home} title = "Home" initial = {true} />
//           <Scene key = "about" component = {About} title = "About" />
//        </Scene>
//     </Router>
//  )

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
                    maxLength={40}
                    value={searchText}
                    onChange={(e) => { setSearchText(e.nativeEvent.text); }}
                    placeholder="Start Typing to search ..."
                />
                <Button title='Search' onPress={async () => {
                    console.log(searchText);
                    const result = await fetch(`https://desolate-gorge-42271.herokuapp.com/search/query?query=${searchText}`, { method: 'POST' })
                    const response = (await result.json()).data;
                    setProducts(response);
                    console.log(response);
                }}></Button>
            </View>
            <ScrollView>
                <View style={styles.slider}>
                    <Carousel
                        layout="default"
                        layoutCardOffset={20}
                        ref={isCarousel}
                        data={data}
                        renderItem={CarouselCardItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        inactiveSlideShift={0}
                        onSnapToItem={(index) => setIndex(index)}
                        useScrollView={true}
                        activeSlideAlignment="start"
                    />
                    <Pagination
                        dotsLength={data.length}
                        activeDotIndex={index}
                        carouselRef={isCarousel}
                        dotStyle={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            marginHorizontal: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.92)'
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        tappableDots={true}
                    />
                </View>

                <View style={styles.catContainer}>
                    <View style={styles.catItem}>
                        <Text>Catagory 1</Text>
                    </View>
                    <View style={styles.catItem}>
                        <Text>Catagory 2</Text>
                    </View>
                    <View style={styles.catItem}>
                        <Text>Catagory 3</Text>
                    </View>
                    <View style={styles.catItem}>
                        <Text>Catagory 4</Text>
                    </View>
                    <View style={styles.catItem}>
                        <Text>Catagory 5</Text>
                    </View>
                    <View style={styles.catItem}>
                        <Text>Catagory 6</Text>
                    </View>
                </View>

                <InfiniteList list={products} />
            </ScrollView>
        </>
    )
    // return (
    //     // <SafeAreaView style={styles.container}>
    //     <>
    //         <View style={styles.screen}>
    //             <TextInput style={styles.input}
    //                 editable
    //                 maxLength={40}
    //                 value={searchText}
    //                 onChange={(e) => { setSearchText(e.nativeEvent.text); }}
    //                 placeholder="Start Typing to search ..."
    //             />
    //             <View style={{ flex: 1 }}>

    //             </View>
    //             <Button title='Search' onPress={async () => {
    //                 console.log(searchText);
    //                 const result = await fetch(`https://desolate-gorge-42271.herokuapp.com/search/query?query=${searchText}`, { method: 'GET' })
    //                 const response = (await result.json()).data;
    //                 setProducts(response);
    //                 console.log(response);
    //             }}></Button>
    //         </View>
    //         <InfiniteList list={products} />

    //     </>
    //     // </SafeAreaView>
    // )
}


export const HomeScreen = () => {

    return (
        Home()
    )

}

const styles = StyleSheet.create({
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
    catContainer: {
        height: 'auto',
        flex: 1,
        flexDirection: "row",
        marginHorizontal: "auto",
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    catItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        height: 100,
        width: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        margin: 10

    },
    input: {
        borderWidth: 2,
        borderColor: 'lightblue',
        margin: 20,
        fontSize: 15,
        width: 250,
        padding: 4,
        borderRadius: 8,
    },

    navigation: {
        backgroundColor: 'tomato'
    }
});