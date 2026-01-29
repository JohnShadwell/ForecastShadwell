/* Comment
  This app is designed to track the user's path over time and deliver information such as the route they took, the total distance, the time, and the average speed. The app works in real time to deliver the most realistic experience possible, with the goal of mimicking a real tracking app.

  Capabilities/Extra behavior
   - App tracks the time the user spends traveling and uses this information to calculate the user's average speed over the route.
   - App works in real time. Instead of placing markers to identify a route before starting, the user simply starts the app and it tracks their movement for them. This got rid of the need for markers, which is why they are absent in my project.
   - User has the ability to pause or reset their route at any time. Pausing stops the timer and prevents the route from being updated, while reseting sets the time, distance, speed, and coordinates back to their initial state.
   - Map is formatted to follow the user's location. Though this behaviour is not directly supported for android on the mapView documentation, I decided to implement it myself. Furthermore, since the map is centered on the user location, I decided to disable all scrolling or zooming made by the user. All map updates are made automatically.

   Limitations
   - When the app first opens, there is a short period of time in which the location seems to not update properly. Annoyingly, this messes up data such as the total distance travelled and average speed, which are otherwise accurate. Also, the specificity of the user location is generally poor, so distance measurements may not be completely accurate over small distances. This is because the "exact" user location is reliant on the callback from Google/Apple maps, and is really only an estimate of the user's position
   - When pressing the "start run" button, the app takes a few moments to load and update. This is just lag and has a minimal effect on performance.
   - On very rare occasions (only happened once to me), the app does not update the user location at all. Resetting the route fixed the issue.
   - The user can "cheat" by pausing the timer, moving their location, and unpausing. This will make them teleport, which they can't do in real life. Technically, I could have added a way to check if the user is teleporting by setting a "maximum" distance that can be travelled in a set time. However, this seemed unnecessary and impractical overall, so I left the behavior as is.






*/ 


import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Location from 'expo-location';

export default function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  const [distance, setDistance] = useState(0);
  const [appOpened, setAppOpened] = useState(false);
  const [active, setActive] = useState(false);
  const [ms, setMs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      updateRoute(currentLocation.coords);
    })();
  }, []);

useEffect(() => {
        if (active)
        {
        const timer = setInterval(() => {
            if (ms == 9)
            {
              getSpeed();
              setMs(0);
              setSeconds(seconds + 1);
              if (seconds == 59)
              {
                setSeconds(0);
                setMinutes(minutes + 1);
                if (minutes == 59)
                {
                  setMinutes(0);
                  setHours(hours + 1);
                }
              }
            }
            else setMs(ms + 1);
        }, 79);
        return () => clearInterval(timer);
        }
        else {
          if (!appOpened)
          {
            setMs(0);
            setSeconds(0);
            setMinutes(0);
            setHours(0);
          }
        }
    }, [ms, active])

  function getDistance(d1, d2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(d2.latitude-d1.latitude);  // deg2rad below
    var dLon = deg2rad(d2.longitude-d1.longitude);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(d1.latitude)) * Math.cos(deg2rad(d2.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // Distance in m
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function getSpeed() {
    let time = (hours*3600) + (minutes*60) + seconds;
    setSpeed(distance/time);
  }

  function reset() {
    setCoordinates([]);
    setLocation({latitude: 0, longitude: 0});
    setDistance(0);
    setAppOpened(false);
    setActive(false);
  }

  const updateRoute = (currentLocation) => {
    if (active) {
      let tempList = [...coordinates, currentLocation];
      let d = getDistance(location, currentLocation);
      setCoordinates(tempList);
      if(appOpened){
      setDistance(distance + d);
      }
      setLocation(currentLocation);
      setAppOpened(true);
      console.log(coordinates);
      console.log(distance)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        onUserLocationChange={(e) => updateRoute(e.nativeEvent.coordinate)}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
          }}
        >
        <Polyline
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="#000"
        />
      </MapView>
      </View>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>Distance: {Math.floor(distance)} m</Text>
      </View>
      <View style={styles.buttonContainer}>
      {appOpened ? (
        <View style={styles.placeholderContainer}>
        <View style={styles.statContainer}>
        <Text style={styles.statText}>Time: {hours}h {minutes}m {seconds}s</Text>
        <Text style={styles.statText}>Avg Speed: {speed.toFixed(2)} m/s</Text>
        </View>
          <TouchableOpacity style={styles.button} onPress={() => setActive(!active)}>
        <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => reset()}>
        <Text style={styles.buttonText}>Reset Run</Text>
        </TouchableOpacity>
        </View>
          ) : (
          <TouchableOpacity style={styles.button} onPress={() => setActive(true)}>
        <Text style={styles.buttonText}>Start Run</Text>
        </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fefae0',
    padding: 8,
    borderWidth: 2,
  },
  placeholderContainer: {
    hieght: '80%',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statContainer: {
    height: '20%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  map: {
    height: '100%',
    backgroundColor: '#ecf0f1',
  },
  mapContainer: {
    height: "55%",
    justifyContent: 'center',
    backgroundColor: '#e9edc9',
    padding: 8,
    borderWidth: 2,
    borderColor: "#001d3d",
  },
  buttonContainer: {
    height: "20%",
    justifyContent: 'center',
    backgroundColor: '#e9edc9',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#001d3d",
  },
  distanceContainer: {
    height: "10%",
    justifyContent: 'center',
    backgroundColor: '#ccd5ae',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#001d3d",
  },
  button: {
    height: "30%",
    width: "40%",
    backgroundColor: "#d4a373",
    borderWidth: 1,
    borderColor: "#001d3d",
    justifyContent: "center",
    alignItems: 'center',
  },
  distanceText: {
    fontSize: RFValue(30),
    fontWeight: 300,
  },
  buttonText: {
    fontSize: RFValue(18),
    fontWeight: 200,
  },
  statText: {
    fontSize: RFValue(14),
    fontWeight: 200,
  },
});
