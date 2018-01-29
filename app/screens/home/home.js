import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import * as db from "../../db";
import {BackgroundImageHome} from "../../components/bgHome";
import {Icon} from "react-native-elements";
export default class Home extends Component<{}> {
    constructor(props){
        super(props);
    }
    static navigationOptions = ({ navigation }) => {
        let headerTitle = "SunuCodifs";
        let headerRight = (
            <Icon
                iconStyle={{ marginRight: 20 }}
                type="ionicon"
                onPress={() => {
                    navigation.navigate("LoginL");
                    db.Logout()
                } }
                name="ios-log-out"
                size={35}
                color={"#0ea7f9"}
            />
        );
        return { headerTitle, headerRight };
    };
    render() {
        return (
            <BackgroundImageHome>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.styless}
                    onPress={()=> this.props.navigation.navigate("Batiment") }
                    >
                        <Image
                            style={styles.button}
                            resizeMode="stretch"
                            source={require('../../components/list-2389219_960_720.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> this.props.navigation.navigate("Liste") }
                    >
                        <Image
                            style={styles.button}
                            resizeMode="stretch"
                            source={require('../../components/306458.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> this.props.navigation.navigate("Echange") }
                    >
                        <Image
                            style={styles.button}
                            resizeMethod="scale"
                            source={require('../../components/Refresh-512.png')}
                        />
                    </TouchableOpacity>
                </View>
            </BackgroundImageHome>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button:{
        margin: 25,
        backgroundColor: "transparent",
        alignSelf: 'center',
        height: 175,
        width: 175,
    },
    styless:{
        backgroundColor: "transparent",

    }
});
