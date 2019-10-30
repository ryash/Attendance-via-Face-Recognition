import React, { Component } from 'react';
import {
    View,
    Button,
    StyleSheet,
    Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

export default class ImageChooser extends Component{

    constructor(){
        super();
        this.state = {
            fileURI: '',
            mode: '',
            fileBase64: '',
        };

        this.chooseImage = this.chooseImage.bind(this);
    }

    chooseImage(){
        let options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                this.setState({
                    fileURI: response.uri,
                    fileBase64: 'data:image/jpeg;base64,' + this.state.fileData,
                });
                this.props.setUserImage('data:image/jpeg;base64,' + response.data);
            }
        });
    }

    render(){
        return (<>
            <View>
                {this.state.fileBase64 !== '' ?
                    <Image
                        source={{uri: this.state.fileBase64}}
                        style = {styles.images}
                    /> :
                    <></>
                }
                <View style={{margin:7}} />
                <Button
                    title = "Choose Image"
                    onPress = {this.chooseImage}
                />
            </View>
        </>);
    }

    componentWillUnmount(){
        console.log('Component unmounted');
    }
}


let styles = StyleSheet.create({
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3,
      },
});
