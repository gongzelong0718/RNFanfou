import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack";
import WelcomePage from "~/biz/welcome/WelcomePage";
import WebPage from "~/global/components/page/WebPage";
import PictureViewPage from '~/global/components/page/PictureViewPage';
import LoginPage from "~/biz/user/login/LoginPage";
import MainPage from "~/biz/main/MainPage";
import React from "react";
import ComposePage from "~/biz/compose/ComposePage";

const RootNavigator = createStackNavigator({
        WelcomePage: {
            screen: WelcomePage
        },
        WebPage: {
            screen: WebPage
        },
        PictureViewPage: {
            screen: PictureViewPage
        },
        LoginPage: {
            screen: LoginPage
        },
        MainPage: {
            screen: MainPage
        },
        ComposePage: {
            screen: ComposePage
        }
    }, {
        defaultNavigationOptions: {
            header: null,// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
        },
    }
);
export const AppContainer = createAppContainer(RootNavigator)
