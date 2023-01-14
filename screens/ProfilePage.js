import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    SectionList,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'
import Header from './NonSearchHeader';
import SideBar from '../SideBar';
import { BASE_URL } from '../env';

const SECTIONS = [
    {
        title: 'Your Wishlist',
        data: [
            {
                key: '1',
                text: 'Item text 1',
                uri: 'https://picsum.photos/id/1011/200',
            },
            {
                key: '2',
                text: 'Item text 2',
                uri: 'https://picsum.photos/id/1012/200',
            },

            {
                key: '3',
                text: 'Item text 3',
                uri: 'https://picsum.photos/id/1013/200',
            },
            {
                key: '4',
                text: 'Item text 4',
                uri: 'https://picsum.photos/id/1015/200',
            },
            {
                key: '5',
                text: 'Item text 5',
                uri: 'https://picsum.photos/id/1016/200',
            },
        ],
    },
    {
        title: 'Your Recomendations',
        data: [
            {
                key: '1',
                text: 'Item text 1',
                uri: 'https://picsum.photos/id/1020/200',
            },
            {
                key: '2',
                text: 'Item text 2',
                uri: 'https://picsum.photos/id/1024/200',
            },

            {
                key: '3',
                text: 'Item text 3',
                uri: 'https://picsum.photos/id/1027/200',
            },
            {
                key: '4',
                text: 'Item text 4',
                uri: 'https://picsum.photos/id/1035/200',
            },
            {
                key: '5',
                text: 'Item text 5',
                uri: 'https://picsum.photos/id/1038/200',
            },
        ],
    },
];





const ListItem = ({ item }) => {

    return (
        <>
            <TouchableOpacity onPress={() => {
                console.log(item)
            }}>
                <View style={styles.item}>
                    <Image
                        source={{
                            uri: item.uri || item.image,
                        }}
                        style={styles.itemPhoto}
                        resizeMode="cover"
                    />
                    <Text style={styles.itemText}>{item.text}</Text>
                </View>
            </TouchableOpacity>


        </>
    );
};





const Rendarable = ({ recVisited }) => {

    const [name, setName] = useState("")
    const [nameEditProgress, setNameEditProgress] = useState(true)
    const [underlineColor, setUnderlineColor] = useState('ligthgray')
    const [loading, setLoading] = useState(false)
    useEffect(() => {

        // fetch the name of the guy
        getName()

    }, [])
    const ProfileHeader = () => {
        // states


        const NameEditLoader = () => {
            if (loading) {
                return (
                    <ActivityIndicator size="small" color="green" />
                )
            }
            else {
                return (
                    <ShowName />
                )
            }
        }


        const ShowName = () => {

            if (!nameEditProgress) {

                return (
                    <>
                        <Image source={{ uri: "https://img.icons8.com/ios-filled/50/40C057/ball-point-pen.png" }} style={{
                            width: 28,
                            height: 28,
                        }}></Image>
                    </>
                )
            }
            else {
                return (
                    <>
                        <Image source={{ uri: "https://img.icons8.com/ios-glyphs/30/null/ball-point-pen.png" }} style={{
                            width: 28,
                            height: 28,
                        }}></Image>
                    </>
                )
            }
        }



        return (
            <>

                <View style={styles.frontMatter}>
                    <Text style={styles.salutation}>Hello</Text>
                    <View style={{
                        flexWrap: 'wrap',
                        flexDirection: 'row'
                    }}>
                        <TextInput editable={!nameEditProgress} value={name} onChangeText={setName} placeholder='write someting' underlineColor={underlineColor} style={{
                            backgroundColor: 'white', borderWidth: 0, fontSize: 20,
                            fontWeight: '400', color: 'green', transform: [{ translateX: -20 }]
                        }}></TextInput>
                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderRadius: 210,
                            borderColor: '#e1e3e1',
                            padding: 10,
                            marginLeft: 0,
                            width: 50,
                            height: 50,
                            transform: [{ translateX: -30 }]
                        }}
                            onPress={async () => {
                                if (nameEditProgress) {
                                    setNameEditProgress(false)
                                    setUnderlineColor('green')
                                }
                                else {

                                    // send name
                                    setLoading(true)

                                    var uuid = await AsyncStorage.getItem('uuid')
                                    var user_id = await AsyncStorage.getItem('user_id')

                                    const resp = await fetch(BASE_URL + `userInfo/update_name?uuid=${uuid}&user_id=${user_id}&name=${name}`, { method: 'POST' })
                                    var resp_json = await resp.json();

                                    console.log(resp_json)

                                    await AsyncStorage.setItem('name', name)

                                    setNameEditProgress(true)
                                    setUnderlineColor('white')

                                    setLoading(false)
                                }
                            }}><NameEditLoader /></TouchableOpacity>
                    </View>
                </View>
                <View
                    style={styles.line}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view orders event
                            console.log("should open view orders")
                        }
                    }>
                        <Text style={styles.buttonText}>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view Wishlist event
                            console.log("should open view wishlist")
                        }
                    }>
                        <Text style={styles.buttonText}>Show Wishlist</Text>
                    </TouchableOpacity>



                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view orders event
                            console.log("should open view orders")
                        }
                    }>
                        <Text style={styles.buttonText}>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view Wishlist event
                            console.log("should open view wishlist")
                        }
                    }>
                        <Text style={styles.buttonText}>Show Wishlist</Text>
                    </TouchableOpacity>



                </View>
                <View
                    style={styles.line}
                />

            </>
        )
    }
    const getName = async () => {

        var name = await AsyncStorage.getItem('name')
        setName(name)

    }
    // console.log([recVisited,...SECTIONS])
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SectionList
                contentContainerStyle={{ paddingHorizontal: 10 }}
                stickySectionHeadersEnabled={false}
                sections={[recVisited, ...SECTIONS]}
                ListHeaderComponent={ProfileHeader}
                renderSectionHeader={({ section }) => (
                    <>
                        <Text style={styles.headerStyle}>{section.title}</Text>

                        <FlatList
                            horizontal
                            data={section.data}
                            renderItem={({ item }) => <ListItem item={item} />}
                            showsHorizontalScrollIndicator={false}
                        />
                        <View
                            style={styles.line}
                        />

                    </>

                )}
                renderItem={({ item, section }) => {
                    return null;
                }}
            />

        </SafeAreaView>
    )
}




