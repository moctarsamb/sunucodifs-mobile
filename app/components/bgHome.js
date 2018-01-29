import React, { Component } from 'react';
import { View, ActivityIndicator,Text, Image } from "react-native";

import {
    StyleSheet,
    ImageBackground
} from 'react-native';

export class BackgroundImageHome extends Component {

    render() {
        return (
            <ImageBackground source={require('./bg2.jpeg')}
                             style={styles.backgroundImage}>

                {this.props.children}

            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },

    text: {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 32
    }
});