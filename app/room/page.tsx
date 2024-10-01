"use client";

// import { useGlobal } from "@/context/global.context";
import {
    ControlBar,
    DisconnectButton,
    GridLayout,
    LeaveIcon,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useState } from "react";

const ControlBarControls = {
    microphone: false,
    camera: false,
    chat: true,
    screenShare: true,
    leave: true,
    settings: true,
};

export default function Page() {
    // const { talentInfo } = useGlobal(); // Access talentInfo from global state
    const talentInfo = {
        first_name: 'Leo',
        last_name: 'Lee'
    }
    const [room, setRoom] = useState(generateRandomRoomName()); // Generate random room name
    const [name, setName] = useState(talentInfo.first_name || "You"); // Use talentInfo.first_name
    const [token, setToken] = useState("");
    const [connected, setConnected] = useState(false); // Track connection status
    const [egressId, setEgressId] = useState(""); // Track egress ID for stopping recording



    const handleConnect = async () => {
        try {
            const resp = await fetch(
                `/api/get-participant-token?room=${room}&username=${name}`
            );
            const data = await resp.json();
            console.log(data);
            if (data.token) {
                console.log(data.token);
                setToken(data.token);
                startRecording(data.token);
                setConnected(true); // Mark as connected
            } else {
                console.error("Failed to get token:", data.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Function to start recording
    const startRecording = async (token: string) => {
        console.log('Client Token' + token);

        try {
            const response = await fetch(`/api/interview-recorder/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomName: room, token: token }),
            });
            const data = await response.json();
            console.log(data);

            if (data.status) {
                setEgressId(data.data.egressId); // Store egress ID for stopping the recording later
                console.log("Recording started:", data.data.egressId);
            } else {
                console.error("Failed to start recording:", data.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Function to stop recording
    const stopRecording = async () => {
        try {
            const response = await fetch(`/api/interview-recorder/stop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ egressId }),
            });
            const data = await response.json();
            if (data.status) {
                console.log("Recording stopped:", data.data);
            } else {
                console.error("Failed to stop recording:", data.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLeave = async () => {
        await stopRecording();
        // setTimeout(() => {
        //     window.location.reload();
        // }, 3000);
    }

    function generateRandomRoomName() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Don't connect automatically, render the Start Interview button first
    if (!connected) {
        return (
            <div className="text-black" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <h1>Ready for your interview?</h1>
                <p>Click the button below to start your interview session.</p>
                <button onClick={handleConnect} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}>
                    Start Interview
                </button>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: '100vh' }}
        >
            {/* Your custom component with basic video conferencing functionality. */}
            <MyVideoConference />
            {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
            <RoomAudioRenderer />
            {/* Controls for the user to start/stop audio, video, and leave the room. */}
            <div className="flex justify-center">
                <DisconnectButton onClick={() => handleLeave()}>
                    {<LeaveIcon />}
                    {' Leave'}
                </DisconnectButton>
            </div>

            {/* Dummy user in the bottom right corner */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: '#333',
                padding: '10px',
                borderRadius: '5px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '320px',
                height: '200px',
                marginLeft: '10%'
            }}>
                <p>AI Interviewer</p>
            </div>
        </LiveKitRoom>
    );
}

const MyVideoConference = () => {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false }
    );

    return (
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
            {tracks.length > 0 ? (
                <ParticipantTile />
            ) : (
                <div>No video feed available</div> // Fallback UI when no tracks are available
            )}
        </GridLayout>
    );
};

