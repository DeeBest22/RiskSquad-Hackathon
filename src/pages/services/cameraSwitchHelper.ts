// cameraSwitchHelper.ts - Capacitor-optimized camera switching
// This helper provides robust camera switching for mobile WebRTC applications

export interface CameraSwitchResult {
  success: boolean;
  videoTrack?: MediaStreamTrack;
  facingMode?: 'user' | 'environment';
  deviceId?: string;
  error?: string;
}

/**
 * Capacitor-optimized camera switching that works reliably on mobile devices
 * This function handles the complexities of switching cameras in WebView environments
 */
export async function switchCameraCapacitorOptimized(
  currentStream: MediaStream
): Promise<CameraSwitchResult> {
  try {
    console.log('🔄 Starting camera switch...');
    
    // Get current video track
    const currentVideoTrack = currentStream.getVideoTracks()[0];
    if (!currentVideoTrack) {
      return {
        success: false,
        error: 'No video track found in current stream'
      };
    }

    // Get current settings
    const currentSettings = currentVideoTrack.getSettings();
    const currentFacingMode = currentSettings.facingMode as 'user' | 'environment' | undefined;
    
    console.log('📹 Current camera settings:', {
      facingMode: currentFacingMode,
      deviceId: currentSettings.deviceId,
      label: currentVideoTrack.label
    });

    // Determine target facing mode
    // If we can detect current facing mode, switch to opposite
    // Otherwise, try environment first (back camera), then user (front)
    let targetFacingMode: 'user' | 'environment';
    
    if (currentFacingMode === 'user') {
      targetFacingMode = 'environment';
    } else if (currentFacingMode === 'environment') {
      targetFacingMode = 'user';
    } else {
      // Can't detect current, try to infer from label
      const label = currentVideoTrack.label.toLowerCase();
      if (label.includes('front') || label.includes('user') || label.includes('face')) {
        targetFacingMode = 'environment';
      } else if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
        targetFacingMode = 'user';
      } else {
        // Default: assume front, switch to back
        targetFacingMode = 'environment';
      }
    }

    console.log('🎯 Target facing mode:', targetFacingMode);

    // CRITICAL: Stop the old track BEFORE requesting new one
    // This is essential in Capacitor to release the camera
    console.log('⏹️ Stopping current video track...');
    currentVideoTrack.stop();
    
    // Small delay to ensure camera is fully released (important on some Android devices)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Try to get new camera with target facing mode
    let newStream: MediaStream | null = null;
    let actualFacingMode: 'user' | 'environment' = targetFacingMode;

    // Strategy 1: Try with ideal facingMode (more permissive)
    try {
      console.log('📹 Attempting with ideal facingMode constraint...');
      newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      console.log('✅ Got stream with ideal constraint');
    } catch (idealError) {
      console.warn('⚠️ Ideal facingMode failed, trying exact...', idealError);
      
      // Strategy 2: Try with exact facingMode (stricter)
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: targetFacingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        console.log('✅ Got stream with exact constraint');
      } catch (exactError) {
        console.warn('⚠️ Exact facingMode also failed, trying opposite direction...', exactError);
        
        // Strategy 3: Try opposite direction (fallback)
        const fallbackMode = targetFacingMode === 'user' ? 'environment' : 'user';
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: fallbackMode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
          actualFacingMode = fallbackMode;
          console.log('✅ Got stream with fallback direction:', fallbackMode);
        } catch (fallbackError) {
          console.error('❌ All attempts failed:', fallbackError);
          
          // Strategy 4: Last resort - any video
          try {
            newStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            });
            console.log('✅ Got stream without facingMode constraint (last resort)');
          } catch (lastError) {
            return {
              success: false,
              error: `Failed to get camera: ${lastError}`
            };
          }
        }
      }
    }

    if (!newStream) {
      return {
        success: false,
        error: 'Failed to obtain new camera stream'
      };
    }

    // Get the new video track
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) {
      newStream.getTracks().forEach(t => t.stop());
      return {
        success: false,
        error: 'No video track in new stream'
      };
    }

    // Get actual settings from the new track
    const newSettings = newVideoTrack.getSettings();
    const detectedFacingMode = newSettings.facingMode as 'user' | 'environment' | undefined;
    
    // Use detected facing mode if available, otherwise use what we requested
    if (detectedFacingMode) {
      actualFacingMode = detectedFacingMode;
    } else {
      // Try to infer from label
      const newLabel = newVideoTrack.label.toLowerCase();
      if (newLabel.includes('back') || newLabel.includes('rear') || newLabel.includes('environment')) {
        actualFacingMode = 'environment';
      } else if (newLabel.includes('front') || newLabel.includes('user') || newLabel.includes('face')) {
        actualFacingMode = 'user';
      }
    }

    console.log('📹 New camera acquired:', {
      facingMode: actualFacingMode,
      detectedFacingMode: detectedFacingMode,
      deviceId: newSettings.deviceId,
      label: newVideoTrack.label,
      width: newSettings.width,
      height: newSettings.height
    });

    return {
      success: true,
      videoTrack: newVideoTrack,
      facingMode: actualFacingMode,
      deviceId: newSettings.deviceId
    };

  } catch (error) {
    console.error('❌ Camera switch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Alternative implementation using device enumeration
 * Use this if facingMode approach doesn't work on specific devices
 */
export async function switchCameraByDeviceId(
  currentStream: MediaStream
): Promise<CameraSwitchResult> {
  try {
    console.log('🔄 Switching camera by device ID...');
    
    const currentVideoTrack = currentStream.getVideoTracks()[0];
    if (!currentVideoTrack) {
      return { success: false, error: 'No video track' };
    }

    const currentDeviceId = currentVideoTrack.getSettings().deviceId;
    
    // Stop current track
    currentVideoTrack.stop();
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get all video devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    
    if (videoDevices.length < 2) {
      return { success: false, error: 'Only one camera available' };
    }

    // Find next device
    const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex];

    console.log('📹 Switching to:', nextDevice.label);

    // Get stream with specific device
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: nextDevice.deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    const newVideoTrack = newStream.getVideoTracks()[0];
    const settings = newVideoTrack.getSettings();

    return {
      success: true,
      videoTrack: newVideoTrack,
      facingMode: settings.facingMode as 'user' | 'environment',
      deviceId: settings.deviceId
    };

  } catch (error) {
    console.error('❌ Device ID switch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}