import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Button,
    BackHandler,
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {AppContext} from '../../../Contexts.js';

export default class Camera extends Component {

    static contextType = AppContext;

    constructor(props){
        super(props);

        this.promises = [];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        for (let prom of this.promises){
            // Cancel any pending promises on unmount.
            prom.cancel();
        }
    }

    handleBackButtonClick(){
        this.props.toggleCamera();
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
            <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.on}
                androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
                }}
            />
            <View
                style={styles.capture}>
                <TouchableOpacity
                    onPress={this.props.takePicture.bind(this)}
                    style={styles.capture}>
                        <Text> Mark Attendence </Text>
                </TouchableOpacity>
            </View>
            <Button
                onPress={() => this.props.toggleCamera()}
                title="Close Camera"
                style={styles.capture}
            />
            </View>
        );
    }
}

let styles = {
    switchLoginMode: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'right',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
    },
    verticalRightLayout:{
        flexDirection: 'column',
    },
    capture: {
        flex: 0,
        backgroundColor: '#0f0',
        borderRadius: 5,
        padding: 0,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
};
