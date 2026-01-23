import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '../../../../config/FirebaseConfig';
import SlidersStyle from '@/components/ui/custom/SlidersStyle';

type Project = {
    projectId: string;
    userInputPrompt: string;
    createdBy: string;
}

const Outline = () => {
    const {projectId} = useParams();
    const [projectDetail, setProjectDetail] = React.useState<Project | null>();

    useEffect(() => {
        projectId && GetProjectDetail();
    }, [projectId]);

    const GetProjectDetail = async () => {
        const docRef = doc(firebaseDb, "projects", projectId ?? '');    // getting projectId from the url and fetching project detail
        const docSnap = await getDoc(docRef);   // getting document snapshot

        if (!docSnap.exists()) {
            return ;
        }
        console.log(docSnap.data());
        setProjectDetail(docSnap.data() as Project);
    
    }
    return (
        <div className='flex justify-center mt-20'>
            <div className='max-w-3xl w-full'>
                <h2 className='font-bold text-2xl '>Settings and Sliders Outline</h2>
                <SlidersStyle />
            </div>
        </div>
    )
}

export default Outline
