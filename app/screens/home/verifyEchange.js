import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {Button, FormLabel, FormInput} from "react-native-elements";
import Camera from "react-native-camera"
import {Loading} from "../../components/loading";
import {API_URL} from "../../config/api";
import * as db from "../../db";
export default class VefEx extends Component {
    constructor(props){
        super(props);
        this.state = {
            etudiant: db.userJSON,
            code: "",
            qr: false,
            done: false,
            loading: false
        }
    }
    render() {
        if(this.state.loading){
            return(
                <Loading />
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.head} >
                    <Text style={styles.headText} > Vous avez reçu une demande d'echange </Text>
                </View>
                <FormLabel>Code</FormLabel>
                <FormInput
                    value={this.state.code}
                    onChangeText={(text) => this.setState({code: text})}
                />
                <Button
                    style={styles.button}
                    title="Verifier"
                    backgroundColor="#0066ff"
                    onPress={()=> this.verify() }
                />
                <Button
                    style={styles.button}
                    title="Annuler Echange"
                    backgroundColor="#ff6600"
                    onPress={()=> this.cancel() }
                />
                <CameraShow
                    show={!this.state.done}
                    onPress={()=> this.setState({qr : !this.state.qr})}
                />
                <View style={styles.camera} >
                    <CameraQr
                        show={this.state.qr}
                        action={this.qrread.bind(this)}
                    />

                </View>
            </View>
        );
    }
    cancel() {
        fetch(API_URL + "/echangeCodes/suppr" , {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                id : db.userJSON.id,
                type: "rec"
            })
        }).then(res=>res.json()).then(result => {
            if(result.deleted ) {
                db.doneEchange();
                db.userJSON.hasEchRec = false ;
                this.props.navigation.goBack();
            }
            else alert("Erreur, Veuillez Reesayer Plus Tard")
        } )
    }
    verify(){
        if(!this.state.loading)  this.setState({loading: true});
         fetch(API_URL + "/codifications/echange",{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idRec: this.state.etudiant.id,
                code: this.state.code
            }),
        }).then((response) => response.json()).then((responseJson) => {
            if(responseJson){
                alert("Echange Effectué avec succés");
                db.refresh();
                this.props.navigation.goBack();
            }
            else {
                alert("Mauvais Code");
                this.setState({loading:false})
            }
        }).catch((error) => {
            alert("Mauvais Code. Ce code n'existe pas.");
            this.setState({loading:false})
            console.error(error);
        });
    }

    qrread(e){
        const qr = JSON.parse(e.data);
        this.setState({code : qr.code, qr: false, loading: true, done:true});
        this.verify();
    }

}
const CameraShow = props => {
    if(props.show){
        return(
            (
                <Button
                    style={styles.button}
                    title="QR CODE"
                    backgroundColor="#0066ff"
                    onPress={props.onPress}
                />)
        )
    }
    return ( <Text></Text> )

}

const CameraQr = props => {
    if(props.show){
        return(
            <Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                style={styles.preview}
                onBarCodeRead={props.action.bind(this)}
                aspect={Camera.constants.Aspect.fill}>
            </Camera>
        )
    }
    return ( <Text></Text> )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    head:{
        height: 35,
        backgroundColor: "#0066ff",
        justifyContent: "center",
        alignItems: "center",

    },
    headText: {
        color: "#fff"
    },
    input: {
        padding: 20,
        height: 40,
        color: "#000",
    },
    button: {
        margin: 10,
        padding: 10,
        width: "auto"
    },
    camera: {
        margin: 10,
        width: 300,
        height: 300
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});