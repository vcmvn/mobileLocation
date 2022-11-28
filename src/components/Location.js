import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import React, {Component, useEffect, useState, useRef} from 'react';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
const Location = () => {
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [data, setData] = useState();
  const [locationData, setLocationData] = useState();
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationError, setLocationError] = useState('');
  const onCheckLocationPermission = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestLocationPermission() {
        try {
          // Request Location Permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          setData(granted);
          setLocationData(PermissionsAndroid.RESULTS.GRANTED)
          console.log('granted===>' + granted);
          console.log(
            'grantedPermission==>' + PermissionsAndroid.RESULTS.GRANTED,
          );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            Alert.alert(
              '',
              'Permission Granted',
              [
                {
                  text: 'OK',
                  // onPress: () => goToNextScreen()
                },
              ],
              {
                cancelable: false,
              },
            );
          } else {
            if (Platform.OS == 'android') {
              Alert.alert(
                'Permission Required',
                'Access to the Location is necessary in the app. Please give access to the Location from the settings, Settings=>App=>Location Permissions',
                [
                  {text: 'OK', style: 'cancel'},

                  {
                    text: 'Settings',
                    onPress: () => Linking.openSettings(),
                  },
                ],
              );
            }
            //If app is running in ios device
            else if (Platform.OS == 'ios') {
              Alert.alert(
                'Permission Required',
                'Access to the Location is necessary in the app. Please give access to the Location from the settings, Settings=>App=>Location Permissions',
                [
                  {text: 'OK', style: 'cancel'},
                  {
                    text: 'Settings',
                    onPress: () => Linking.openURL('app-settings:'),
                  },
                ],
              );
            }
          }
        } catch (err) {
          alert('Location permission err', err);
          console.warn(err);
        }
      }
     
      // Calling the Location permission function
      requestLocationPermission();
    } else if ((Platform.OS = 'ios')) {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(response => {
        console.log('Error responce is ', response);
        if (response == 'granted') {
          Alert.alert(
            '',
            'Login successfull',
            [{text: 'OK', style: 'cancel'}],
            {
              cancelable: false,
            },
          );
        } else {
          if (Platform.OS == 'android') {
            Alert.alert(
              'Permission Required',
              'Access to the Location is necessary in the app. Please give access to the Location from the settings, Settings=>App=>Location Permissions',
              [
                {text: 'OK', style: 'cancel'},

                {
                  text: 'Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
          //If app is running in ios device
          else if (Platform.OS == 'ios') {
            Alert.alert(
              'Permission Required',
              'Access to the Location is necessary in the app. Please give access to the Location from the settings, Settings=>App=>Location Permissions',
              [
                {text: 'OK', style: 'cancel'},
                {
                  text: 'Settings',
                  onPress: () => Linking.openURL('app-settings:'),
                },
              ],
            );
          }
        }
      });
    }
  };
  const startTime = useRef(new Date());
  const endTime = useRef(new Date());
  const sendRequestWithLocation = async () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      
      position => {
        startTime.current = new Date();
        console.log("data"+data)
        console.log("data2"+locationData)
        console.log('startTime====>' + startTime.current);
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        console.log('Longitude===> ' + currentLongitude);
        setCurrentLatitude(currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        // alert('Latitude: ' + currentLatitude)
        console.log('Latitude===> ' + currentLatitude);
        endTime.current = new Date();
        console.log('endTime====>' + endTime.current);
        const et = (startTime.current - endTime.current) / 1000; // get the seconds
        console.log('TotalTime===>' + et + 'ms');
        setCurrentLongitude(currentLatitude);
      },
      error => setLocationError(error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  return (
    <View
      style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 50,
        }}>
        <View>
          <TouchableOpacity
            onPress={() => onCheckLocationPermission()}
            style={{
              height: 50,
              justifyContent: 'center',
              // backgroundColor: 'blue',
            }}>
            <Text>Get location permission</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 90, }}>
          {data !== "" && data!== undefined && data!== null && data === locationData ? (
            <TouchableOpacity onPress={() => sendRequestWithLocation()}>
              <Text>Get Lat/Long</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled >
              <Text>Give permission first</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Location;
