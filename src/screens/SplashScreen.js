import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

const SplashScreenComponent = ({ navigation }) => {
    useEffect(() => {
        const prepare = async () => {
            try {
                // 여기에 앱 준비 로직을 추가합니다 (예: 토큰 확인)
                await new Promise(resolve => setTimeout(resolve, 2000)); // 예시로 2초 대기
            } catch (e) {
                console.warn(e);
            } finally {
                SplashScreen.hideAsync(); // 준비가 완료되면 스플래시 화면을 숨깁니다
                navigation.replace('Home'); // 홈 화면으로 이동
            }
        };

        prepare();
    }, [navigation]);

    return (
        <View style={styles.container}>

            <Text style={styles.text}>Eco Trade</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 200,
    },
    text: {
        marginTop: 20,
        fontSize: 24,
        color: '#000',
    },
});

export default SplashScreenComponent;
