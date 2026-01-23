import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb, GeminiModel } from '../../../../config/FirebaseConfig';
import SlidersStyle from '@/components/ui/custom/SlidersStyle';
import OutlineSection from '@/components/ui/custom/OutlineSection';


const Outline_Prompt = 
`
Generate a PowerPoint slide outline for the topic {userInput}.
AI Agents and Agentic AI". Create {noOfSliders} in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
Return the response only in JSON format, following this schema:
[
 {
 "slideNo": "",
 "slidePoint": "",
 "outline": ""
 }
]
`

type Project = {
    projectId: string;
    userInputPrompt: string;
    createdBy: string;
    noOfSliders: string;
    outline: Outline[];
    createdAt: number;
}

export type Outline = {
    slideNo: string;
    slidePoint: string;
    outline: string;
}

const Outline = () => {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = React.useState<Project | null>();
    const [loading, setLoading] = React.useState(false);
    const [outline, setOutline] = React.useState<Outline[]>();

    useEffect(() => {
        projectId && GetProjectDetail();
    }, [projectId]);

    const GetProjectDetail = async () => {
        const docRef = doc(firebaseDb, "projects", projectId ?? '');    // getting projectId from the url and fetching project detail
        const docSnap = await getDoc(docRef);   // getting document snapshot

        if (!docSnap.exists()) {
            return;
        }
        console.log(docSnap.data());
        setProjectDetail(docSnap.data() as Project);

        if(!docSnap.data()?.outline){            // if user haven't selected the outline then you allows to generate it by AI
            GenerateSlidersOutline(docSnap.data() as Project)
        }

    }

    const GenerateSlidersOutline = async (projectData: Project) => {
        setLoading(true);

        // Provide a prompt that contains text
        const prompt = Outline_Prompt.replace('{userInput}', projectData?.userInputPrompt ?? '').replace('{noOfSliders}', projectData?.noOfSliders ?? '');


        // To generate text output, call generateContent with the text input
        const result = await GeminiModel.generateContent(prompt);

        const response = result.response;
        const text = response.text();
        console.log(text);

        const rawJson = text.replace('```json', '').replace('```', '');
        const JSONData = JSON.parse(rawJson);    // change the text to json
        setOutline(JSONData);
        console.log(JSONData);

        setLoading(false);
    }

    const handleUpdateOutline = (index:string, value:Outline) => {
        setOutline((prev)=>prev?.map((item)=>item.slideNo === index ? {...item, ...value} : item)) 
    }



    return (
        <div className='flex justify-center mt-20'>
            <div className='max-w-3xl w-full'>
                <h2 className='font-bold text-2xl '>Settings and Sliders Outline</h2>
                <SlidersStyle />
                <OutlineSection loading={loading} outline={outline || []} handleUpdateOutline={(index:string, value:Outline) => handleUpdateOutline(index, value)}/>
            </div>
        </div>
    )
}

export default Outline