export const ProfilePage = (props) => {
    const [recVisited, setRecVisited] = useState({ title: 'Recently Visited', data: [] })

    const isFocused = useIsFocused()

    useEffect(() => {



        const sendPagePopularityMetric = async () => {

            if (isFocused) {

                var userId = await AsyncStorage.getItem('user_id')

                var response = await fetch(BASE_URL + `monitor/send_metric?metric=PAGE_ENGAGEMENT&pagename=PROFILE&userid=${userId}`, { method: 'GET' })

                var response_json = await response.json()
                console.log(response_json)

                var user_id = await AsyncStorage.getItem('user_id')
                // console.log("sending")
                fetch(BASE_URL + `userInfo/fetchVisited?uid=${user_id}`)
                    .then(res => res.json())
                    .then(result => { setRecVisited({ title: recVisited.title, data: result }) })
            }

        }

        sendPagePopularityMetric()

    }, [isFocused])

    /* Side bar */
    // -----------------------------
    const [SideMenu, setSideMenu] = useState(0)
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

    // -----------------------------

    return (
        <>
            <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ffff',
                elevation: 2,
                flexDirection: 'row'
            }}>


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
                    <Header setState={setSideMenu} State={SideMenu} />
                    <Rendarable recVisited={recVisited} />
                </View>

            </View>

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    headerStyle: {
        fontSize: 25,
        fontWeight: '600',
        color: 'black',
    },
    buttonContainer: {
        flex: 2,
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        margin: 10,
    },
    buttonText: {
        color: 'grey',
    },
    button: {
        height: 50,
        width: '50%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 6,
        borderWidth: 1,
        borderColor: 'green',
    },
    sectionHeader: {
        fontWeight: '800',
        fontSize: 18,
        marginTop: 20,
        marginLeft: 15,
        marginBottom: 5,
    },
    item: {
        margin: 10,
        borderRadius: 8
    },
    itemPhoto: {
        width: 200,
        height: 200,
        borderRadius: 8
    },
    itemText: {
        marginTop: 5,
    },

    // for the header
    frontMatter: {
        marginLeft: 20
    },

    redChar: {
        color: 'red'
    },

    salutation: {
        fontSize: 35,
        fontWeight: '600',
        color: 'black',
        transform: [{ translateX: -10 }]
    },

    username: {
        fontSize: 30,
        fontWeight: '600',
        color: 'rgb(50, 50, 50)'
    },

    // for line
    line: {
        marginTop: 25,
        marginBottom: 25,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
    }
});
