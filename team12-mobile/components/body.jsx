import { View, Image, Alert, TouchableOpacity, SafeAreaView, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { images } from "../constants/images";
import React, { useState } from 'react';

const Body = ({ question, onAnswer }) => {

    const [selected, setSelected] = useState('');
    const [front, setFront] = useState(true);

    const screenWidth = Dimensions.get('window').width;

    const imageWidth = screenWidth * 0.6;
    const imageHeight = imageWidth * (920 / 450);

    const offset = imageHeight * 0.01;

    const frontbody = [
        { name: 'Head', position: { top: imageHeight * 0.012 - offset, left: imageWidth * 0.43, width: imageWidth * 0.2, height: imageHeight * 0.055 } },
        { name: 'Face', position: { top: imageHeight * 0.07 - offset, left: imageWidth * 0.43, width: imageWidth * 0.2, height: imageHeight * 0.07 } },
        { name: 'Neck', position: { top: imageHeight * 0.15 - offset, left: imageWidth * 0.48, width: imageWidth * 0.1, height: imageHeight * 0.06 } },
        { name: 'Shoulders', position: { top: imageHeight * 0.198 - offset, left: imageWidth * 0.25, width: imageWidth * 0.55, height: imageHeight * 0.05 } },
        { name: 'Chest', position: { top: imageHeight * 0.22 - offset, left: imageWidth * 0.4, width: imageWidth * 0.3, height: imageHeight * 0.08 } },
        { name: 'Abdomin', position: { top: imageHeight * 0.31 - offset, left: imageWidth * 0.4, width: imageWidth * 0.28, height: imageHeight * 0.12 } },
        { name: 'Left Arm', position: { top: imageHeight * 0.23 - offset, left: imageWidth * 0.2, width: imageWidth * 0.12, height: imageHeight * 0.3 } },
        { name: 'Right Arm', position: { top: imageHeight * 0.23 - offset, left: imageWidth * 0.72, width: imageWidth * 0.12, height: imageHeight * 0.3 } },
        { name: 'Left Hand', position: { top: imageHeight * 0.53 - offset, left: imageWidth * 0.12, width: imageWidth * 0.15, height: imageHeight * 0.06 } },
        { name: 'Right Hand', position: { top: imageHeight * 0.53 - offset, left: imageWidth * 0.76, width: imageWidth * 0.15, height: imageHeight * 0.06 } },
        { name: 'Hips', position: { top: imageHeight * 0.44 - offset, left: imageWidth * 0.39, width: imageWidth * 0.3, height: imageHeight * 0.08 } },
        { name: 'Left Leg', position: { top: imageHeight * 0.55 - offset, left: imageWidth * 0.4, width: imageWidth * 0.1, height: imageHeight * 0.32 } },
        { name: 'Right Leg', position: { top: imageHeight * 0.55 - offset, left: imageWidth * 0.558, width: imageWidth * 0.1, height: imageHeight * 0.32 } },
        { name: 'Left Foot', position: { top: imageHeight * 0.9 - offset, left: imageWidth * 0.4, width: imageWidth * 0.1, height: imageHeight * 0.08 } },
        { name: 'Right Foot', position: { top: imageHeight * 0.9 - offset, left: imageWidth * 0.54, width: imageWidth * 0.1, height: imageHeight * 0.08 } },
    ];

    const backbody = [
        { name: 'Head', position: { top: imageHeight * 0.02 - offset, left: imageWidth * 0.43, width: imageWidth * 0.2, height: imageHeight * 0.12 } },
        { name: 'Neck', position: { top: imageHeight * 0.11 - offset, left: imageWidth * 0.47, width: imageWidth * 0.1, height: imageHeight * 0.06 } },
        { name: 'Shoulders', position: { top: imageHeight * 0.17 - offset, left: imageWidth * 0.25, width: imageWidth * 0.55, height: imageHeight * 0.05 } },
        { name: 'Upper Back', position: { top: imageHeight * 0.22 - offset, left: imageWidth * 0.35, width: imageWidth * 0.35, height: imageHeight * 0.08 } },
        { name: 'Lower Back', position: { top: imageHeight * 0.31 - offset, left: imageWidth * 0.4, width: imageWidth * 0.26, height: imageHeight * 0.14 } },
        { name: 'Left Arm', position: { top: imageHeight * 0.23 - offset, left: imageWidth * 0.2, width: imageWidth * 0.12, height: imageHeight * 0.3 } },
        { name: 'Right Arm', position: { top: imageHeight * 0.23 - offset, left: imageWidth * 0.72, width: imageWidth * 0.12, height: imageHeight * 0.3 } },
        { name: 'Left Hand', position: { top: imageHeight * 0.53 - offset, left: imageWidth * 0.12, width: imageWidth * 0.15, height: imageHeight * 0.06 } },
        { name: 'Right Hand', position: { top: imageHeight * 0.53 - offset, left: imageWidth * 0.76, width: imageWidth * 0.15, height: imageHeight * 0.06 } },
        { name: 'Gluts', position: { top: imageHeight * 0.46 - offset, left: imageWidth * 0.39, width: imageWidth * 0.3, height: imageHeight * 0.08 } },
        { name: 'Back Left Leg', position: { top: imageHeight * 0.55 - offset, left: imageWidth * 0.4, width: imageWidth * 0.1, height: imageHeight * 0.32 } },
        { name: 'Back Right Leg', position: { top: imageHeight * 0.55 - offset, left: imageWidth * 0.558, width: imageWidth * 0.1, height: imageHeight * 0.32 } },
        { name: 'Left Ankle', position: { top: imageHeight * 0.9 - offset, left: imageWidth * 0.4, width: imageWidth * 0.1, height: imageHeight * 0.08 } },
        { name: 'Right Ankle', position: { top: imageHeight * 0.9 - offset, left: imageWidth * 0.54, width: imageWidth * 0.1, height: imageHeight * 0.08 } },
    ];
    //swap between back and front view 
    const swap = () => {
        setFront(!front);
        setSelected("");
        Alert.alert('Swapped', `${front ? 'Back' : 'Front'}`);
    };

    const handlePress = (part) => {
        setSelected(part);
        onAnswer(part);
        Alert.alert('Selected part:', part);
    };
    console.log("this is the question ", question.question)
    return (
        <SafeAreaView className="flex-1 justify-center " >
            <View>
                <Text className="text-4xl font-bold text-center mb-8">
                    {question.question}
                </Text>
            </View>
            <View className="flex-1 justify-center items-center bg-white">

                <View style={styles.relativeView}>
                    <Image
                        source={front ? images.m_front : images.m_back}
                        style={[styles.image, { width: imageWidth, height: imageHeight }]}
                    />
                    {(front ? frontbody : backbody).map((part, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.touchable, part.position, selected === part.name && styles.selected]}
                            onPress={() => handlePress(part.name)}
                        />
                    ))}
                </View>
                <View>
                    <Button title={`Swap to ${front ? 'Back' : 'Front'}`} onPress={swap} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    relativeView: {
        position: 'relative',
    },
    image: {
        resizeMode: 'contain',
    },
    touchable: {
        position: 'absolute',
        // backgroundColor: 'rgba(173, 216, 230, 0.5)',
        borderRadius: 8,
    },
    selected: {
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
    },
});

export default Body;