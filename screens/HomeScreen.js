import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InfiniteList from "./InfiniteList";
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

const Home = () => {
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([])

    return (
        // <SafeAreaView style={styles.container}>
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
            <InfiniteList list={products} />

        </>
        // </SafeAreaView>
    )
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