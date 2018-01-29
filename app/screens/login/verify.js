import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {Button, FormLabel, FormInput} from "react-native-elements";
import Camera from "react-native-camera"
import {Loading} from "../../components/loading";
export default class Verify extends Component<{}> {
    constructor(props){
        super(props);
        this.state = {
            email: "",
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
                <FormLabel>E-Mail</FormLabel>
                <FormInput
                    value={this.state.email}
                    keyboardType="email-address"
                    onChangeText={(text) => this.setState({email: text})}
                />
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
    verify(){
        if(!this.state.loading) return this.setState({loading: true});
        fetch("http://192.168.1.15:3000/api/etudiants/verifierCode",{
            method: 'POST',
                headers: {
                Accept: 'application/json',
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                code: this.state.code
            }),
        }).then((response) => response.json()).then((responseJson) => {
                 if(responseJson){
                    alert("Code Vérifié avec Succès. Vous pouvez vous connecter");
                    this.props.navigation.goBack();
                    }
                 else {
                    alert("Mauvais Code");
                    this.setState({loading:false})
                    }
        }).catch((error) => {
                alert("Mauvais E-mail. Cet e-mail n'existe pas.");
                this.setState({loading:false})
                console.error(error);
            });
}

    qrread(e){
        const qr = JSON.parse(e.data);
        this.setState({code : qr.code, email: qr.email, qr: false, loading: true, done:true});
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
        padding: 40,
        backgroundColor: '#fff',
        flex: 1,
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