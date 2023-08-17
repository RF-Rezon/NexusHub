import Post from "@/app/models/Post";
import connection from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async (req, {params}) => {
    const {id} = params;
  try {
    connection();
    const post = await Post.findById(id)
    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    return new NextResponse("Database connection error!", { status: 500 });
  }
};


export const DELETE = async (request, { params }) => {
  const { id } = params;

  try {
    await connection();

    await Post.findByIdAndDelete(id);

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};