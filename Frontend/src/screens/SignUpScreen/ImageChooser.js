import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';

import {Button, Image} from 'react-native-elements';

/**
 * UI Component to show an image picker when the faculty is enrolling a student in some course.
 * This component applies to the faculties.
 */
import ImagePicker from 'react-native-image-picker';

export default class ImageChooser extends Component{

    constructor(props){

        super(props);

        this.state = {
            fileURI: '',
            fileBase64: '',
        };

        // Binding all the functions to current context so that they can be called
        // from the context of other components as well.
        this.confirmImage = this.confirmImage.bind(this);
        this.chooseImage = this.chooseImage.bind(this);
    }

    /**
     * Function which is called when the faculty proceeds to choose an image of the student who subjects
     * to the entered roll no.
     */
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

    /**
     * Function to confirm the chosen image by the faculty.
     */
    confirmImage(){
        this.props.setUserImage(this.state.fileBase64);
        this.setState({
            fileURI: '',
            fileBase64: '',
        });
    }

    render(){
        return (<ScrollView>
            <View>
                {this.state.fileBase64 !== '' ?
                    <>
                        <Image
                            source={{uri: this.state.fileBase64, height: 20, width: 20}}
                            style = {styles.images}
                        />
                        <View style={{margin:7}} />
                        <Button
                            title = "Confirm This Image"
                            onPress = {this.confirmImage}
                            type="outline"
                        />
                        <View style={{margin:7}} />
                    </> :
                    <></>
                }
                <Button
                    title = "Choose Image"
                    onPress = {this.chooseImage}
                    type="outline"
                    icon={{type:'antdesign', name: 'select1'}}
                />
            </View>
        </ScrollView>);
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
