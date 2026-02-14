import { io, Socket } from 'socket.io-client';
import { audioDeviceManager } from './AudioDeviceManager';
import { videoDeviceManager } from './videoDeviceManager';
import { switchCameraCapacitorOptimized } from './cameraSwitchHelper';

export interface Participant {
  socketId: string;
  name: string;
  isHost?: boolean;
  isCoHost?: boolean;
  isMuted: boolean;
  isCameraOff?: boolean;
  isScreenSharing?: boolean;
  handRaised?: boolean;
  handRaisedAt?: number;
  stream?: MediaStream;
}

export interface MeetingPermissions {
  chatEnabled: boolean;
  fileSharing: boolean;
  emojiReactions: boolean;
  allowRename: boolean;
  allowUnmute: boolean;
  allowHandRaising: boolean;
  muteAllParticipants: boolean;
  allowScreenSharing: boolean;
}

export class WebRTCService {
  private socket: Socket | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private iceServers: RTCIceServer[] = [];
  private meetingId: string = '';
  private isHost: boolean = false;
  private pendingIceCandidates: Map<string, RTCIceCandidate[]> = new Map();
  private mySocketId: string = '';
  
  // Callbacks
  public onParticipantRenamed?: (data: { socketId: string; oldName: string; newName: string }) => void;
  public onParticipantJoined?: (participant: Participant) => void;
  public onParticipantLeft?: (socketId: string) => void;
  public onParticipantUpdated?: (participant: Participant) => void;
  public onRemoteStream?: (socketId: string, stream: MediaStream) => void;
  public onMeetingJoined?: (data: any) => void;
  public onMeetingError?: (message: string) => void;
  public onChatMessage?: (message: any) => void;
  public onReactionReceived?: (data: { emoji: string; participantName: string; socketId: string; timestamp: number }) => void;
  public onMeetingNameChanged?: (data: { meetingName: string; changedBy: string }) => void;
  public onMeetingLockChanged?: (data: { isLocked: boolean; changedBy: string }) => void;
  public onPermissionsUpdated?: (data: { permissions: MeetingPermissions; changedBy: string }) => void;
  public onRenamePermissionUpdated?: (data: { permissions: { allowRename: boolean }; changedBy: string }) => void;
  public onKickedFromMeeting?: () => void;
  public onForceMuted?: (data: { isMuted: boolean }) => void;
  public onParticipantKicked?: (data: { targetSocketId: string }) => void;

