import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params: {courseId: string}}
    ) {
        try {
            const {userId} = auth();

            if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if(!course) {
            return new NextResponse("Not found", {status: 404});
        }

        if(!course.title || !course.description || !course.playlistUrl || !course.categoryId){
            return new NextResponse("Missing required fiends", {status: 401});
        }

        const publishedCourse = await db.course.update({
            where: { 
                id:params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });
        return NextResponse.json(publishedCourse);
        


        } catch (error) {
            return new NextResponse("Internal Error", {status: 500})
        }
    
}