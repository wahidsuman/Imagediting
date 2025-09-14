import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RNCamera} from 'react-native-camera';

const CameraScreen = ({navigation, route}) => {
  const {onImageCaptured} = route.params;
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.8,
          base64: false,
          skipProcessing: true,
        };
        
        const data = await cameraRef.current.takePictureAsync(options);
        
        if (onImageCaptured) {
          onImageCaptured(data.uri);
        }
        
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
        console.error('Camera error:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.on
        : RNCamera.Constants.FlashMode.off
    );
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <View style={styles.cameraOverlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Take Pill Photo</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleFlash}>
              <Icon
                name={flashMode === RNCamera.Constants.FlashMode.off ? 'flash-off' : 'flash-on'}
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>
              Position the pill in the center of the frame
            </Text>
            <Text style={styles.instructionsSubtext}>
              Make sure the pill is clearly visible and well-lit
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => navigation.goBack()}>
              <Icon name="image" size={24} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraType}>
              <Icon name="flip-camera-android" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionsSubtext: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#3B82F6',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
  },
});

export default CameraScreen;