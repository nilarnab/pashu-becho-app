import React, { useState, useEffect, useReducer } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, View, FlatList, Button, Image, ImageBackground, Pressable, Touchable, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import PreBuyComp from './PreBuyPipe';
import { BASE_URL } from '../env';

export const CartView = (navigation) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const [userId, setUserId] = useState('')

  const fetchCart = async () => {
    var userId = await AsyncStorage.getItem("user_id")
    console.log("fetching cart for user: ", userId)
    const resp = await fetch(BASE_URL + `handleCartOps/show_items?user_id=${userId}`, { method: 'POST' })
    var data_raw = await resp.json();
    console.log(data_raw)
    if (data_raw.response != null) {

      const data = data_raw["response"]["cart_items"]
      console.log("fetch complete")
      setData(data);
      var newSt = 0;
      data.map((item) => {
        newSt += item['product'].price * item[Object.keys(item)[1]]
      })
      setSubTotal(newSt);
    }
    else {
      setData([])
      setSubTotal(0)
    }
    setLoading(false);
  }


  useEffect(() => {

    fetchCart();
  }, [navigation, useIsFocused]);


  const updateScreen = () => {
    forceUpdate();
  }

  const renderItem = ({ item }) => {
    console.log("during redner")
    console.log(item)

    var product_id = item['product']._id.toString()
    var product_name = item['product'].name
    var product_description = item['product'].description
    var prod_qnt = item['qnt']
    var cart_id = item['cart_id']
    var prod_price = item['product'].price

    var prod_data = {}
    prod_data['prod_id'] = product_id
    prod_data['prod_name'] = product_name
    prod_data['prod_description'] = product_description
    prod_data['prod_qnt'] = prod_qnt
    prod_data['cart_id'] = cart_id
    prod_data['prod_price'] = prod_price
    return (
      <Item props={prod_data} />
    )
  };

  const Item = ({ props }) => {
    return (
      <View style={{ borderBottomWidth: 1 }} >
        <View style={{ marginBottom: 2,paddingBottom:15 }}>
          <View style={styles.cart_item}>

            {/* product Image */}
            <Image source={{ uri: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-collection-1_large.png?format=webp&v=1530129113" }} style={styles.cartImage}></Image>
            <View style={{ flexDirection: "column", width: "60%" }}>
              <Text style={styles.cartItemName}>{props.prod_name}</Text>

              {/* Description */}
              <Text style={{ color: "black" }}>{props.prod_description}</Text>

              {/* Product Price */}
              <Text style={styles.price} > &#8377; {props.prod_price}</Text>

              {/* Shiping details */}
              <Text style={{ color: "black" }}>Eligible for FREE Shipping</Text>

              {/* In Stock or Out of Stock */}
              <Text style={{ color: "green" }}>In stock</Text>
            </View>
          </View>


          <View style={{ display: "flex", width: "100%", flexDirection: "row" }}>

            {/* cart quantity change buttons */}
            <View style={{ display: "flex", marginLeft: 10, flexDirection: "row", width: "30%", justifyContent: 'center', borderColor: "#e1e5e1", borderWidth: 1, borderRadius: 8 }}>
              <TouchableOpacity style={styles.cartButton} onPress={async () => {
                setLoading(true)
                console.log("reducing from cart")
                var userId = await AsyncStorage.getItem("user_id")
                const resp = await fetch(BASE_URL + `handleCartOps/alter?cart_id=${props.cart_id}&qnt_new=${props.prod_qnt - 1}`, { method: 'POST' })

                fetchCart();

              }} props={props} ><Text style={{ fontSize: 18,color:"black" }}>-</Text></TouchableOpacity>
              <Text style={{ color: "black", fontSize: 20, marginTop: 5 }}> {props.prod_qnt}</Text>
              <TouchableOpacity style={styles.cartButton} onPress={async () => {
                setLoading(true)
                console.log("adding to cart")
                console.log(props)
                var userId = await AsyncStorage.getItem("user_id")
                const resp = await fetch(BASE_URL + `handleCartOps/alter?cart_id=${props.cart_id}&qnt_new=${props.prod_qnt + 1}`, { method: 'POST' })
                fetchCart();
              }} props={props}><Text style={{ fontSize: 18,color:"black" }}>+</Text>
              </TouchableOpacity>

            </View>
            <Pressable style={{
              width: 60,
              color: "black",
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3,
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: 'white',
              borderColor: 'tomato',
              margin: 5,
            }} ><Text style={{ color: 'red' }}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  };


  const ItemList = () => {

    if (data.length == 0) {
      return (
        <>
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Image source={{ uri: "https://img.icons8.com/fluency/96/null/empty-box.png" }} style={{ width: 100, height: 100 }} />
            <Text style={{ fontSize: 40 }}>Oh, nothing here</Text>
          </View>
        </>
      )
    }
    else {
      return (
        <>
          <View style={styles.container}>
            <FlatList style={{ marginBottom: 10 }}
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </>
      )
    }
  }


  return (

    <SafeAreaView style={styles.outer_container}>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      {/* Cart Details Card */}

      <View style={styles.container}>
        <Text style={{ color: "black", fontSize: 25 }}>Subtotal <Text style={{ fontWeight: "900" }}>&#8377; {subTotal}</Text></Text>
        <TouchableOpacity style={{ height: 100, color: "black", backgroundColor: "white", padding: 10, width: "95%", margin: 10, borderWidth: 1, borderColor: 'green', borderRadius: 8, alignContent: 'center', justifyContent: 'center' }} onPress={(props) => {
          console.log(navigation.navigation)
          navigation.navigation.navigate("PreBuyPipe")

        }}><Text style={{ fontWeight: "900", fontSize: 20, textAlign: 'center', color: "green" }}>Proceed to Buy ({data.length} items)</Text></TouchableOpacity>
      </View>
      <ItemList />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
  },
  cartImage: {
    width: "35%",
    height: 170
  }
  ,
  cartItemName: {
    color: "black",
    fontSize: 21
  },
  price: {
    fontSize: 25,
    color: "black",
    fontWeight: "600"
  }
  ,
  cartButton: {
    width: 30,
    color: "#b01c14",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'lightgray',
    margin: 5
  },

  title: { color: "black", fontSize: 12, flexShrink: 1, flexWrap: 'wrap' },

  outer_container: {
    backgroundColor: '#fff',
    height: '100%',
  },

  cart_item: {
    height: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between"
  },

  navigation: {
    backgroundColor: 'tomato'
  }
});

