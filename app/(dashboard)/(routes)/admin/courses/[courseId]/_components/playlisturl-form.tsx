"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";


interface PlaylistUrlFromProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    playlistUrl: z.string().min(1, {
        message: "playlistUrl is required"
    }),
});

export const PlaylistUrlFrom = ({
    initialData,
    courseId,
}: PlaylistUrlFromProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => ! current);
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            playlistUrl: initialData?.playlistUrl || ""
        },
    });

    const {isSubmitting, isValid} = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        } catch{
            toast.error("Something went wrong")
        }
    }
    
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
           <div className="font-medium flex items-center justify-between">
            Course playlist url
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ):
                (
                <>
                   <Pencil className="h-4 w-4 mr-2"/>
                   Edit playlist url
                </>
                )}
                
            </Button>
           </div>
           {!isEditing && (
            <p className={cn(
                "text-sm mt-2", !initialData.playlistUrl && "text-slate-500 italic"
            )}>
                {initialData.playlistUrl || "No url"}
            </p>
           )}
           {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField 
                    control={form.control}
                    name="playlistUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                disabled={isSubmitting}
                                placeholder="e.g. 'https://www.youtube.com/embed/...'"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

                    <div className="flex items-center gap-x-2">
                        <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
           )}
        </div>
    )
}