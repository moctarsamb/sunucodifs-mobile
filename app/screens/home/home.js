import React, { Component } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import * as db from "../../db";
import {BackgroundImageHome} from "../../components/bgHome";
import {Icon} from "react-native-elements";
import {API_URL} from "../../config/api";
// noinspection JSAnnotator
export default class Home extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            etudiant : db.newUser(),
            codif: db.codif[0]
        }
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
    componentDidMount(){
        db.refresh();
        this.setState({etudiant: db.newUser() , codif: db.codif[0]});
    }
    render() {
        return (
            <BackgroundImageHome>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.styless}
                    onPress={()=> {
                        if(db.userJSON.hasCodified){
                            Alert.alert(
                                "Attention",
                                "Vous avez deja reserve une chambre",
                                [
                                    {text: 'Supprimer cette reservation', onPress: () => {
                                        fetch(API_URL + "/codifications/" + this.state.codif.id , {
                                            method: 'DELETE',
                                            headers: {
                                                Accept: 'application/json',
                                            }
                                        }).then(res=>res.json()).then(result => {
                                            if(result.count> 0 ) {
                                                db.supprcodifier();
                                                db.userJSON.hasCodified = false ;
                                                this.props.navigation.navigate("Batiment",{return : false});
                                            }
                                            else alert("Erreur, Veuillez Reesayer Plus Tard")
                                        } )
                                    }},
                                    {text: 'Annuler', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                ],
                                { cancelable: false }
                            )
                        }
                        else {
                            this.props.navigation.navigate("Batiment",{return: false});
                        }
                    }  }
                    >
                        <Image
                            style={styles.button}
                            resizeMode="stretch"
                            source={require('../../components/list-2389219_960_720.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=> {
                            this.props.navigation.navigate("Liste")
                        } }
                    >
                        <Image
                            style={styles.button}
                            resizeMode="stretch"
                            source={require('../../components/306458.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            if(db.userJSON.hasCodified === false){
                                Alert.alert(
                                    "Codififiez vous d'abdord",
                                    "Pour pouvoir echanger il faut avoir une chambre réservée"
                                )
                                return;
                            }
                            else {
                                if(db.userJSON.hasEchRec === true){
                                    this.props.navigation.navigate("VfEx");
                                }
                                else if (db.userJSON.hasEchReq === true){
                                    Alert.alert(
                                        "Impossible d'echanger",
                                        "Vous avez deja fait une demande d'echange",
                                        [
                                            {text:"Supprimer cette demande" , onPress : () => {
                                                fetch(API_URL + "/echangeCodes/suppr" , {
                                                    method: 'DELETE',
                                                    headers: {
                                                        Accept: 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        id : db.userJSON.id,
                                                        type: "emit"
                                                    })
                                                }).then(res=>res.json()).then(result => {
                                                    if(result.deleted) {
                                                        db.doneEchange();
                                                        db.userJSON.hasEchReq = false ;
                                                    }
                                                    else alert("Erreur, Veuillez Reesayer Plus Tard")
                                                } )
                                            } },
                                            {text: "Annuler", onPress: ()=> {console.log("Annuler")}},
                                            { cancelable: false }
                                        ]
                                        )

                                }
                                else{
                                    this.props.navigation.navigate("Echange");
                                }
                            }
                        }  }
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
        height: 155,
        width: 155,
    },
    styless:{
        backgroundColor: "transparent",

    }
});