  connect(serverUrl: string = 'localhost:5000') {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.mySocketId = this.socket?.id || '';
      console.log('Connected to server:', this.mySocketId);
    });

    this.socket.on('participant-renamed', (data) => {
      console.log('Participant renamed:', data);
      if (this.onParticipantRenamed) {
        this.onParticipantRenamed({
          socketId: data.socketId,
          oldName: data.oldName,
          newName: data.newName,
        });
      }
    });

    this.socket.on('joined-meeting', (data) => {
      console.log('✅ Joined meeting:', data);
      this.iceServers = data.iceServers || [];
      this.meetingId = data.meetingId;
      this.isHost = data.isHost;
      this.mySocketId = this.socket?.id || '';
      
      console.log('📋 Meeting info:', {
        meetingId: this.meetingId,
        mySocketId: this.mySocketId,
        isHost: this.isHost,
        participantCount: data.participants?.length || 0
      });
      
      if (this.onMeetingJoined) {
        this.onMeetingJoined(data);
      }

      // Signal ready for connections after ensuring we have our socket ID
      setTimeout(() => {
        console.log('📡 Emitting participant-ready from:', this.mySocketId);
        this.socket?.emit('participant-ready');
      }, 500);
    });

    this.socket.on('meeting-error', (data) => {
      console.error('Meeting error:', data.message);
      if (this.onMeetingError) {
        this.onMeetingError(data.message);
      }
    });

    this.socket.on('participant-joined', (data) => {
      console.log('Participant joined:', data.participant);
      if (this.onParticipantJoined && data.participant) {
        this.onParticipantJoined(data.participant);
      }
    });

    this.socket.on('participant-left', (data) => {
      console.log('Participant left:', data.socketId);
      this.closePeerConnection(data.socketId);
      if (this.onParticipantLeft) {
        this.onParticipantLeft(data.socketId);
      }
    });

    this.socket.on('participant-updated', (data) => {
      console.log('Participant updated:', data.participant);
      if (this.onParticipantUpdated && data.participant) {
        this.onParticipantUpdated(data.participant);
      }
    });

    this.socket.on('peer-ready', (data) => {
      console.log('Peer ready:', data.socketId);
    });

    this.socket.on('initiate-connection', async (data) => {
      console.log('Initiate connection received:', data);
      const { targetSocketId, shouldCreateOffer, iceServers } = data;
      
      if (iceServers && iceServers.length > 0) {
        this.iceServers = iceServers;
      }
      
      await this.createPeerConnection(targetSocketId, shouldCreateOffer);
    });

    this.socket.on('offer', async (data) => {
      console.log('Received offer from:', data.sender);
      await this.handleOffer(data.sender, data.offer);
    });

    this.socket.on('answer', async (data) => {
      console.log('Received answer from:', data.sender);
      await this.handleAnswer(data.sender, data.answer);
    });

    this.socket.on('ice-candidate', async (data) => {
      console.log('Received ICE candidate from:', data.sender);
      await this.handleIceCandidate(data.sender, data.candidate);
    });

    this.socket.on('chat-message', (data) => {
      if (this.onChatMessage) {
        this.onChatMessage(data);
      }
    });

    this.socket.on('participant-audio-changed', (data) => {
      console.log('Participant audio changed:', data);
      if (this.onParticipantUpdated) {
        const participant = {
          socketId: data.socketId,
          isMuted: data.isMuted,
        } as Participant;
        this.onParticipantUpdated(participant);
      }
    });

    this.socket.on('participant-video-changed', (data) => {
      console.log('Participant video changed:', data);
      if (this.onParticipantUpdated) {
        const participant = {
          socketId: data.socketId,
          isCameraOff: data.isCameraOff,
        } as Participant;
        this.onParticipantUpdated(participant);
      }
    });

    this.socket.on('reaction-received', (data) => {
      console.log('Reaction received:', data);
      if (this.onReactionReceived) {
        this.onReactionReceived(data);
      }
    });

    // Handle meeting name changed
    this.socket.on('meeting-name-changed', (data) => {
      console.log('Meeting name changed:', data);
      if (this.onMeetingNameChanged) {
        // Server sends newName, we normalize to meetingName
        this.onMeetingNameChanged({
          meetingName: data.newName || data.meetingName,
          changedBy: data.changedBy
        });
      }
    });

    // Handle meeting lock changed
    this.socket.on('meeting-lock-changed', (data) => {
      console.log('Meeting lock changed:', data);
      if (this.onMeetingLockChanged) {
        this.onMeetingLockChanged(data);
      }
    });

    // Handle peer disconnection
    this.socket.on('peer-disconnected', (data) => {
      console.log('Peer disconnected:', data.socketId);
      this.closePeerConnection(data.socketId);
    });

    this.socket.on('restart-connection', async (data) => {
      console.log('⚠️ Server requested connection restart with:', data.targetSocketId);
      const { targetSocketId } = data;
      
      // Close existing connection
      this.closePeerConnection(targetSocketId);
      
      // Wait a bit before recreating
      setTimeout(async () => {
        console.log('🔄 Recreating connection with:', targetSocketId);
        // Let the server coordinate who should be the initiator
        this.socket?.emit('request-connection-restart', {
          targetSocketId: targetSocketId
        });
      }, 1000);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.cleanup();
    });

    // Handle being kicked from meeting
    this.socket.on('kicked-from-meeting', () => {
      console.log('❌ You have been kicked from the meeting');
      if (this.onKickedFromMeeting) {
        this.onKickedFromMeeting();
      }
      // Cleanup connections
      this.cleanup();
    });

    // Handle force mute by host
    this.socket.on('force-mute', (data) => {
      console.log('🔇 Force muted by host:', data.isMuted);
      if (this.onForceMuted) {
        this.onForceMuted(data);
      }
    });

    // Handle participant kicked (for other participants to see)
    this.socket.on('participant-kicked', (data) => {
      console.log('👤 Participant kicked:', data.targetSocketId);
      // Close peer connection with kicked participant
      this.closePeerConnection(data.targetSocketId);
      if (this.onParticipantKicked) {
        this.onParticipantKicked(data);
      }
    });

    // Handle participant muted by host (for updating UI)
    this.socket.on('participant-muted', (data) => {
      console.log('Participant muted by host:', data);
      if (this.onParticipantUpdated) {
        const participant = {
          socketId: data.targetSocketId,
          isMuted: data.isMuted,
        } as Participant;
        this.onParticipantUpdated(participant);
      }
    });
  }

  async joinAsHost(meetingId: string, hostName: string, userId?: string, meetingName?: string) {
    if (!this.socket) return;
    
    this.socket.emit('join-as-host', {
      meetingId,
      hostName,
      userId: userId || `user_${Date.now()}`,
      meetingName: meetingName,
    });
  }

  async joinMeeting(meetingId: string, participantName: string, userId?: string) {
    if (!this.socket) return;
    
    this.socket.emit('join-meeting', {
      meetingId,
      participantName,
      userId: userId || `user_${Date.now()}`,
    });
  }

  async getLocalStream(audio: boolean = true, video: boolean = true): Promise<MediaStream | null> {
    try {
      // Get audio settings from AudioDeviceManager
      const selectedMicId = audioDeviceManager.getSelectedDeviceId();
      const echoCancellation = audioDeviceManager.getEchoCancellation();
      const noiseSuppression = audioDeviceManager.getNoiseSuppression();
      const autoGainControl = audioDeviceManager.getAutoGainControl();
      
      // Get video settings from VideoDeviceManager
      const selectedCameraId = videoDeviceManager.getSelectedDeviceId();

      console.log('🎤 Getting local stream with audio device:', selectedMicId);
      console.log('📹 Getting local stream with video device:', selectedCameraId);
      console.log('📊 Audio settings:', { echoCancellation, noiseSuppression, autoGainControl });

      const audioConstraints: MediaTrackConstraints | boolean = audio ? {
        deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
        echoCancellation: echoCancellation,
        noiseSuppression: noiseSuppression,
        autoGainControl: autoGainControl
      } : false;
      
      const videoConstraints: MediaTrackConstraints | boolean = video ? {
        deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      } : false;

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: audioConstraints, 
        video: videoConstraints
      });

      this.localStream = stream;
      
      // Log actual track settings
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        const settings = audioTrack.getSettings();
        console.log('✅ Audio track acquired:', {
          deviceId: settings.deviceId,
          label: audioTrack.label,
          echoCancellation: settings.echoCancellation,
          noiseSuppression: settings.noiseSuppression,
          autoGainControl: settings.autoGainControl
        });
      }
      
      console.log('Got local stream:', stream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      
      // Fallback: try without exact device constraint
      if (audio) {
        console.log('⚠️ Retrying with fallback audio constraints...');
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: audioDeviceManager.getEchoCancellation(),
              noiseSuppression: audioDeviceManager.getNoiseSuppression(),
              autoGainControl: audioDeviceManager.getAutoGainControl()
            },
            video: video ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            } : false
          });
          this.localStream = fallbackStream;
          console.log('✅ Fallback stream acquired');
          return fallbackStream;
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }

  private async createPeerConnection(remoteSocketId: string, initiator: boolean) {
    // Don't create connection to ourselves
    if (remoteSocketId === this.mySocketId) {
      console.log('Skipping self-connection');
      return;
    }

    // Close existing connection if any
    if (this.peerConnections.has(remoteSocketId)) {
      console.log('Closing existing peer connection for:', remoteSocketId);
      const existingPc = this.peerConnections.get(remoteSocketId);
      existingPc?.close();
      this.peerConnections.delete(remoteSocketId);
    }

    console.log(`Creating peer connection with ${remoteSocketId}, initiator: ${initiator}`);

    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        ...(this.iceServers || [])
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    };

    const pc = new RTCPeerConnection(config);
    this.peerConnections.set(remoteSocketId, pc);

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        console.log(`➕ Adding local ${track.kind} track (enabled: ${track.enabled})`);
        try {
          const sender = pc.addTrack(track, this.localStream!);
          console.log(`✅ Track added successfully, sender:`, sender.track?.kind);
        } catch (error) {
          console.error(`❌ Error adding ${track.kind} track:`, error);
        }
      });
      console.log(`Total local tracks added: ${this.localStream.getTracks().length}`);
    } else {
      console.warn('⚠️ No local stream available to add tracks');
    }

    // Handle remote stream
    const remoteStream = new MediaStream();
    
    pc.ontrack = (event) => {
      console.log(`📥 Received ${event.track.kind} track from:`, remoteSocketId, {
        trackId: event.track.id,
        trackEnabled: event.track.enabled,
        trackReadyState: event.track.readyState,
        streams: event.streams.length
      });
      
      // Add track to remote stream
      if (!remoteStream.getTracks().find(t => t.id === event.track.id)) {
        remoteStream.addTrack(event.track);
        console.log(`✅ Added ${event.track.kind} track to remote stream`);
      }
      
      // Emit the stream when we have tracks
      if (this.onRemoteStream && remoteStream.getTracks().length > 0) {
        console.log(`🎥 Emitting remote stream for ${remoteSocketId} with ${remoteStream.getTracks().length} tracks`);
        this.onRemoteStream(remoteSocketId, remoteStream);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to:', remoteSocketId, 'Type:', event.candidate.type);
        this.socket?.emit('ice-candidate', {
          target: remoteSocketId,
          candidate: event.candidate.toJSON()
        });
      } else {
        console.log('ICE gathering complete for:', remoteSocketId);
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log(`ICE gathering state with ${remoteSocketId}:`, pc.iceGatheringState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${remoteSocketId}:`, pc.iceConnectionState);
      
      if (pc.iceConnectionState === 'failed') {
        console.error('ICE connection failed with:', remoteSocketId, '- attempting restart');
        // Notify backend about connection failure
        this.socket?.emit('connection-failed', {
          targetSocketId: remoteSocketId,
          reason: 'ice-failed'
        });
      }

      if (pc.iceConnectionState === 'disconnected') {
        console.warn('ICE connection disconnected with:', remoteSocketId, '- waiting for reconnection');
        // Give it 5 seconds to reconnect before attempting restart
        setTimeout(() => {
          if (pc.iceConnectionState === 'disconnected') {
            console.log('Still disconnected after 5s, attempting ICE restart');
            this.socket?.emit('connection-failed', {
              targetSocketId: remoteSocketId,
              reason: 'ice-disconnected'
            });
          }
        }, 5000);
      }

      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        console.log('✅ Successfully connected to:', remoteSocketId);
      }

      if (pc.iceConnectionState === 'closed') {
        console.log('ICE connection closed with:', remoteSocketId);
        this.closePeerConnection(remoteSocketId);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteSocketId}:`, pc.connectionState);
      
      if (pc.connectionState === 'failed') {
        console.error('❌ Connection failed with:', remoteSocketId);
        this.socket?.emit('connection-failed', {
          targetSocketId: remoteSocketId,
          reason: 'connection-failed'
        });
      }

      if (pc.connectionState === 'connected') {
        console.log('✅ Peer connection established with:', remoteSocketId);
      }

      if (pc.connectionState === 'closed') {
        console.log('Peer connection closed with:', remoteSocketId);
        this.closePeerConnection(remoteSocketId);
      }
    };

    // Initiator creates and sends offer
    if (initiator) {
      try {
        console.log('Creating offer for:', remoteSocketId);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          iceRestart: false
        });
        
        console.log('Setting local description for:', remoteSocketId);
        await pc.setLocalDescription(offer);
        
        console.log('Sending offer to:', remoteSocketId, 'SDP type:', offer.type);
        this.socket?.emit('offer', {
          target: remoteSocketId,
          offer: {
            type: offer.type,
            sdp: offer.sdp
          }
        });
      } catch (error) {
        console.error('Error creating/sending offer:', error);
        this.closePeerConnection(remoteSocketId);
      }
    } else {
      console.log('Waiting to receive offer from:', remoteSocketId);
    }

    // Process pending ICE candidates
    const pending = this.pendingIceCandidates.get(remoteSocketId);
    if (pending && pending.length > 0) {
      console.log(`Processing ${pending.length} pending ICE candidates for:`, remoteSocketId);
      for (const candidate of pending) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding pending ICE candidate:', error);
        }
      }
      this.pendingIceCandidates.delete(remoteSocketId);
    }
  }

  private async handleOffer(remoteSocketId: string, offer: RTCSessionDescriptionInit) {
    console.log('Handling offer from:', remoteSocketId, 'SDP type:', offer.type);
    
    let pc = this.peerConnections.get(remoteSocketId);
    
    // If we don't have a peer connection yet, create one
    if (!pc) {
      console.log('Creating new peer connection to handle offer from:', remoteSocketId);
      await this.createPeerConnection(remoteSocketId, false);
      pc = this.peerConnections.get(remoteSocketId);
    }

    if (!pc) {
      console.error('❌ Failed to create peer connection for:', remoteSocketId);
      return;
    }

    try {
      // Check if we already have a remote description
      if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-local-offer') {
        console.warn('Peer connection not in correct state:', pc.signalingState);
        // Reset the connection
        await this.createPeerConnection(remoteSocketId, false);
        pc = this.peerConnections.get(remoteSocketId);
        if (!pc) return;
      }

      console.log('Setting remote description (offer) for:', remoteSocketId);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description set for:', remoteSocketId);
      
      console.log('Creating answer for:', remoteSocketId);
      const answer = await pc.createAnswer();
      
      console.log('Setting local description (answer) for:', remoteSocketId);
      await pc.setLocalDescription(answer);
      console.log('✅ Local description set for:', remoteSocketId);
      
      console.log('Sending answer to:', remoteSocketId);
      this.socket?.emit('answer', {
        target: remoteSocketId,
        answer: {
          type: answer.type,
          sdp: answer.sdp
        }
      });
      console.log('✅ Answer sent to:', remoteSocketId);

      // Process any pending ICE candidates
      const pending = this.pendingIceCandidates.get(remoteSocketId);
      if (pending && pending.length > 0) {
        console.log(`Processing ${pending.length} pending ICE candidates for:`, remoteSocketId);
        for (const candidate of pending) {
          try {
            await pc.addIceCandidate(candidate);
            console.log('✅ Added pending ICE candidate');
          } catch (error) {
            console.error('Error adding pending ICE candidate:', error);
          }
        }
        this.pendingIceCandidates.delete(remoteSocketId);
      }
    } catch (error) {
      console.error('❌ Error handling offer from', remoteSocketId, ':', error);
      // Clean up and retry
      this.closePeerConnection(remoteSocketId);
    }
  }

  private async handleAnswer(remoteSocketId: string, answer: RTCSessionDescriptionInit) {
    console.log('Handling answer from:', remoteSocketId, 'SDP type:', answer.type);
    
    const pc = this.peerConnections.get(remoteSocketId);
    if (!pc) {
      console.error('❌ No peer connection found for answer from:', remoteSocketId);
      return;
    }

    try {
      if (pc.signalingState !== 'have-local-offer') {
        console.warn('⚠️ Unexpected signaling state:', pc.signalingState, 'for', remoteSocketId);
        return;
      }

      console.log('Setting remote description (answer) for:', remoteSocketId);
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log('✅ Remote description (answer) set for:', remoteSocketId);

      // Process any pending ICE candidates
      const pending = this.pendingIceCandidates.get(remoteSocketId);
      if (pending && pending.length > 0) {
        console.log(`Processing ${pending.length} pending ICE candidates for:`, remoteSocketId);
        for (const candidate of pending) {
          try {
            await pc.addIceCandidate(candidate);
            console.log('✅ Added pending ICE candidate');
          } catch (error) {
            console.error('Error adding pending ICE candidate:', error);
          }
        }
        this.pendingIceCandidates.delete(remoteSocketId);
      }
    } catch (error) {
      console.error('❌ Error handling answer from', remoteSocketId, ':', error);
    }
  }

  private async handleIceCandidate(remoteSocketId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(remoteSocketId);
    
    if (!pc) {
      console.log('⏳ Peer connection not ready, queueing ICE candidate for:', remoteSocketId);
      if (!this.pendingIceCandidates.has(remoteSocketId)) {
        this.pendingIceCandidates.set(remoteSocketId, []);
      }
      this.pendingIceCandidates.get(remoteSocketId)!.push(new RTCIceCandidate(candidate));
      return;
    }

    if (!pc.remoteDescription) {
      console.log('⏳ Remote description not set, queueing ICE candidate for:', remoteSocketId);
      if (!this.pendingIceCandidates.has(remoteSocketId)) {
        this.pendingIceCandidates.set(remoteSocketId, []);
      }
      this.pendingIceCandidates.get(remoteSocketId)!.push(new RTCIceCandidate(candidate));
      return;
    }

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('✅ Added ICE candidate for:', remoteSocketId, 'Type:', candidate.candidate?.split(' ')[7]);
    } catch (error) {
      console.error('❌ Error adding ICE candidate for', remoteSocketId, ':', error);
    }
  }

  toggleAudio(muted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
        console.log(`Audio track ${muted ? 'muted' : 'unmuted'}`);
      });
    }
    this.socket?.emit('toggle-mic', { isMuted: muted });
  }

  toggleVideo(cameraOff: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !cameraOff;
        console.log(`Video track ${cameraOff ? 'disabled' : 'enabled'}`);
      });
    }
    this.socket?.emit('toggle-camera', { isCameraOff: cameraOff });
  }

  renameParticipant(newName: string) {
    if (!this.socket) return;
    console.log('Emitting rename-participant with name:', newName);
    this.socket.emit('rename-participant', { newName });
  }

  sendChatMessage(message: string, senderName: string) {
    this.socket?.emit('chat-message', {
      text: message,
      senderName
    });
  }

  sendReaction(emoji: string) {
    this.socket?.emit('send-reaction', {
      emoji,
      timestamp: Date.now()
    });
  }

  changeMeetingName(newName: string) {
    if (!this.socket) return;
    console.log('Changing meeting name to:', newName);
    this.socket.emit('change-meeting-name', {
      meetingId: this.meetingId,
      newName
    });
  }

  lockMeeting(locked: boolean) {
    if (!this.socket) return;
    console.log('Setting meeting lock to:', locked);
    this.socket.emit('lock-meeting', { locked });
  }

  toggleChatEnabled(enabled: boolean) {
    if (!this.socket) return;
    console.log('Setting chat enabled to:', enabled);
    this.socket.emit('update-meeting-permissions', {
      permissions: { chatEnabled: enabled }
    });
  }

  toggleAllowRename(allowed: boolean) {
    if (!this.socket) return;
    console.log('Setting allow rename to:', allowed);
    this.socket.emit('update-meeting-permissions', {
      permissions: { allowRename: allowed }
    });
  }

  updateMeetingPermissions(permissions: Partial<MeetingPermissions>) {
    if (!this.socket) return;
    console.log('Updating meeting permissions:', permissions);
    this.socket.emit('update-meeting-permissions', { permissions });
  }

  leaveMeeting() {
    this.socket?.emit('leave-meeting');
    this.cleanup();
  }

  private closePeerConnection(socketId: string) {
    const pc = this.peerConnections.get(socketId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(socketId);
      console.log('Closed peer connection with:', socketId);
    }
    this.pendingIceCandidates.delete(socketId);
  }

  private cleanup() {
    // Close all peer connections
    this.peerConnections.forEach((pc, socketId) => {
      pc.close();
      console.log('Closed peer connection with:', socketId);
    });
    this.peerConnections.clear();
    this.pendingIceCandidates.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      this.localStream = null;
    }
  }

  disconnect() {
    this.cleanup();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getLocalStreamRef(): MediaStream | null {
    return this.localStream;
  }

  getSocket(): typeof this.socket {
    return this.socket;
  }

  getMySocketId(): string {
    return this.mySocketId;
  }

  // Switch to a different audio device during a meeting
  async switchAudioDevice(deviceId: string): Promise<boolean> {
    if (!this.localStream) {
      console.error('❌ No local stream to switch audio device');
      return false;
    }

    try {
      console.log('🔄 Switching audio device to:', deviceId);
      
      // Get new audio stream with the selected device
      const newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: audioDeviceManager.getEchoCancellation(),
          noiseSuppression: audioDeviceManager.getNoiseSuppression(),
          autoGainControl: audioDeviceManager.getAutoGainControl(),
        }
      });

      const newAudioTrack = newAudioStream.getAudioTracks()[0];
      if (!newAudioTrack) {
        console.error('❌ No audio track in new stream');
        return false;
      }

      // Replace audio track in all peer connections
      const oldAudioTrack = this.localStream.getAudioTracks()[0];
      
      for (const [socketId, pc] of this.peerConnections) {
        const senders = pc.getSenders();
        const audioSender = senders.find(s => s.track?.kind === 'audio');
        
        if (audioSender) {
          await audioSender.replaceTrack(newAudioTrack);
          console.log('✅ Replaced audio track for peer:', socketId);
        }
      }

      // Update local stream
      if (oldAudioTrack) {
        this.localStream.removeTrack(oldAudioTrack);
        oldAudioTrack.stop();
      }
      this.localStream.addTrack(newAudioTrack);

      // Update AudioDeviceManager
      await audioDeviceManager.selectDevice(deviceId);

      console.log('✅ Successfully switched to audio device:', newAudioTrack.label);
      return true;
    } catch (error) {
      console.error('❌ Failed to switch audio device:', error);
      return false;
    }
  }

  // Get current audio device info
  getCurrentAudioDevice(): { deviceId: string; label: string } | null {
    const audioTrack = this.localStream?.getAudioTracks()[0];
    if (!audioTrack) return null;

    const settings = audioTrack.getSettings();
    return {
      deviceId: settings.deviceId || '',
      label: audioTrack.label
    };
  }

  // Switch to a different video/camera device during a meeting
  async switchVideoDevice(deviceId: string): Promise<boolean> {
    if (!this.localStream) {
      console.error('❌ No local stream to switch video device');
      return false;
    }

    try {
      console.log('🔄 Switching video device to:', deviceId);
      
      // Get new video stream with the selected device
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });

      const newVideoTrack = newVideoStream.getVideoTracks()[0];
      if (!newVideoTrack) {
        console.error('❌ No video track in new stream');
        return false;
      }

      // Replace video track in all peer connections
      const oldVideoTrack = this.localStream.getVideoTracks()[0];
      
      for (const [socketId, pc] of this.peerConnections) {
        const senders = pc.getSenders();
        const videoSender = senders.find(s => s.track?.kind === 'video');
        
        if (videoSender) {
          await videoSender.replaceTrack(newVideoTrack);
          console.log('✅ Replaced video track for peer:', socketId);
        }
      }

      // Update local stream
      if (oldVideoTrack) {
        this.localStream.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
      }
      this.localStream.addTrack(newVideoTrack);

      // Update VideoDeviceManager
      await videoDeviceManager.selectDevice(deviceId);

      console.log('✅ Successfully switched to video device:', newVideoTrack.label);
      return true;
    } catch (error) {
      console.error('❌ Failed to switch video device:', error);
      return false;
    }
  }

  /**
   * Switch between front and back camera (mobile-friendly)
   * CAPACITOR-OPTIMIZED: Uses facingMode constraints for reliable camera switching
   * This method toggles between available cameras and updates all peer connections
   * so other participants see the new camera view in real-time
   */
