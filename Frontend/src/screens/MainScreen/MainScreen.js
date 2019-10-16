import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {RNCamera} from 'react-native-camera';

export default class MainScreen extends Component {
    constructor(){
        super();
        this.state = {
            openCamera: false,
            renderAttendence: false
        };
    }
    onLogoutPress(){
        this.props.changeState({
            isLoggedIn: false,
            mode: 'anonymous',
        });
    }

    toggleCamera(){
        let currentCameraState = this.state.openCamera;
        this.setState({
            openCamera: !currentCameraState,
        });
    }

    takePicture = async () => {
        if (this.camera) {
            const options = {quality: 0.5, base64: true};
            const data = await this.camera.takePictureAsync(options);
            console.log(data.uri);
        }
    };

    seeAttendenceRecords(){
      this.setState({renderAttendence: true});
    }

    renderAttendenceList(list, keys){
      return (<ScrollView style={{padding: 20}}>
        {
          list.forEach((element, ind) => {
            this.renderRow(element, keys[ind]);
          })
        }
      </ScrollView>);
    }

    renderRow(row, key) {
        return (
            <View key={key} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
              {
                row.map((element, ind) => {
                  console.log(element);
                  return (<View key={ind} style={{ flex: 1, alignSelf: 'stretch' }}>
                    {element}
                  </View>);
                })
              }
            </View>
        );
    }

    render() {

        let attendenceData = [
          ['Roll No.', 'Name', '% Attendence'],
          ['B17009', 'Arpit', 91],
          ['B17035', 'Ankit', 87],
          ['B17037', 'Atyant', 83],
          ['B17070', 'Yash', 91],
          ['B17076', 'Aniket', 92],
        ];

        let attKeys = [
          'B17009',
          'B17035',
          'B17037',
          'B17070',
          'B17076',
        ];

        return (
              this.props.currentState.mode === 'user' ? <Text> user </Text> :
                this.state.openCamera ?
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
                        onPress={this.takePicture.bind(this)}
                        style={styles.capture}>
                        <Text> Mark Attendence </Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                      onPress={() => this.toggleCamera()}
                      title="Close Camera"
                      style={styles.capture}
                    />
                  </View> : this.state.renderAttendence ?
                  this.renderAttendenceList(attendenceData, attKeys) :
                  <ScrollView style={{padding: 20}}>
                    <Button
                      onPress={() => this.toggleCamera()}
                      title="Open Camera To Mark Attendence"
                    />
                    <View style={{margin:20}} />
                    <Button
                      onPress={() => this.seeAttendenceRecords()}
                      title="See Attendence Records"
                    />
                    <View style={{margin:20}} />
                    <Button
                        onPress={() => this.onLogoutPress()}
                        title="Logout"
                    />
                  </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});