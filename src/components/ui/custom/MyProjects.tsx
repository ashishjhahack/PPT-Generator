import React, { useEffect, useState } from 'react'
import { Button } from '../button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { ArrowRight, ArrowUpRightIcon, FolderIcon, Icon, Link } from 'lucide-react'
import { useUser } from '@clerk/clerk-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firebaseDb } from '../../../../config/FirebaseConfig';
import type { Project } from '@/workspace/project/outline';
import PPT_ICON from '../../../../assets/ppt_icon.png';
import moment from 'moment';


const MyProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const { user } = useUser();

    useEffect(() => {
        user && GetProjects();
    }, [user])

    const GetProjects = async () => {       // This function is used to fetch all the projects created by the logged-in user from Firebase Firestore. It queries the "projects" collection where the "createdBy" field matches the email of the current user. The fetched projects are then stored in the local state variable "projects" using the setProjects function.
        setProjects([])
        const q = query(collection(firebaseDb, "projects"),
            where("createdBy", "==", user?.primaryEmailAddress?.emailAddress ?? ''));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setProjects((prev: any) => [...prev, doc.data()])
        });

    }

    const FormatDate = (timestamp: any) => {     // npm i moment
        const formateDate = moment(timestamp).fromNow();     // use the momentJS library to format the date in a human-readable format (e.g., "2 hours ago", "3 days ago"). It takes a timestamp as input and returns a string representing how long ago that timestamp was from the current time.
        return formateDate;
    }

    return (
        <div className='mx-32 mt-20'>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>My Projects</h2>
                <Button>+ Create New project</Button>
            </div>
            <div>
                {!projects?.length ? <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Projects Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any projects yet. Get started by creating
                            your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div className="flex gap-2">
                            <Button>Create Project</Button>
                            {/* <Button variant="outline">Import Project</Button> */}
                        </div>
                    </EmptyContent>
                    <Button
                        variant="link"
                        asChild
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#">
                            Learn More <ArrowRight />
                        </a>
                    </Button>
                </Empty>

                    : <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
                        {projects.map((project, index) => (
                            <Link to={'/workspace/project/' + project.projectId + '/editor'}>
                                <div key={index} className='p-4 border rounded-2xl shadow mt-3 space-y-1 h-[200px]'>
                                    <img src={PPT_ICON} width={50} height={50} />
                                    <h2 className='font-bold text-lg'>{project?.userInputPrompt}</h2>
                                    <h2 className=' text-red-600'>Total {project?.slides?.length} Slides</h2>
                                    <p className='text-gray-400'>{FormatDate(project?.createdAt)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>}

            </div>
        </div>
    )
}

export default MyProjects
