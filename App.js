import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import {Fontisto} from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "b26840678e8ce6ba0eb7158d1eb90a29";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {
      coords:{latitude, longitude},
    } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps:false}
    );
    setCity(location[0].district);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alrets&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    // console.log(json.daily);
    setDays(json.daily);
    // console.log("extrcted from API", location[0].region, location[0].district);
  }
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.city}>
        <Text style={styles.cityName}> {city} </Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator 
              color="black" 
              style={{marginTop: 10}}
              size="large"
            />
          </View> 
        ) : (
          days.map((day, index) => 
            <View key={index} style={styles.day}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={70} color="black"/>
              </View>
              <Text style={styles.weather}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )} 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 50,
    fontWeight: "500",
  },
  weather: {
    marginTop: -30,
    fontWeight: "300",
    fontSize: 60,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    // alignItems: "flex-start",
    // paddingHorizontal: 20,
  },
  temp: {
    marginTop: 40,
    fontWeight: "600",
    fontSize: 170,
  },
  description: {
    marginTop: -30,
    fontSize: 50,
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -10,
    fontSize: 20,
    fontWeight: "200",
  }
});