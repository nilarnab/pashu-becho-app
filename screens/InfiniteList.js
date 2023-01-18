import React, { useEffect, useState } from "react";
import { Animated, View, FlatList, StyleSheet, Image, ActivityIndicator, RefreshControl, Text, ScrollView } from "react-native";
import ProductView from "./ProductView";
import CarouselComp from "./CarouselComp"
import Catagories from "./Catagories"
import SearchableCatagories from "./SearchableCatagories";
import { BASE_URL } from '../env'
import { Translator } from "./Translator";
import { LangugaDisplay } from "./LanguageDisplay";
import AsyncStorage from '@react-native-async-storage/async-storage';




const InfiniteList = (props) => {
    const [products, setProducts] = useState([]);
    const [refreshing,] = useState(false);
    const [pagination, setPagination] = useState(0);
    const [finished, setFinished] = useState(false);
    const [HiddenStateProduct, setHiddenStateProduct] = useState([]);
    const [currentLangCode, setCurrentLangCode] = useState('en')

    const navigation = props.navigation;


    useEffect(() => {
        const getLanguage = async () => {
            const langCode = await AsyncStorage.getItem('langCode')
            if (langCode != null) {
                setCurrentLangCode(langCode)
            }
            else {
                setCurrentLangCode('en')
            }
        }

        getLanguage()
    }, [])

    const LocationDisplay = () => {

        return (<>
            <View style={{
                borderColor: 'lightgrey',
                borderWidth: 0.5,
                marginTop: 20,
                marginHorizontal: 10,
                paddingHorizontal: 10,
                paddingVertical: 20,
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center'
            }}>
                <View >
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/marker.png' }} style={{
                            height: 20,
                            width: 20,
                            marginRight: 5
                        }} />
                        <Text style={{
                            color: 'black'
                        }}>{Translator('your location', currentLangCode)}</Text>
                    </View>
                    <Text style={{
                        color: 'black',
                        fontWeight: 'bold', flexDirection: 'column', width: 200
                    }}>KnowWhere, Thanos gali, quad 4</Text>

                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 'auto',
                        width: 'auto',
                        borderColor: 'green',
                        borderWidth: 1,
                        position: 'absolute',
                        right: 20,
                        borderRadius: 10,
                        padding: 10
                    }}>
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/location.png' }} style={{
                        height: 20,
                        width: 20,
                        marginRight: 5
                    }} />
                    <Text style={{
                        color: 'black'
                    }}>{Translator('get location', currentLangCode)}</Text>

                </View>


            </View>
        </>)
    }


    const Header = ({ setHiddenStateProducts, setHideHeader, setIgnoreSearch, catagorySearchProducts, setCatagorySearchProducts }) => {


        return (
            <>
                <LocationDisplay />
                <LangugaDisplay currentLangCode={currentLangCode} setCurrentLangCode={setCurrentLangCode} />
                <SearchableCatagories setHiddenStateProducts={setHiddenStateProducts} setHideHeader={setHideHeader} setIgnoreSearch={setIgnoreSearch} setCatagorySearchProducts={setCatagorySearchProducts} />
                {/* <CarouselComp /> */}
                {/* <Catagories /> */}
                {/* <View style={styles.catagoryBlock}>
                    <Image source={{ uri: 'https://img.icons8.com/3d-fluency/94/null/wedding-gift.png' }} style={{ width: 35, height: 35 }} />
                    <Text style={styles.catagoryText}>Buy Exclusive ..</Text>
                </View> */}
            </>
        )
    }

    const renderItems = (arr) => {

        return <ScrollView style={{}}>

            {
                arr.map(el =>
                    (<ProductView item={el} key={el._id} />)
                )


            }
        </ScrollView>

    }
    /**
     * The compoenent visible at the bottom of the infinite list
    */
    const renderFooter = () => {
        return (
            <View style={styles.loaderStyle}>
                {finished ?
                    <Text>Finished infinite list</Text>
                    :
                    <></>
                }
            </View>
        );
    };

    const loadMoreItems = () => {
        setPagination(pagination + 1);
    };

    const resetList = () => {
        setProducts([]);
        setFinished(false);
        setPagination(0);
    };

    useEffect(() => {

        setHiddenStateProduct(props.list)

        /**
     * Fetch the products via the API, then update the products state
     */
        const getProducts = () => {
            // console.log("trying to get products")
            fetch(BASE_URL + `products/getAllProducts`, { method: 'GET' })
                .then(res => res.json())
                .then(({ allProducts }) => {
                    if (allProducts.length === 0)
                        setFinished(true);
                    else
                        setProducts([...products, ...allProducts])
                    console.log(products);
                });
        };

        getProducts();
    }, [pagination]);

    if (props.ignoreSearch) {
        return (
            <>
                <FlatList
                    data={props.catagorySearchProducts}
                    renderItem={(item) => <ProductView item={item.item} navigation={navigation} />}
                    initialNumToRender={1}
                    numColumns={2}
                    // TODO: Fix in production
                    keyExtractor={item => Math.random()}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={1}
                />
            </>
        )

    }
    else {

        if (!props.hideHeader) {
            return (

                <FlatList
                    data={products}
                    renderItem={(item) => <ProductView item={item.item} navigation={navigation} />}
                    initialNumToRender={1}
                    // TODO: Fix in production
                    keyExtractor={item => Math.random()}
                    ListHeaderComponent={
                        <Header
                            setHiddenStateProducts={setHiddenStateProduct}
                            setHideHeader={props.setHideHeader}
                            setIgnoreSearch={props.setIgnoreSearch}
                            catagorySearchProducts={props.catagorySearchProducts}
                            setCatagorySearchProducts={props.setCatagorySearchProducts}
                        />}
                    ListFooterComponent={renderFooter}
                    // onEndReached={loadMoreItems}
                    onEndReachedThreshold={1}
                    refreshing={refreshing}
                    onRefresh={resetList}
                    numColumns={2}
                />
            )
        }
        else {
            // console.log("now shoing hidden state products")
            return (
                <>
                    <FlatList
                        data={HiddenStateProduct}
                        renderItem={(item) => <ProductView item={item.item} navigation={navigation} />}
                        initialNumToRender={1}
                        numColumns={2}
                        // TODO: Fix in production
                        keyExtractor={item => Math.random()}
                        onEndReached={loadMoreItems}
                        onEndReachedThreshold={1}
                    />
                </>
            )
        }
    }

};

const styles = StyleSheet.create({
    loaderStyle: {
        marginVertical: 16,
        alignItems: "center",
    },

    catagoryBlock: {
        fontWeight: '800',
        fontSize: 25,
        marginTop: 0,
        marginLeft: 20,
        color: 'black',
        flexDirection: 'row',
    },

    catagoryText: {
        fontWeight: '800',
        fontSize: 25,
        marginTop: 0,
        marginLeft: 10,
        color: 'black',
        flexDirection: 'row',
    },
});

export default InfiniteList;