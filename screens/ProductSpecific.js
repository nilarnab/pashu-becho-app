import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity ,Dimensions, ImageBackground} from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
import Video, { DRMType } from 'react-native-video';
import { ActivityIndicator, Button } from 'react-native-paper';
import { navigate } from "../RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { BASE_URL } from '../env';
ITEM_WIDTH =Dimensions.get('window').width;


const uri = "http://159.223.90.95:5000/video/id_video_1/_manifest.mpd"
function DashVideo(url,index) {
    console.log("fetch video with url :-",url)
    return (
        <View style={styles.container} key={index} >
        <Video key={index}
            source={{ uri: url }}
            rate={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            repeat={true}
            style={styles.image}
        />
        </View>
    );
}

const ProductImage=(url,index)=>{
    console.log("show image with url :- ",url);
    return <View style={styles.container} key={index} >
    <ImageBackground source={{ uri: url }} resizeMode="cover" style={styles.image} imageStyle={{ borderRadius: 8 }}>
        {/* <Text style={styles.header}>{item.title}</Text> */}
    </ImageBackground>
</View>
//     return <ImageBackground source={{ uri: url }} resizeMode="cover" style={{}} imageStyle={{ borderRadius: 8 }}>
// </ImageBackground>
}
// const userId = "630dc78ee20ed11eea7fb99f"
// const BASE_URL = 'https://desolate-gorge-42271.herokuapp.com/'
// const BASE_URL = 'http://159.223.90.95:3000/'

function AddToCartButton({ productID }) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartID, setCartID] = useState(null);
    const [userId, setUserId] = useState(null)


    const fetchCart = async () => {
        setLoading(true);

        // get user id  

        var user_id_temp = await AsyncStorage.getItem('user_id')
        setUserId(user_id_temp)

        console.log(user_id_temp, productID)

        const resp = await fetch(BASE_URL + `handleCartOps/show_item?user_id=${user_id_temp}&prod_id=${productID}`, { method: 'POST' })
        const response = await resp.json();

        console.log(response);

        if (response.cart_item == null) {
            setCount(0);
            setCartID(null);
        } else {

            const cartItem = response.cart_item
            const count = cartItem["qnt"];

            setCount(count);
            setCartID(cartItem["_id"]);
        }

        setLoading(false);
    };

    // useEffect does not support async functions directly
    useEffect(() => {
        fetchCart();
    }, [])


    const addProduct = async () => {
        setLoading(true);

        const resp = await fetch(BASE_URL + `handleCartOps/insert?user_id=${userId}&prod_id=${productID}&qnt=1`, { method: 'POST' })
        const data = await resp.json();
        console.log(data);

        fetchCart()
    };

    const modifyCount = async (newCount) => {
        setLoading(true);
        await fetch(BASE_URL + `handleCartOps/alter?cart_id=${cartID}&qnt_new=${newCount}`, { method: 'POST' })

        fetchCart()
    }

    if (loading) {
        return (
            <ActivityIndicator size={38} color="black" />
        );
    }

    console.log("coutn foudn as", count)
    if (count === 0)
        return (
            <Button icon="cart" mode="contained" style={{ backgroundColor: "black" }} onPress={addProduct}>
                Add To Cart
            </Button>
        )
    else
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: "center" }}>
                <Button style={styles.button} onPress={() => modifyCount(count - 1)} mode="contained">-</Button>
                <Text style={{ flexGrow: 1, textAlign: "center", fontSize: 20, color: "black" }}>{count}</Text>
                <Button style={styles.button} onPress={() => modifyCount(count + 1)} mode="contained">+</Button>
            </View>
        );
}

// const Resources =async(pid)=>{
//     const resp = await fetch(BASE_URL + `stream/getResources?pd=${pid}`, { method: 'GET' })
//         const response = await resp.json();
//         console.log("This is the response : - ",response);
        


// }




export default function ProductSpecific({ route }) {
    const { item } = route.params;
    const [resourceData,setresourceData]=useState([]);
    useEffect(() => {
        // fecth will be here (guess so)
        fetch(BASE_URL + `stream/getResources?pid=${item._id}`)
            .then(res => res.json())
            .then(result => { setresourceData(result);console.log("ye mila data :- ",result) })
    }, []);
    const fetch_session_phone = async () => {
        var phoneNo = await AsyncStorage.getItem('user_phone')
        const items = {
            phone: phoneNo,
        }
        console.log(items.phone)

        if (phoneNo == null) {
            // console.log('navigating to main page')
            props.navigation.navigate("Main")
        }
        else {
            navigate("Pay", { items });
        }

    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: "rgb(250, 250, 250)" }}>
                <  ScrollView  style={{marginTop:20}}
                    horizontal={true}
                    pagingEnabled
                    decelerationRate={0}
                    snapToInterval={Dimensions.get('window').width}
                >
                    {resourceData.map((el,index)=>{
                    if (el.type==="video"){
                        console.log("its video :-)")
                        return DashVideo(el.url,index);
                    }
                    else if(el.type=="image"){
                        console.log("its image :-)",el)
                        return ProductImage(el.url,index);
                    }
                    })}

                </ScrollView>
                <View style={styles.screen}>
                    <Text style={styles.productname}>{item.name}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ paddingRight: 2, ...styles.text }}>{item.ratings}</Text>
                            {/* <Ionicons name="star" size={20} color="orange" /> */}
                        </View>
                        <Text style={styles.text}>₹{item.price}</Text>
                    </View>
                    <View style={{ height: 2, backgroundColor: "lightgrey", marginVertical: 10 }} />
                    <Text style={styles.description}>{item.description}</Text>
                    <TouchableOpacity mode="contained" style={{
                        backgroundColor: 'white',
                        marginVertical: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        marginTop: 50,
                        borderColor: 'green',
                    }} onPress={fetch_session_phone}>
                        <Text style={{ color: 'green', fontSize: 20, fontWeight: 'bold' }}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
            <View style={styles.footer}>
                <AddToCartButton productID={item._id} />
            </View>
        </View >
    );


}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: 0,
        borderRadius: 15,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH*0.8,
        marginLeft:ITEM_WIDTH * 0.2,
        marginRight:ITEM_WIDTH * 0.1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginLeft: 20,
        marginBottom: 12
    },
    image: {
        width: ITEM_WIDTH*0.8,
        height: 300,
        borderRadius: 8
    },
    productname: {
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 30,
        color: 'black'
    },
    text: {
        fontSize: 20,
        color: "black"
    },
    description: {
        marginTop: 10,
        fontSize: 15,
        color: "black"
    },
    button: {
        backgroundColor: "black",
        width: "30%"
    },
    footer: {
        padding: 20,
        backgroundColor: "#fff",
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowColor: 'black',
        elevation: 10,
    },
});