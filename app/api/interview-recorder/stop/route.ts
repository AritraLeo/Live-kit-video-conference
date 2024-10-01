import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken"; // Ensure you have this installed via npm

export async function POST(req: NextRequest) {
    const { egressId } = await req.json();

    try {
        // Generate the LiveKit API token dynamically
        const apiToken = jwt.sign(
            {
                // Include any required claims here (if needed)
            },
            process.env.LIVEKIT_API_SECRET as string, // Your LiveKit API secret from env
            {
                issuer: process.env.LIVEKIT_API_KEY, // Your LiveKit API key from env
                expiresIn: "1h", // Token expiry time
                audience: "livekit",
            }
        );

        // Call LiveKit Egress Stop API
        const response = await axios.post(
            `${process.env.HTTP_LIVEKIT_URL}/egress/stop`,
            {
                egress_id: egressId,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
            }
        );

        return NextResponse.json({
            status: true,
            message: "Recording stopped",
            data: response.data,
        });
    } catch (error: any) {
        console.error("Error stopping recording: ", error);
        return NextResponse.json(
            {
                status: false,
                message: "Failed to stop recording",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
