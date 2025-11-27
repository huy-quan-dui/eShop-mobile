import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import React from 'react'
import { router } from 'expo-router';

const OnBoardingScreen = () => {
    const handleGetStarted = () => {
        router.replace("/login");
    }

    return (
        <View style={styles.container}>
            {/* Image background start */}
            <Image
                style={styles.backgroundImage}
                source={require("@/assets/img/onboard/onboarding.png")} />

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}
            />
            {/* Image background end */}

            {/* Content container start  */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>welcome to  Shop</Text>
                <Text style={styles.subtitle}>Smart shopping experience, modern style.</Text>
                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <LinearGradient
                        colors={['#FF6B6B', '#4A66F0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            {/* Content container end  */}
        </View>
    )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width, height, position: "absolute",
        top: 0, left: 0, resizeMode: "cover",
    },
    overlay: {
        position: "absolute",
        right: 0, left: 0, bottom: 0,
        height: height * 0.9
    },
    contentContainer: {
        flex: 1, justifyContent: "flex-end",
        alignItems: "center", paddingBottom: 50,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 10,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: "#FFF",
        marginBottom: 30,
        textAlign: "center",
        opacity: 0.8
    },
    button: {
        width: "100%",
        marginTop: 20,
        borderRadius: 10,
        overflow: "hidden"
    },

    buttonGradient: {
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    }

})


export default OnBoardingScreen