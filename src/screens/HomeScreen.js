import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
    Button,
    Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 시, 구, 동 데이터
const siObj = [
    {
        short: '서울',
        long: '서울특별시',
    },
    {
        short: '부산',
        long: '부산광역시',
    },

    {
        short: '인천',
        long: '인천광역시',
    },
    {
        short: '강원',
        long: '강원도',
    },
    {
        short: '대전',
        long: '대전광역시',
    },
    {
        short: '세종',
        long: '세종특별자치시',
    },
    {
        short: '충남',
        long: '충청남도',
    },
    {
        short: '충북',
        long: '충청북도',
    },
    {
        short: '울산',
        long: '울산광역시',
    },
    {
        short: '경남',
        long: '경상남도',
    },
    {
        short: '경북',
        long: '경상북도',
    },
    {
        short: '대구',
        long: '대구광역시',
    },
    {
        short: '광주',
        long: '광주광역시',
    },
    {
        short: '전남',
        long: '전라남도',
    },
    {
        short: '전북',
        long: '전라북도',
    },
    {
        short: '제주',
        long: '제주특별자치도',
    },
];

const siGuList = [
    {
        si: '서울특별시',
        gu: [
            '강남구',
            '강북구',
            '강동구',
            '강서구',
            '관악구',
            '광진구',
            '구로구',
            '금천구',
            '노원구',
            '도봉구',
            '동대문구',
            '동작구',
            '마포구',
            '서대문구',
            '서초구',
            '성동구',
            '성북구',
            '송파구',
            '양천구',
            '영등포구',
            '용산구',
            '은평구',
            '종로구',
            '중구',
            '중랑구',
        ],
    },

    {
        si: '인천광역시',
        gu: [
            '강화군',
            '계양구',
            '남동구',
            '동구',
            '미추홀구',
            '부평구',
            '서구',
            '연수구',
            '옹진군',
            '중구'
        ],
    },
    {
        si: '강원도',
        gu: [
            '강릉시',
            '고성군',
            '동해시',
            '삼척시',
            '속초시',
            '양구군',
            '양양군',
            '영월군',
            '원주시',
            '인제군',
            '정선군',
            '철원군',
            '춘천시',
            '태백시',
            '평창군',
            '홍천군',
            '화천군',
            '횡성군',
        ],
    },
    {
        si: '대전광역시',
        gu: ['대덕구', '동구', '서구', '유성구', '중구'],
    },
    {
        si: '세종특별자치시',
        gu: ['세종시'],
    },
    {
        si: '충청남도',
        gu: [
            '계룡시',
            '공주시',
            '금산군',
            '논산시',
            '당진시',
            '보령시',
            '부여군',
            '서산시',
            '서천군',
            '아산시',
            '예산군',
            '천안시 동남구',
            '천안시 서북구',
            '청양군',
            '태안군',
            '홍성군',
        ],
    },
    {
        si: '충청북도',
        gu: [
            '괴산군',
            '단양군',
            '보은군',
            '영동군',
            '옥천군',
            '음성군',
            '제천시',
            '증평군',
            '진천군',
            '청주시 상당구',
            '청주시 서원구',
            '청주시 청원구',
            '청주시 흥덕구',
            '충주시',
        ],
    },
    {
        si: '부산광역시',
        gu: [
            '강서구',
            '금정구',
            '기장군',
            '남구',
            '동구',
            '동래구',
            '부산진구',
            '북구',
            '사상구',
            '사하구',
            '서구',
            '수영구',
            '연제구',
            '영도구',
            '중구',
            '해운대구'
        ],
    },
    {
        si: '울산광역시',
        gu: ['남구', '동구', '북구', '울주군', '중구'],
    },
    {
        si: '경상남도',
        gu: [
            '거제시',
            '거창군',
            '고성군',
            '김해시',
            '남해군',
            '밀양시',
            '사천시',
            '산청군',
            '양산시',
            '의령군',
            '진주시',
            '창녕군',
            '창원시 마산합포구',
            '창원시 마산회원구',
            '창원시 성산구',
            '창원시 의창구',
            '창원시 진해구',
            '통영시',
            '하동군',
            '함안군',
            '함양군',
            '합천군',
        ],
    },
    {
        si: '경상북도',
        gu: [
            '경산시',
            '경주시',
            '고령군',
            '구미시',
            '군위군',
            '김천시',
            '문경시',
            '봉화군',
            '상주시',
            '성주군',
            '안동시',
            '영덕군',
            '영양군',
            '영주시',
            '영천시',
            '예천군',
            '울릉군',
            '울진군',
            '의성군',
            '청도군',
            '청송군',
            '칠곡군',
            '포항시 남구',
            '포항시 북구',
        ],
    },
    {
        si: '대구광역시',
        gu: ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    },
    {
        si: '광주광역시',
        gu: ['광산구', '남구', '동구', '북구', '서구'],
    },
    {
        si: '전라남도',
        gu: [
            '강진군',
            '고흥군',
            '곡성군',
            '광양시',
            '구례군',
            '나주시',
            '담양군',
            '목포시',
            '무안군',
            '보성군',
            '순천시',
            '신안군',
            '여수시',
            '영광군',
            '영암군',
            '완도군',
            '장성군',
            '장흥군',
            '진도군',
            '함평군',
            '해남군',
            '화순군',
        ],
    },
    {
        si: '전라북도',
        gu: [
            '고창군',
            '군산시',
            '김제시',
            '남원시',
            '무주군',
            '부안군',
            '순창군',
            '익산시',
            '임실군',
            '장수군',
            '전주시 덕진구',
            '전주시 완산구',
            '정읍시',
            '진안군'
        ],
    },
    {
        si: '제주특별자치도',
        gu: ['서귀포시', '제주시'],
    },
];
const locationData = {
    '서울특별시 종로구 사직동': { latitude: 37.575650779448786, longitude: 126.97688884274817 },
    '서울특별시 종로구 삼청동': { latitude: 37.5950655194224, longitude: 126.98268938649305 },
    '서울특별시 종로구 부암동': { latitude: 37.59656422224409, longitude: 126.97585113775686 },
    '울산광역시 남구 ': { latitude: 35.5437, longitude: 129.3307 }
    // 필요한 다른 동네의 좌표를 추가합니다.
};
const HomeScreen = ({ navigation }) => {
    const mapRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSi, setSelectedSi] = useState('');
    const [selectedGu, setSelectedGu] = useState('');

    const [guList, setGuList] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [location, setLocation] = useState(null);

    useEffect(() => {
        getMyLocation();
    }, []);

    const getMyLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            console.log('😀 position =====> ', location.coords);
        } catch (error) {
            console.error('Error getting location', error);
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleTouchSi = (e) => {
        setSelectedSi(e);
        const getGu = siGuList.filter((item) => item.si === e.long);
        setGuList(getGu[0].gu);
        setSelectedGu('');
    };

    const handleTouchGu = async (e) => {
        setSelectedGu(e);
        closeModal();
        console.log(`선택된 시군구: ${selectedSi.long} ${e}`);

        const selectedLocationKey = `${selectedSi.long} ${e}`;
        const selectedLocation = locationData[selectedLocationKey];

        if (selectedLocation) {
            const newRegion = {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setRegion(newRegion);
            mapRef.current.animateToRegion(newRegion, 1000);

            const locationCoor = {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                address: `${selectedSi.long} ${e}`,
            };

            try {
                const jsonValue = JSON.stringify(locationCoor);
                await AsyncStorage.setItem('currentLocation', jsonValue);
                console.log('Location saved to AsyncStorage:', jsonValue);
            } catch (error) {
                console.error('Error saving location', error);
            }
        } else {
            Alert.alert('해당 위치의 위도와 경도 정보를 찾을 수 없습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openModal} style={styles.button}>
                <Text style={styles.buttonText}>주소 설정</Text>
            </TouchableOpacity>
            <Text>선택된 주소: {selectedSi.long} {selectedGu}</Text>

            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Current Location"
                        description="You are here"
                    />
                )}
            </MapView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>시를 선택하세요:</Text>
                        <View style={styles.row}>
                            <ScrollView style={styles.column}>
                                {siObj.map((e, i) => (
                                    <Pressable
                                        key={i}
                                        style={e.short === selectedSi.short ? styles.onSelectSi : styles.offSelectSi}
                                        onPress={() => handleTouchSi(e)}
                                    >
                                        <Text
                                            allowFontScaling={false}
                                            style={e.short === selectedSi.short ? styles.onSelectSiText : styles.offSelectSiText}
                                        >
                                            {e.short}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <ScrollView style={styles.column}>
                                {guList.map((e, i) => (
                                    <Pressable
                                        key={i}
                                        style={styles.DoWrapper}
                                        onPress={() => handleTouchGu(e)}
                                    >
                                        <Text
                                            allowFontScaling={false}
                                            style={e === selectedGu ? styles.onSelectDo : styles.offSelectDo}
                                        >
                                            {e}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                        <Button title="완료" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    onSelectSi: {
        backgroundColor: '#4AABFF',
        paddingVertical: 9,
        paddingHorizontal: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: '#C3C3C3',
    },
    offSelectSi: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 9,
        paddingHorizontal: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: '#C3C3C3',
    },
    onSelectSiText: {
        fontSize: 12,
        lineHeight: 20,
        color: '#FFF',
        textAlign: 'center',
    },
    offSelectSiText: {
        fontSize: 12,
        lineHeight: 20,
        color: '#888',
        textAlign: 'center',
    },
    DoWrapper: {
        paddingVertical: 9,
        paddingHorizontal: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#C3C3C3',
    },
    onSelectDo: {
        fontSize: 13,
        lineHeight: 20,
        color: '#4AABFF',
        textAlign: 'center',
    },
    offSelectDo: {
        fontSize: 13,
        lineHeight: 20,
        color: '#888',
        textAlign: 'center',
    },
});

export default HomeScreen;