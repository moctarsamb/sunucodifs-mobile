import React, { Component } from "react";
import { StackNavigator } from "react-navigation";

import Home from "../screens/home/home";
import Batiment from "../screens/home/batiment";
import Codification from "../screens/home/codification";
import Echange from "../screens/home/echange";
import Liste from "../screens/home/liste";
import VfEx from "../screens/home/verifyEchange";

// Login

import Login from "../screens/login/login";
import SignUp from "../screens/login/signup";
import Recover from "../screens/login/recover";
import Verify from "../screens/login/verify";

let HomeCard = StackNavigator({
    Home: {
        screen: Home
    },
    Batiment: {
        screen: Batiment
    },
    Echange: {
        screen: Echange
    },
    Liste: {
        screen: Liste
    },
    VfEx: {
        screen: VfEx
    },
});
export const homeStack = StackNavigator(
    {
        HomeC: {
            screen: HomeCard
        },
        Codification: {
            screen: Codification,
            navigationOptions: {
                gesturesEnabled: false
            }
        }
    },
    {
        mode: "modal",
        headerMode: "none"
    }
);
export const loginStack = StackNavigator({
    Login: {
        screen: Login
    },
    SignUp: {
        screen: SignUp
    },
    Recover: {
        screen: Recover
    },
    Verify: {
        screen: Verify
    }
},
    {
        headerMode: "none"
});

export const Tabs = (signedIn = false) => {
    return StackNavigator(
        {
            HomeL: {
                screen: homeStack,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
            LoginL: {
                screen: loginStack,
                navigationOptions: {
                    gesturesEnabled: false
                }
            }
        },
        {
            initialRouteName: signedIn? "HomeL":"LoginL",
            mode: "modal",
            headerMode: "none"
        }
    );
};
