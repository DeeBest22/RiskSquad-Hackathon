// VideoDeviceManager.ts - Universal version for Web and Native Apps (Capacitor/Cordova)
// Works in: Web browsers, Claude artifacts, Capacitor apps, Cordova apps
// CAPACITOR FIX: Enhanced support for camera switching in WebView

export interface VideoDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
  isDefault?: boolean;
  facingMode?: 'user' | 'environment' | undefined;
}

// Platform detection helper - enhanced for Capacitor
const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for Capacitor (most common)
  const capacitor = (window as any).Capacitor;
  if (capacitor) {
    const isNative = capacitor.isNativePlatform?.() || capacitor.isNative;
    console.log('📱 Capacitor detected, isNative:', isNative);
    return isNative;
  }
  
  // Check for Cordova
  if ((window as any).cordova) {
    console.log('📱 Cordova detected');
    return true;
  }
  
  // Check for Android WebView
  const userAgent = navigator.userAgent || '';
  if (/wv/.test(userAgent) && /Android/.test(userAgent)) {
    console.log('📱 Android WebView detected');
    return true;
  }
  
  return false;
};

// Check if device is iOS
const isIOSDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Check if device is Android
const isAndroidDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

// Storage abstraction - uses localStorage in native apps, in-memory for web artifacts
class PreferenceStorage {
  private memoryStorage: { [key: string]: string } = {};
  private useLocalStorage: boolean;

  constructor() {
    this.useLocalStorage = typeof localStorage !== 'undefined';
    try {
      if (this.useLocalStorage) {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
      }
    } catch (e) {
      this.useLocalStorage = false;
    }
    console.log(`📱 Storage mode: ${this.useLocalStorage ? 'localStorage' : 'in-memory'}`);
  }

  getItem(key: string): string | null {
    if (this.useLocalStorage) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage failed, falling back to memory:', e);
        this.useLocalStorage = false;
        return this.memoryStorage[key] || null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  setItem(key: string, value: string): void {
    if (this.useLocalStorage) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn('localStorage failed, falling back to memory:', e);
        this.useLocalStorage = false;
      }
    }
    this.memoryStorage[key] = value;
  }

  removeItem(key: string): void {
    if (this.useLocalStorage) {
      try {
        localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn('localStorage failed, falling back to memory:', e);
        this.useLocalStorage = false;
      }
    }
    delete this.memoryStorage[key];
  }
}

class VideoDeviceManager {
  private selectedDeviceId: string = '';
  private devices: VideoDevice[] = [];
  private deviceChangeListeners: Set<(devices: VideoDevice[]) => void> = new Set();
  private cameraChangeListeners: Set<(deviceId: string) => void> = new Set();
  private currentFacingMode: 'user' | 'environment' = 'user';
  private storage: PreferenceStorage;
  private isNative: boolean;
  private isIOS: boolean;
  private isAndroid: boolean;
  private currentStream: MediaStream | null = null;

