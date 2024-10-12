"use client";

import { useGlobal } from "@/context/global.context";
import {
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InterviewRoom = () => {
  // const { webCamEnable, setWebCamEnable, setMicEnabled, token, url } =
  //   useGlobal();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!token) {
  //     router.push("/apply/interview");
  //   }
  // }, [token, router]);
  const talentInfo = {
        first_name: 'Leo',
        last_name: 'Lee'
    }
    const [room, setRoom] = useState(generateRandomRoomName()); // Generate random room name
    const [name, setName] = useState(talentInfo.first_name || "You"); // Use talentInfo.first_name
    const [token, setToken] = useState("");
    const [connected, setConnected] = useState(false);

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
                setConnected(true); // Mark as connected
            } else {
                console.error("Failed to get token:", data.error);
            }
        } catch (e) {
            console.error(e);
        }
    };

      useEffect(() => {
        handleConnect();
      }, [token]);

    function generateRandomRoomName() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

  const handleLeaveRoom = () => {
    setTimeout(() => {
            window.location.href = "/";
        }, 3000);
  };

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token || ""}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and leave the room. */}
      <div className="flex justify-center">
        <DisconnectButton onClick={handleLeaveRoom}>
          {<LeaveIcon />}
          {" Leave"}
        </DisconnectButton>
      </div>
    </LiveKitRoom>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

export default InterviewRoom;
