import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, AppRegistry, FlatList, TextInput, Button, ScrollView } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem'
import { BASE_URL } from '../env';

const data = [
    {
        title: "",
        body: "Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
        imgUrl: "https://images.pexels.com/photos/5872634/pexels-photo-5872634.jpeg?auto=compress&cs=tinysrgb&w=800",
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


const CarouselComp = () => {
    const [carouselData, setcarouselData] = useState([]);
    useEffect(() => {
        // fecth will be here (guess so)
        fetch(BASE_URL + 'carousel/getCarousels')
            .then(res => res.json())
            .then(result => {
                setcarouselData(result);
            })
    }, []);

    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    return (
        <View style={styles.slider}>
            <Carousel
                layout="default"
                layoutCardOffset={20}
                ref={isCarousel}
                data={carouselData}
                renderItem={CarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                inactiveSlideShift={0}
                onSnapToItem={(index) => setIndex(index)}
                useScrollView={true}
                activeSlideAlignment="start"
                autoplay={true}
                autoplayDelay={1000}
                autoplayInterval={3000}
                enableSnap={true}
            />
            {/* <Pagination
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
                inactiveDotScale={0.4}
                tappableDots={true}
            /> */}
        </View>
    );

}

const styles = StyleSheet.create({
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
        height: 50,
        width: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        margin: 5

    },
})

export default CarouselComp;