import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

async function checkExistingChapters(courseId:any) {
  return await db.chapter.findMany({
    where: {
      courseId: courseId,
    },
  });
}

async function deleteExistingChapters(courseId:any) {
  return await db.chapter.deleteMany({
    where: {
      courseId: courseId,
    },
  });
}

async function saveNewChapters(chaptersToSave:any) {
  return await db.chapter.createMany({
    data: chaptersToSave,
  });
}

export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
         
        const {userId} = auth();
        const body= await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

       
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId:userId,
            }
        });
        
        if(!courseOwner){
            return new NextResponse("Unauthorized", {status: 401});
        }
        
        

        const chapterToSave =[];

        for (const chapterData of body) {
            const existingChapter = await db.chapter.findFirst({
                where: {
                    courseId: chapterData.courseId,
                    title: chapterData.title,
                },
            });
            

            if(!existingChapter){
                await deleteExistingChapters(params.courseId);
                chapterToSave.push({
                    title: chapterData.title,
                    courseId: chapterData.courseId,
                    videoUrl: chapterData.videoUrl,
                });
            }
        }
        if(chapterToSave.length>0){
            const createdChapters = await db.chapter.createMany({
                data: chapterToSave,
            });
            return NextResponse.json({message: "Chapter saved", createdChapters})
        } else {
      return new NextResponse("Chapters already exist", { status: 409 });
    }

    } catch (error) {
        console.log("Chapter with an error", error)
        return new NextResponse("Internal Error", {status: 500});
    }
    
}