// Alternative switchCamera implementation for webrtc.ts
// This version doesn't require cameraSwitchHelper and uses videoDeviceManager directly

/**
 * Switch between front and back camera (mobile-friendly)
 * CAPACITOR-OPTIMIZED: Uses facingMode constraints for reliable camera switching
 * This method toggles between available cameras and updates all peer connections
 * so other participants see the new camera view in real-time
 */
async switchCamera(): Promise<boolean> {
  if (!this.localStream) {
    console.error('❌ No local stream to switch camera');
    return false;
  }

  try {
    console.log('🔄 Starting camera switch...');
    
    // Get current video track
    const currentVideoTrack = this.localStream.getVideoTracks()[0];
    if (!currentVideoTrack) {
      console.error('❌ No video track in local stream');
      return false;
    }

    // Get current settings to determine which camera we're on
    const currentSettings = currentVideoTrack.getSettings();
    const currentFacingMode = currentSettings.facingMode as 'user' | 'environment' | undefined;
    
    console.log('📹 Current camera:', {
      facingMode: currentFacingMode,
      deviceId: currentSettings.deviceId,
      label: currentVideoTrack.label
    });

    // Determine target facing mode
    let targetFacingMode: 'user' | 'environment';
    
    if (currentFacingMode === 'user') {
      targetFacingMode = 'environment';
    } else if (currentFacingMode === 'environment') {
      targetFacingMode = 'user';
    } else {
      // Infer from label if facingMode not available
      const label = currentVideoTrack.label.toLowerCase();
      if (label.includes('front') || label.includes('user')) {
        targetFacingMode = 'environment';
      } else {
        targetFacingMode = 'user';
      }
    }

    console.log('🎯 Switching to:', targetFacingMode);

    // CRITICAL FIX: Stop old track FIRST before requesting new one
    // This releases the camera and prevents "device in use" errors
    console.log('⏹️ Stopping current camera...');
    currentVideoTrack.stop();
    
    // Wait for camera to be fully released (crucial for mobile devices)
    await new Promise(resolve => setTimeout(resolve, 400));

    // Try to get new camera stream
    let newStream: MediaStream | null = null;
    
    // Attempt 1: Try with ideal facingMode (more permissive)
    try {
      console.log('📹 Attempt 1: Requesting with ideal facingMode...');
      newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      console.log('✅ Success with ideal constraint');
    } catch (error) {
      console.warn('⚠️ Ideal failed, trying exact...', error);
      
      // Attempt 2: Try with exact facingMode
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: targetFacingMode }
          },
          audio: false
        });
        console.log('✅ Success with exact constraint');
      } catch (exactError) {
        console.error('❌ Both ideal and exact failed:', exactError);
        
        // Attempt 3: Try to get ANY camera as fallback
        try {
          console.log('📹 Attempt 3: Requesting any available camera...');
          newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          console.log('⚠️ Got fallback camera (may be same as before)');
        } catch (fallbackError) {
          console.error('❌ All camera access attempts failed:', fallbackError);
          return false;
        }
      }
    }

    if (!newStream) {
      console.error('❌ Failed to get new camera stream');
      return false;
    }

    // Extract the new video track
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) {
      console.error('❌ No video track in new stream');
      newStream.getTracks().forEach(t => t.stop());
      return false;
    }

    // Get actual settings from new track
    const newSettings = newVideoTrack.getSettings();
    console.log('📹 New camera settings:', {
      facingMode: newSettings.facingMode,
      deviceId: newSettings.deviceId,
      label: newVideoTrack.label,
      width: newSettings.width,
      height: newSettings.height
    });

    // Replace video track in all peer connections
    console.log(`🔄 Updating ${this.peerConnections.size} peer connection(s)...`);
    let replacementCount = 0;
    
    for (const [socketId, pc] of this.peerConnections) {
      const senders = pc.getSenders();
      const videoSender = senders.find(s => s.track?.kind === 'video');
      
      if (videoSender) {
        try {
          await videoSender.replaceTrack(newVideoTrack);
          replacementCount++;
          console.log(`✅ Replaced track for peer ${socketId}`);
        } catch (replaceError) {
          console.error(`❌ Failed to replace track for peer ${socketId}:`, replaceError);
        }
      } else {
        console.warn(`⚠️ No video sender for peer ${socketId}`);
      }
    }

    console.log(`✅ Updated ${replacementCount}/${this.peerConnections.size} peer connections`);

    // Update local stream - remove old track, add new one
    const oldTracks = this.localStream.getVideoTracks();
    oldTracks.forEach(track => {
      if (track !== newVideoTrack) {
        this.localStream?.removeTrack(track);
        // Don't stop here - already stopped above
      }
    });
    
    // Add new track if not already present
    if (!this.localStream.getVideoTracks().includes(newVideoTrack)) {
      this.localStream.addTrack(newVideoTrack);
      console.log('✅ Added new video track to local stream');
    }

    // Update videoDeviceManager state
    try {
      const detectedFacingMode = newSettings.facingMode as 'user' | 'environment' | undefined;
      if (detectedFacingMode) {
        videoDeviceManager.setCurrentFacingMode(detectedFacingMode);
      }
      if (newSettings.deviceId) {
        await videoDeviceManager.selectDevice(newSettings.deviceId);
      }
    } catch (e) {
      console.warn('⚠️ Could not update videoDeviceManager:', e);
    }

    // Notify other participants
    this.socket?.emit('camera-switched', {
      facingMode: newSettings.facingMode || targetFacingMode,
      deviceId: newSettings.deviceId
    });

    const displayMode = newSettings.facingMode || targetFacingMode;
    console.log(`✅ Camera switch complete: ${newVideoTrack.label} (${displayMode})`);
    
    return true;

  } catch (error) {
    console.error('❌ Camera switch failed with error:', error);
    return false;
  }
}

  /**
   * Check if the device has multiple cameras available
   */
  hasMultipleCameras(): boolean {
    return videoDeviceManager.hasMultipleCameras();
  }

  /**
   * Get the current camera facing mode
   */
  getCurrentFacingMode(): 'user' | 'environment' {
    return videoDeviceManager.getCurrentFacingMode();
  }

  // Get current video device info
  getCurrentVideoDevice(): { deviceId: string; label: string } | null {
    const videoTrack = this.localStream?.getVideoTracks()[0];
    if (!videoTrack) return null;

    const settings = videoTrack.getSettings();
    return {
      deviceId: settings.deviceId || '',
      label: videoTrack.label
    };
  }

  // Diagnostic function to check connection status
  getConnectionStats() {
    const stats: any = {
      mySocketId: this.mySocketId,
      meetingId: this.meetingId,
      isHost: this.isHost,
      hasLocalStream: !!this.localStream,
      localTracks: this.localStream?.getTracks().map(t => ({
        kind: t.kind,
        enabled: t.enabled,
        readyState: t.readyState
      })) || [],
      peerConnections: []
    };

    this.peerConnections.forEach((pc, socketId) => {
      stats.peerConnections.push({
        socketId,
        connectionState: pc.connectionState,
        iceConnectionState: pc.iceConnectionState,
        iceGatheringState: pc.iceGatheringState,
        signalingState: pc.signalingState,
        localDescription: !!pc.localDescription,
        remoteDescription: !!pc.remoteDescription
      });
    });

    return stats;
  }

  // Log diagnostics
  logDiagnostics() {
    const stats = this.getConnectionStats();
    console.log('🔍 WebRTC Diagnostics:', stats);
    return stats;
  }
}