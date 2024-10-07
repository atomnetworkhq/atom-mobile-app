import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ServiceDetailsScreen({ route }) {
  const { title } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  const ws = useRef(null);
//   const [recognizing, setRecognizing] = useState(false);
//   const [transcript, setTranscript] = useState("");
  useEffect(() => {

    connectWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);


  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem('userToken');
    
    ws.current = new WebSocket('ws://atom.atomnetwork.xyz:8799', [], {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (e) => {
      const response = JSON.parse(e.data);
      const formattedOutput = formatOutput(response.output_text);
      setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: formattedOutput, sender: 'bot' }]);
      setIsLoading(false);
    };

    ws.current.onerror = (e) => {
      console.error('WebSocket error:', e);
      setIsLoading(false);
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };
  };

  const formatOutput = (text) => {
    return text.replace(/\\n/g, '\n').trim();
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ text: inputText }));
    } else {
      console.error('WebSocket is not connected.');
      setIsLoading(false);
    }

    setInputText('');
  };
//   useSpeechRecognitionEvent("start", () => setRecognizing(true));
//   useSpeechRecognitionEvent("end", () => setRecognizing(false));
//   useSpeechRecognitionEvent("result", (event) => {
//     setTranscript(event.results[0]?.transcript);
//   });
//   useSpeechRecognitionEvent("error", (event) => {
//     console.log("error code:", event.error, "error messsage:", event.message);
//   });

//   const handleStart = async () => {
//     const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
//     if (!result.granted) {
//       console.warn("Permissions not granted", result);
//       return;
//     }
//     // Start speech recognition
//     ExpoSpeechRecognitionModule.start({
//       lang: "en-US",
//       interimResults: true,
//       maxAlternatives: 1,
//       continuous: false,
//       requiresOnDeviceRecognition: false,
//       addsPunctuation: false,
//       contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
//     });
//   };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          {messages.map(message => (
            <View key={message.id} style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.botMessage
            ]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask your query..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Feather name="send" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.micButton}>
                        <Feather name="mic" size={24} color="#007AFF" />
          </TouchableOpacity>
          {/* {!recognizing ? (
                        <TouchableOpacity onPress={handleStart} style={styles.micButton}>
                        <Feather name="mic" size={24} color="#007AFF" />
                        </TouchableOpacity>
            ) : (

                <TouchableOpacity onPress={ExpoSpeechRecognitionModule.stop} style={styles.micButton}>
                <Feather name="mic" size={24} color="#007AFF" />
            </TouchableOpacity> 
      )} */}
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#121212',
  },
  titleContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Extra padding for Android
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: '#fff',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
  micButton: {
    marginLeft: 10,
    padding: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});