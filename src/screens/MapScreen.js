import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = ({ route }) => {
    const mapRef = useRef(null);
    const [region, setRegion] = useState({
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [location, setLocation] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        getMyLocation();
    }, []);

    useEffect(() => {
        if (location) {
            setRegion({
                ...region,
                latitude: location.latitude,
                longitude: location.longitude,
            });

            fetchItems(location);
        }
    }, [location]);

    useEffect(() => {
        if (route.params?.selectedLocation) {
            const { latitude, longitude } = route.params.selectedLocation;
            const newRegion = {
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };
            setRegion(newRegion);
            mapRef.current.animateToRegion(newRegion, 1000);
        }
    }, [route.params?.selectedLocation]);

    const getMyLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
            console.log('😀 position =====> ', location.coords);
        } catch (error) {
            console.error('Error getting location', error);
        }
    };

    const fetchItems = (location) => {
        const allItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', latitude: 37.5665, longitude: 126.9780 },
            { id: '2', title: 'Item 2', description: 'Description 2', latitude: 37.5655, longitude: 126.9770 },
        ];

        const filteredItems = allItems.filter(item => {
            const distance = getDistance(
                location.latitude, location.longitude,
                item.latitude, item.longitude
            );
            return distance < 1000;
        });

        setItems(filteredItems);
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c * 1000;
        return d;
    };

    const zoomIn = () => {
        setRegion({
            ...region,
            latitudeDelta: region.latitudeDelta / 2,
            longitudeDelta: region.longitudeDelta / 2,
        });
    };

    const zoomOut = () => {
        setRegion({
            ...region,
            latitudeDelta: region.latitudeDelta * 2,
            longitudeDelta: region.longitudeDelta * 2,
        });
    };

    return (
        <View style={styles.container}>
            <MapView ref={mapRef} style={styles.map} region={region}>
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
                {items.map(item => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </MapView>
            <View style={styles.zoomButtons}>
                <TouchableOpacity onPress={zoomIn} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
            </View>
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
    zoomButtons: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'column',
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
});

export default MapScreen;