  constructor() {
    this.storage = new PreferenceStorage();
    this.isNative = isNativeApp();
    this.isIOS = isIOSDevice();
    this.isAndroid = isAndroidDevice();
    
    console.log(`🎥 VideoDeviceManager initialized`, {
      isNative: this.isNative,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      platform: this.isNative ? 'Native App' : 'Web'
    });
    
    this.loadPreferences();
    
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        console.log('🔄 Device change detected');
        this.refreshDevices();
      });
    }
  }

  private loadPreferences() {
    try {
      const savedDevice = this.storage.getItem('video-device-id');
      const savedFacingMode = this.storage.getItem('video-facing-mode');
      
      if (savedDevice) {
        this.selectedDeviceId = savedDevice;
        console.log('📋 Loaded saved device:', savedDevice);
      }
      
      if (savedFacingMode) {
        this.currentFacingMode = savedFacingMode as 'user' | 'environment';
        console.log('📋 Loaded saved facing mode:', savedFacingMode);
      }
    } catch (e) {
      console.warn('Failed to load video preferences:', e);
    }
  }

  private savePreferences() {
    try {
      this.storage.setItem('video-device-id', this.selectedDeviceId);
      this.storage.setItem('video-facing-mode', this.currentFacingMode);
      console.log('💾 Saved preferences:', {
        deviceId: this.selectedDeviceId,
        facingMode: this.currentFacingMode
      });
    } catch (e) {
      console.warn('Failed to save video preferences:', e);
    }
  }

  async initialize(): Promise<VideoDevice[]> {
    try {
      console.log('🎥 Initializing video device manager...');
      
      // Request permission first with a simple constraint
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: this.isNative ? { facingMode: 'user' } : true 
      });
      
      this.currentStream = stream;
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        console.log('📹 Initial video track settings:', {
          deviceId: settings.deviceId,
          facingMode: settings.facingMode,
          width: settings.width,
          height: settings.height,
          label: videoTrack.label
        });
        
        if (settings.deviceId) {
          this.selectedDeviceId = settings.deviceId;
        }
        
        if (settings.facingMode) {
          this.currentFacingMode = settings.facingMode as 'user' | 'environment';
          console.log('✅ Detected facing mode from stream:', this.currentFacingMode);
        } else {
          const label = videoTrack.label.toLowerCase();
          if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
            this.currentFacingMode = 'environment';
          } else if (label.includes('front') || label.includes('user') || label.includes('face')) {
            this.currentFacingMode = 'user';
          }
          console.log('📋 Inferred facing mode from label:', this.currentFacingMode);
        }
      }
      
      stream.getTracks().forEach(track => track.stop());
      this.currentStream = null;

      const devices = await this.refreshDevices();
      console.log(`✅ Video device manager initialized with ${devices.length} device(s)`);
      return devices;
    } catch (error) {
      console.error('Failed to initialize video devices:', error);
      throw error;
    }
  }

  async refreshDevices(): Promise<VideoDevice[]> {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter(d => d.kind === 'videoinput');
      
      console.log('📹 Found', videoInputs.length, 'video input device(s)');
      
      this.devices = videoInputs.map((device, index) => {
        const label = device.label.toLowerCase();
        let facingMode: 'user' | 'environment' | undefined;
        
        if (label.includes('front') || label.includes('user') || label.includes('facetime') || label.includes('face') || label.includes('selfie')) {
          facingMode = 'user';
        } else if (label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('main')) {
          facingMode = 'environment';
        }

        const deviceInfo = {
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
          kind: device.kind,
          isDefault: device.deviceId === 'default' || index === 0,
          facingMode,
        };
        
        console.log(`  📷 Device ${index + 1}: ${deviceInfo.label}${deviceInfo.facingMode ? ` (${deviceInfo.facingMode})` : ''}`);
        
        return deviceInfo;
      });

      this.deviceChangeListeners.forEach(listener => listener(this.devices));

      if (!this.selectedDeviceId && this.devices.length > 0) {
        this.selectedDeviceId = this.devices[0].deviceId;
        this.savePreferences();
        console.log('🎯 Selected default device:', this.devices[0].label);
      }

      return this.devices;
    } catch (error) {
      console.error('Failed to refresh video devices:', error);
      return [];
    }
  }

  async selectDevice(deviceId: string): Promise<void> {
    const previousDeviceId = this.selectedDeviceId;
    this.selectedDeviceId = deviceId;
    this.savePreferences();
    
    const device = this.devices.find(d => d.deviceId === deviceId);
    console.log('🎯 Selected device:', device?.label || deviceId);
    
    if (previousDeviceId !== deviceId) {
      this.cameraChangeListeners.forEach(listener => listener(deviceId));
    }
  }

  getSelectedDeviceId(): string {
    return this.selectedDeviceId;
  }

  getCurrentFacingMode(): 'user' | 'environment' {
    return this.currentFacingMode;
  }

  setCurrentFacingMode(mode: 'user' | 'environment') {
    console.log('🔄 Setting facing mode to:', mode);
    this.currentFacingMode = mode;
    this.savePreferences();
  }

  hasMultipleCameras(): boolean {
    // For native apps, always assume multiple cameras
    if (this.isNative) {
      console.log('📱 Native app detected - assuming multiple cameras available');
      return true;
    }
    
    if (this.isMobileDevice()) {
      console.log('📱 Mobile device detected - assuming multiple cameras available');
      return true;
    }
    
    const detectedMultiple = this.devices.length > 1;
    console.log(`🔍 Has multiple cameras: ${detectedMultiple} (${this.devices.length} detected)`);
    return detectedMultiple;
  }

  private isMobileDevice(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    return this.isIOS || this.isAndroid;
  }

  getNextCameraDeviceId(): string | null {
    if (this.devices.length <= 1) {
      console.log('⚠️ Only one camera detected (may be WebView limitation)');
      return null;
    }

    const currentIndex = this.devices.findIndex(d => d.deviceId === this.selectedDeviceId);
    const nextIndex = (currentIndex + 1) % this.devices.length;
    const nextDevice = this.devices[nextIndex];
    
    console.log(`🔄 Next camera: ${nextDevice.label} (index ${nextIndex})`);
    return nextDevice.deviceId;
  }

  getCameraByFacingMode(mode: 'user' | 'environment'): VideoDevice | null {
    const camera = this.devices.find(d => d.facingMode === mode);
    
    if (camera) {
      console.log(`📷 Found ${mode} camera:`, camera.label);
    } else {
      console.log(`⚠️ No ${mode} camera found in device list`);
    }
    
    return camera || null;
  }

  async switchCameraWithFacingMode(targetFacingMode: 'user' | 'environment'): Promise<MediaStream | null> {
    console.log(`📱 Attempting camera switch to ${targetFacingMode} using facingMode constraint...`);
    
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: targetFacingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    };
    
    try {
      console.log('📹 Trying with ideal facingMode constraint...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        const actualFacingMode = settings.facingMode as 'user' | 'environment' | undefined;
        
        console.log('📹 Got video track:', {
          label: videoTrack.label,
          facingMode: actualFacingMode,
          deviceId: settings.deviceId
        });
        
        if (actualFacingMode) {
          this.currentFacingMode = actualFacingMode;
        } else {
          const label = videoTrack.label.toLowerCase();
          if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
            this.currentFacingMode = 'environment';
          } else if (label.includes('front') || label.includes('user')) {
            this.currentFacingMode = 'user';
          } else {
            this.currentFacingMode = targetFacingMode;
          }
        }
        
        if (settings.deviceId) {
          this.selectedDeviceId = settings.deviceId;
        }
        
        this.savePreferences();
        console.log(`✅ Successfully switched to ${this.currentFacingMode} camera`);
        return stream;
      }
    } catch (idealError) {
      console.warn('⚠️ Ideal facingMode failed, trying exact constraint...', idealError);
      
      try {
        const exactStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: targetFacingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        const videoTrack = exactStream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          this.currentFacingMode = targetFacingMode;
          if (settings.deviceId) {
            this.selectedDeviceId = settings.deviceId;
          }
          this.savePreferences();
          console.log(`✅ Got camera with exact facingMode: ${targetFacingMode}`);
          return exactStream;
        }
      } catch (exactError) {
        console.error('❌ Exact facingMode also failed:', exactError);
      }
    }
    
    return null;
  }

  async toggleCamera(): Promise<string | null> {
    console.log('🔄 Toggling camera...');
    console.log('Current state:', {
      deviceId: this.selectedDeviceId,
      facingMode: this.currentFacingMode,
      availableCameras: this.devices.length,
      isNative: this.isNative,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid
    });
    
    const targetMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
    console.log(`🎯 Target facing mode: ${targetMode}`);
    
    // For native/mobile, use facingMode approach
    if (this.isNative || this.isMobileDevice()) {
      console.log(`📱 Using facingMode approach for ${this.isNative ? 'native app' : 'mobile device'}`);
      this.currentFacingMode = targetMode;
      this.savePreferences();
      return 'use-facing-mode';
    }
    
    // For desktop web: try to use device ID if we have multiple cameras
    if (this.devices.length > 1) {
      const targetCamera = this.getCameraByFacingMode(targetMode);
      
      if (targetCamera) {
        await this.selectDevice(targetCamera.deviceId);
        this.currentFacingMode = targetMode;
        this.savePreferences();
        console.log(`✅ Selected ${targetMode} camera by device ID`);
        return targetCamera.deviceId;
      }
      
      const nextDeviceId = this.getNextCameraDeviceId();
      if (nextDeviceId) {
        await this.selectDevice(nextDeviceId);
        this.currentFacingMode = targetMode;
        this.savePreferences();
        console.log('✅ Cycled to next camera device');
        return nextDeviceId;
      }
    }
    
    console.log('⚠️ Falling back to facingMode constraint approach');
    this.currentFacingMode = targetMode;
    this.savePreferences();
    return 'use-facing-mode';
  }

  isNativeApp(): boolean {
    return this.isNative;
  }

  isIOSApp(): boolean {
    return this.isIOS;
  }

  isAndroidApp(): boolean {
    return this.isAndroid;
  }

  onDeviceChange(callback: (devices: VideoDevice[]) => void): () => void {
    this.deviceChangeListeners.add(callback);
    return () => {
      this.deviceChangeListeners.delete(callback);
    };
  }

  onCameraChange(callback: (deviceId: string) => void): () => void {
    this.cameraChangeListeners.add(callback);
    return () => {
      this.cameraChangeListeners.delete(callback);
    };
  }

  getDevices(): VideoDevice[] {
    return this.devices;
  }

  clearPreferences(): void {
    this.storage.removeItem('video-device-id');
    this.storage.removeItem('video-facing-mode');
    console.log('🗑️ Cleared video preferences');
  }
}

export const videoDeviceManager = new VideoDeviceManager();
