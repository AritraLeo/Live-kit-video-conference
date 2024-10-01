import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken"; // For generating JWT tokens
import * as fs from 'fs'

export async function POST(req: NextRequest) {
    const { roomName, token } = await req.json();
    console.log('token' + token);


    // // Generate a JWT token each time the request is made
    // const token = jwt.sign(
    //     {
    //         room: roomName,
    //         permissions: ["roomAdmin"], // Required permissions for recording
    //         exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1-hour expiration
    //     },
    //     process.env.LIVEKIT_API_SECRET!, // Use your LiveKit API Secret from env
    //     {
    //         issuer: process.env.LIVEKIT_API_KEY!, // API Key as the issuer
    //     }
    // );

    const content = fs.readFileSync('joinarena-bucket-credentials.json')
    try {
        const response = await axios.post(
            `${process.env.HTTP_LIVEKIT_URL}/egress/start`, // LiveKit server URL
            {
                room_name: roomName,
                file_type: "mp4",
                output: {
                    gcs: {
                        credential: content.toString(),
                        bucket: process.env.NEXT_PUBLIC_BUCKET_NAME_INTERVIEW, // Your bucket name from environment variables
                        filename: `Interview-${roomName}-recording.mp4`,
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Dynamically generated token
                },
            }
        );

        console.log(response);


        return NextResponse.json({
            status: true,
            message: "Recording started",
            data: response.data,
        });
    } catch (error: any) {
        console.error("Error starting recording: ", error);
        return NextResponse.json(
            {
                status: false,
                message: "Failed to start recording",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
