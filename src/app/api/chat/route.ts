import { NextResponse } from "next/server";

// Placeholder endpoint. Nothing calls it yet.
// Later: validate the body, retrieve context from the subject's documents,
// call your model, and return `{ reply: string }`.
export async function POST() {
  return NextResponse.json(
    { error: "Chat backend is not implemented yet." },
    { status: 501 },
  );
}
