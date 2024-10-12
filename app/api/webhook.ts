import { NextRequest, NextResponse } from "next/server";
import {
    WebhookReceiver,
    EncodedFileType,
    EgressClient,
    IngressClient,
} from "livekit-server-sdk";
import * as fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY as string, process.env.LIVEKIT_API_SECRET as string);
const egressClient = new EgressClient(process.env.LIVEKIT_API_URL as string);
const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL as string);

export default async function handler(req: NextRequest, res: NextResponse) {
    if (req.method === "POST") {
        const buf = await req.arrayBuffer(); // Use arrayBuffer to get raw body
        const content = fs.readFileSync('joinarena-bucket-credentials.json');
        try {
            const authorization = req.headers.get("authorization") || undefined;
            const event = receiver.receive(buf as unknown as string, authorization);
            console.log("Received webhook event:", event);
            const eventType = (await event).event;

            switch (eventType) {
                case "ingress_started":
                    console.log("Ingress started");
                    const roomName = (await event).ingressInfo?.roomName;

                    const output = {
                        fileType: EncodedFileType.MP4,
                        filepath: `${roomName}.mp4`,
                        gcs: {
                            credentials: content,
                            bucket: process.env.GCP_BUCKET_NAME,
                            // filename_prefix: `path-in-bucket/${roomName}`, // Prefix for the file name
                        },
                    };

                    try {
                        const egress = await egressClient.startRoomCompositeEgress(roomName!, output);
                        console.log(egress, "EGRESS OBJECT - ____________________________________");

                        // Update database with egress information
                        // await updateDatabaseWithEgressInfo(roomName!, egress.egressId);
                    } catch (error) {
                        console.log(error);
                    }
                    break;

                case "ingress_ended":
                    console.log("Ingress ended");
                    const roomNameEnded = (await event).ingressInfo?.roomName;
                    // await handleIngressEnded(roomNameEnded!);
                    break;

                default:
                    console.log("Unhandled event type:", eventType);
                    break;
            }
            return NextResponse.json({ message: "Webhook event received successfully" }, { status: 200 });
        } catch (error) {
            console.error("Error handling webhook:", error);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
}

// async function updateDatabaseWithEgressInfo(roomName: string, egressId: string) {
//     // Logic to update your database with the egress information
// }

// async function handleIngressEnded(roomNameEnded: string) {
//     // Logic to handle when ingress ends
// }