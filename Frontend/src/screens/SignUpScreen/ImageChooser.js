import React, { Component } from 'react';
import {
    View,
    Button,
    StyleSheet,
    Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

export default class ImageChooser extends Component{

    constructor(props){

        super(props);

        this.state = {
            fileURI: '',
            fileBase64: '',
        };

        this.confirmImage = this.confirmImage.bind(this);
        this.chooseImage = this.chooseImage.bind(this);
    }

    chooseImage(){
        let options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            quality: 0.2,
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                this.setState({
                    fileURI: response.uri,
                    fileBase64: 'data:image/jpeg;base64,' + response.data,
                });
            }
        });
    }

    confirmImage(){
        this.props.setUserImage(this.state.fileBase64);
        this.setState({
            fileURI: '',
            fileBase64: '',
        });
    }

    render(){
        return (<>
            <View>
                {this.state.fileBase64 !== '' ?
                    <>
                        <Image
                            source={{uri: this.state.fileBase64, height: 20, width: 20}}
                            style = {styles.images}
                        />
                        <Button
                            title = "Confirm This Image"
                            onPress = {this.confirmImage}
                        />
                    </> :
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
