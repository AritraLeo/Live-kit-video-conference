"use client";

import { useGlobal } from "@/context/global.context";
import {
  DisconnectButton,
  GridLayout,
  FocusLayout,
  FocusLayoutContainer,
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
import { TrackRefContext } from "@livekit/components-react";
import { FaGear } from "react-icons/fa6";
// import AudioWaves from 'audioWaves.png'

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
      style={{ height: "100vh", width: '100%' }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

      {/* Controls for the user to start/stop audio, video, and leave the room. */}
      {/*<div className="flex justify-center">
        <DisconnectButton onClick={handleLeaveRoom}>
          {<LeaveIcon />}
          {" Leave"}
        </DisconnectButton>
      </div>*/}


// && tracks.length > 0 ? tracks.filter(track => track?.track !== undefined) : []


// function MyVideoConference() {
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false }
//   );

//   const validTracks = tracks;

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Navbar (First Row) */}
//       <div className="flex justify-center items-center bg-white p-4 shadow-md">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8 text-gray-500"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM4.343 12.657c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414"
//           />
//         </svg>
//       </div>

//       {/* Pop-up style video conference (Second Row) */}
//       <div className="flex-grow flex items-center justify-center bg-gray-50">
//         <div className="relative w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
//           {validTracks && validTracks.length > 0 ? (
//             <TrackRefContext.Provider value={validTracks[0]?.track}>
//               {/* Context applied here */}
//               <FocusLayoutContainer className="rounded-lg overflow-hidden">
//                 <FocusLayout
//                   trackRef={validTracks[0]?.track} // Focus on the first track (main participant)
//                   className="w-full h-64"
//                 />

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   {validTracks.slice(1).map((track, index) => (
//                     <ParticipantTile key={index} trackRef={track.track} />
//                   ))}
//                 </div>
//               </FocusLayoutContainer>
//             </TrackRefContext.Provider>
//           ) : (
//             <div className="text-center">No participants available</div>
//           )}
//         </div>
//       </div>

//       {/* Bottom controls (Third Row) */}
//       <div className="flex justify-between items-center bg-white p-4 border-t">
//         <div className="text-sm text-gray-600">Round 1 | Technical Interview</div>
//         <div className="flex space-x-4 items-center">
//           <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => window.location.href = "/"}>
//             Leave
//           </button>

//           <button className="flex items-center bg-gray-200 text-black px-4 py-2 rounded-md">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM4.343 12.657c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





// function MyVideoConference() {
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false }
//   );

//   return (
//     <GridLayout
//       tracks={tracks}
//       style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
//     >
//       <ParticipantTile />
//     </GridLayout>
//   );
// }


{/*<svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500" // Adjust color as needed
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h3m4-4h3m4 8h3m-8-4h3m4-4h3m4 8h3m4-4h3M7 10v4m4-4v8m4-8v8m4-8v8m4-8v8"
                      />
                    </svg>*/}



function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex flex-col h-full">
      {/* Navbar (First Row) */}
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
        <div className="flex items-center">
          {/* Logo placeholder */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM4.343 12.657c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414"
            />
          </svg>
        </div>
      </div>

      {/* Pop-up style video conference (Second Row) */}
      <div className="flex-grow flex items-center justify-center bg-gray-100 h-screen w-screen">
      <div className="relative w-full h-full bg-white shadow-lg rounded-lg p-0"> {/* Adjusted p-0 for padding */}
        <GridLayout
          tracks={tracks}
          className="rounded-lg overflow-hidden"
          style={{
            width: "100%",
            height: "70vh", // Full screen height
          }}
        >
                <div
                  className="relative border-2 border-blue-500 rounded-lg overflow-hidden" // Bluish border
                  style={{ backgroundColor: 'white', borderRadius: '8px' }}
                >
                  {/* Logo in the center */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 m-auto h-12 w-12 text-gray-500" // Center the logo
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM4.343 12.657c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414 1.414-1.414c.781-.781 2.047-.781 2.828 0l1.414 1.414"
                    />
                  </svg>

                  {/* Audio waves on the top right */}
                  <div className="absolute top-0 right-0 m-2">
                    <img 
      src="/assets/audioWaves.png" 
      alt="Audio Waves"
      width={50} 
      height={50} 
    />
                  </div>

                  {/* Participant Tile */}
                  <div style={{ position: 'relative', height: '100%', width: '100%' }}>
                    <ParticipantTile />
                  </div>
                  </div>
        </GridLayout>
      </div>
      </div>


      {/* Bottom controls (Third Row) */}
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <div className="text-sm text-gray-600">Round 1 | Technical Interview</div>
        <div className="flex space-x-4">
          {/* Leave Button */}
          <button
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.href = "/"}
          >
            <LeaveIcon className="mr-2" /> Leave
          </button>

          {/* Settings Button */}
          <button className="flex items-center bg-gray-300 text-black px-4 py-2 rounded-md">
            <FaGear />
          </button>
        </div>
      </div>
    </div>
  );
}


export default InterviewRoom;
