// HomeScreen.js
import React, { useContext, useState,useEffect } from 'react';
import { Image,View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { AuthContext } from '../App';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

 function parseToken(token)  {
  // Retrieve the token from localStorage
  console.log('token',token)

  try {
    const [header, payload, signature] = token.split('.');

    // Decode the payload
    const decodedPayload = JSON.parse(atob(payload));
    
    return decodedPayload
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}
const services = [
  { id: 1, title: "Code Assistant (Qwen2.5B)", description: "AI-powered coding help" },
  { id: 2, title: "Image Generation", description: "Create images with Stable Diffusion" },
  { id: 3, title: "SEO Optimizer", description: "Enhance your website's visibility" },
  { id: 4, title: "Web Scraper", description: "Extract data from websites efficiently" },
];

export default function HomeScreen() {
  const [user,setUser]=useState({})
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  useEffect(() => {
    console.log(user)
    bootstrapAsync();
    console.log(user)
  }, []);

  const bootstrapAsync = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('userToken');
      // console.log(token)
      
      setUser(parseToken(token))
      
      
    } catch (e) {
      console.error('Failed to get token', e);
    }
    
    setIsLoading(false);
  };

  const navigateToService = (serviceTitle) => {
    // navigation.navigate('ServiceDetails', { title: serviceTitle });
  switch (serviceTitle) {
    case "Code Assistant (Qwen2.5B)":
      navigation.navigate('ServiceDetails', { title: serviceTitle });
      break;
    case "Image Generation":
      navigation.navigate('ImageGenerator', { title: serviceTitle });
      break;
    // case "SEO Optimizer":
    //   navigation.navigate('SEOOptimizerScreen');
    //   break;
    // case "Web Scraper":
    //   navigation.navigate('WebScraperScreen');
    //   break;
    default:
      console.error(`Service ${serviceTitle} not found.`);
  }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <Image
              source={require('../assets/atom-logo.png')} // Adjust the MIME type if necessary
              style={{ width: 40, height: 40 }} // Changed width and height
            />
          <Text style={styles.title}>Atom Network</Text>
        </View>
        <View style={styles.user_chip}>
          <Image source={require('../assets/user-default.jpg')} 
          style={styles.user_image}
          ></Image>
          <View style={styles.user_chip_right}>
            <Text style={styles.text_right}><Text style={styles.text_left}>User   </Text>{user ? user.username:'Bharath'}</Text>
            <Text style={styles.text_right}><Text style={styles.text_left}>Email   </Text>{user ? user.email:'bharath1234gowda@gmail.com'}</Text>
          </View>
        </View>
        <Text style={styles.welcome_text}>Services </Text>
        <ScrollView style={styles.serviceList}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              onPress={() => navigateToService(service.title)}
            >
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  user_chip:{display: 'flex', 
            flexDirection:'row',
          justifyContent:'flex-start',
          alignItems:'center',
          gap:10,
          backgroundColor:'#59558B',
          padding: 10,
          borderRadius: 10,
          },
  text_right:{color:'#ffffff',fontSize: 14},
  text_left:{color:'#ffffff',
    fontSize:10,marginRight:30
  },
  user_chip_right:{
    color:'#ffffff',
    fontSize:20
  },
  user_image:{
    width: 70,
    height:70,
    borderRadius:100,
    
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcome_text:{
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap:10,
    marginBottom:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'semi-bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceList: {
    flex: 1,
  },
  serviceItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});