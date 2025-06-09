import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function Get() {
    const session = await getServerSession();
    return NextResponse.json({
        session
    })
}