// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen';
import ImageGeneratorScreen from './screens/ImageGeneratorScreen';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
    {/* // <MainStack.Navigator screenOptions={{ headerShown: true }}> */}
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <MainStack.Screen name="ImageGenerator" component={ImageGeneratorScreen} />
    </MainStack.Navigator>
  );
}

export const AuthContext = React.createContext();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('userToken');
    } catch (e) {
      console.error('Failed to get token', e);
    }
    setUserToken(token);
    setIsLoading(false);
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        setUserToken(data);
        await AsyncStorage.setItem('userToken', data);
      },
      signOut: async () => {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
      },
    }),
    []
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {userToken == null ? (
            <RootStack.Screen name="Auth" component={AuthStackScreen} />
          ) : (
            <RootStack.Screen name="Main" component={MainStackScreen} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}