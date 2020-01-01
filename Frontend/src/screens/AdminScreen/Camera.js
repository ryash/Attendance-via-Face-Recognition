import React, { Component } from 'react';
import {
    View,
    BackHandler,
    Platform,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    PermissionsAndroid,
    NativeEventEmitter,
    NativeModules,
    Button,
    FlatList,
    Alert,
    ActivityIndicator,
    TouchableOpacity 
} from 'react-native';
import { Camera, Permissions, FaceDetector, DangerZone } from 'expo';

import {RNCamera} from 'react-native-camera';
import {AppContext} from '../../../Contexts.js';
import {Button} from 'react-native-elements';

/**
 * UI component for the camera, which is rendered when faculty wants to
 * take attendance in any course.
 * This component applies to the faculties.
 */
export default class Camera extends Component {

    /**
     * Getting the current nearest context to get the data from.
     * This context will have id and token of the faculty to authenticate him on the server
     * along with other useful information.
     */
    static contextType = AppContext;

    constructor(props){
        super(props);

        this.state = {
            isLoading: false,
        };

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

    /**
     * Handler which is called when the user hits back button on his/her device
     */
    handleBackButtonClick(){
        this.props.toggleCamera();
        return true;
    }
    export default class MyCamera extends Component {
        constructor(props) {
          super(props);
          this.state = {
            cameraType: 'front',
            mirrorMode: false
          };
        }
    render() {
        return (
            <View style={styles.container}>
            <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                style={{ width: '100%', height: '100%' }}
                type={RNCamera.Constants.Type.front}
                onFacesDetected={this.onFacesDetected}
                flashMode={RNCamera.Constants.FlashMode.on}
                faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
                faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                
                androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
                }}
                captureAudio={false}

                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                    console.log(barcodes);
                    
            />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                </TouchableOpacity>
             </View>
            </View>
        );
    }
    takePicture = async() => {
        if (this.camera) 
        {
          const options = { quality: 0.5, base64: true };
          const data = await this.camera.takePictureAsync(options);
          console.log(data.uri);
        }
    
    };
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
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
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
