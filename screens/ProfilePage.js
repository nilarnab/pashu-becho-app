import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    SafeAreaView,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';


const SECTIONS = [
    {
        title: 'Recently Visited',
        data: [
            {
                key: '1',
                text: 'Item text 1',
                uri: 'https://picsum.photos/id/1/200',
            },
            {
                key: '2',
                text: 'Item text 2',
                uri: 'https://picsum.photos/id/10/200',
            },

            {
                key: '3',
                text: 'Item text 3',
                uri: 'https://picsum.photos/id/1002/200',
            },
            {
                key: '4',
                text: 'Item text 4',
                uri: 'https://picsum.photos/id/1006/200',
            },
            {
                key: '5',
                text: 'Item text 5',
                uri: 'https://picsum.photos/id/1008/200',
            },
        ],
    },
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
                            uri: item.uri,
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




export const ProfilePage = (props) => {


    // states
    const [name, setName] = useState("")



    const getName = async () => {

        var name = await AsyncStorage.getItem('name')
        setName(name)

    }


    useEffect(() => {

        // fetch the name of the guy
        getName()

    }, [])

    const ProfileHeader = () => {

        return (
            <>

                <View style={styles.frontMatter}>
                    <Text style={styles.salutation}><Text style={styles.redChar}>H</Text>ello</Text>
                    <Text style={styles.username}>{name}</Text>
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
                        <Text>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view Wishlist event
                            console.log("should open view wishlist")
                        }
                    }>
                        <Text>Show Wishlist</Text>
                    </TouchableOpacity>



                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view orders event
                            console.log("should open view orders")
                        }
                    }>
                        <Text>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={
                        () => {
                            // handle view Wishlist event
                            console.log("should open view wishlist")
                        }
                    }>
                        <Text>Show Wishlist</Text>
                    </TouchableOpacity>



                </View>

            </>
        )
    }

    return (
        <>

            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>
                    <SectionList
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        stickySectionHeadersEnabled={false}
                        sections={SECTIONS}
                        ListHeaderComponent={ProfileHeader}
                        renderSectionHeader={({ section }) => (
                            <>
                                <Text style={styles.sectionHeader}><Text style={styles.redChar}>{section.title[0]}</Text>{section.title.substring(1)}</Text>

                                <FlatList
                                    horizontal
                                    data={section.data}
                                    renderItem={({ item }) => <ListItem item={item} />}
                                    showsHorizontalScrollIndicator={false}
                                />

                            </>

                        )}
                        renderItem={({ item, section }) => {
                            return null;
                        }}
                    />
                </SafeAreaView>
            </View>

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 2,
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20,
        margin: 10
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
        elevation: 5,
        borderWidth: 0,
        borderColor: 'rgb(200, 200, 200)',
        shadowColor: '#000'
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
        fontSize: 50,
        fontWeight: '800'
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
        borderBottomColor: 'rgb(200, 200, 200)',
        borderBottomWidth: 1,
    }
});
