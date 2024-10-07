// HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { AuthContext } from '../App';
import { useNavigation } from '@react-navigation/native';

const services = [
  { id: 1, title: "Code Assistant (Qwen2.5B)", description: "AI-powered coding help" },
  { id: 2, title: "Image Generation", description: "Create images with Stable Diffusion" },
  { id: 3, title: "SEO Optimizer", description: "Enhance your website's visibility" },
  { id: 4, title: "Web Scraper", description: "Extract data from websites efficiently" },
];

export default function HomeScreen() {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  const navigateToService = (serviceTitle) => {
    navigation.navigate('ServiceDetails', { title: serviceTitle });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Explore Services</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
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