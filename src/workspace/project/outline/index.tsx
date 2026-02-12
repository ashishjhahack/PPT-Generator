import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseDb, GeminiModel } from '../../../../config/FirebaseConfig';
import SlidersStyle, { type designStyle } from '@/components/ui/custom/SlidersStyle';
import OutlineSection from '@/components/ui/custom/OutlineSection';
import { UserDetailContext } from '../../../../context/UserDetailContext';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

import { Loader2Icon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';


const Outline_Prompt = 
`
Generate a PowerPoint slide outline for the topic {userInput}.
Create {noOfSliders} in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
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
const DUMMY_OUTLINE =
    [
        {
            "slideNo": "1",
            "slidePoint": "Welcome to Simple Demo Sliders!",
            "outline": "An introduction to the presentation on understanding and implementing simple sliders.\nGet ready to explore the basics of interactive UI elements with ease."
        },
        {
            "slideNo": "2",
            "slidePoint": "Today's Roadmap",
            "outline": "We'll cover slider definitions, common types, and foundational implementation concepts.\nConcluding with a quick demo overview and essential best practices for effective use."
        },
        {
            "slideNo": "3",
            "slidePoint": "Understanding Sliders",
            "outline": "Define sliders as interactive UI controls for selecting values within a range or navigating content.\nExplain their primary purpose in providing intuitive user input and visual feedback."
        },
        {
            "slideNo": "4",
            "slidePoint": "Exploring Slider Variations",
            "outline": "Showcase popular slider examples: range sliders, image carousels, and volume/brightness controls.\nDiscuss the specific use cases and advantages of each type in different applications."
        },
        {
            "slideNo": "5",
            "slidePoint": "Basic Implementation Concepts",
            "outline": "Outline the core components: HTML structure for the track and thumb, CSS for styling.\nExplain how JavaScript adds interactivity to update values and respond to user input."
        },
        {
            "slideNo": "6",
            "slidePoint": "Quick Demo & Best Practices",
            "outline": "Demonstrate a conceptual flow of how a slider updates values in real-time.\nProvide tips for usability, accessibility, and performance when implementing sliders."
        },
        {
            "slideNo": "7",
            "slidePoint": "Thank You & Questions",
            "outline": "Recap the key takeaways on simple demo sliders and their practical applications.\nOpen the floor for any questions or further discussion on the topic."
        }
    ]

export type Project = {
    userInputPrompt: string,
    projectId: string,
    createdAt: string,
    noOfSliders: string,
    outline: Outline[],
    slides: any[],
    designStyle: DesignStyle
}
export type Outline = {
    slideNo: string,
    slidePoint: string,
    outline: string
}

export type DesignStyle = {
    colors: any,
    designGuide: string,
    styleName: string
}


function Outline() {
    const { projectId } = useParams();
    const [projectDetail, setProjectDetail] = useState<Project | null>()
    const [loading, setLoading] = useState(false);
    const [UpdateDbLoading, setUpdateDbLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [outline, setOutline] = useState<Outline[]>();
    const [selectedStyle, setSelectedStyle] = useState<DesignStyle>();
    const navigate = useNavigate();

    useEffect(() => {
        projectId && GetProjectDetail()
    }, [projectId])

    const GetProjectDetail = async () => {
        const docRef = doc(firebaseDb, "projects", projectId ?? '');
        const docSnap: any = await getDoc(docRef);
        if (!docSnap.exists()) {
            return;
        }
        console.log(docSnap.data())
        setProjectDetail(docSnap.data());
        if (!docSnap.data()?.outline) {
            GenerateSlidersOutline(docSnap.data())
        }
        else {
            setOutline(docSnap.data()?.outline)
        }

    }

    const GenerateSlidersOutline = async (projectData: Project) => {
        setLoading(true);
        // Provide a prompt that contains text
        const prompt = Outline_Prompt
            .replace('{userInput}', projectData?.userInputPrompt)
            .replace('{noOfSliders}', projectData?.noOfSliders)

        // To generate text output, call generateContent with the text input
        const result = await GeminiModel.generateContent(prompt);

        const response = result.response;
        const text = response.text();
        console.log(text);
        const rawJson = text.replace('```json', '').replace('```', '');
        const JSONData = JSON.parse(rawJson);
        setOutline(JSONData);
        setLoading(false);
    }

    const handleUpdateOutline = (index: string, value: Outline) => {
        setOutline((prev: any) =>
            prev.map((item: any) =>
                item.slideNo === index ? { ...item, ...value } : item
            )
        )
    }

    const onGenerateSlider = async () => {

        setUpdateDbLoading(true);
        //update db
        await setDoc(doc(firebaseDb, 'projects', projectId ?? ''), {
            designStyle: selectedStyle,
            outline: outline
        }, {
            merge: true
        })

        await setDoc(doc(firebaseDb, "users", userDetail?.email ?? ''),
            {
                credits: userDetail?.credits - 1
            }, {
            merge: true
        })

        setUserDetail((prev: any) => ({
            ...prev,
            credits: userDetail?.credits - 1
        }))


        setUpdateDbLoading(false);

        //Navigate to slider-Editor
        navigate('/workspace/project/' + projectId + "/editor")
    }

    return (
        <div className='flex justify-center mt-20'>
            <div className='max-w-3xl w-full '>
                <h2 className='font-bold text-2xl'>Settings and Slider Outline</h2>
                <SlidersStyle selectStyle={(value: DesignStyle) => setSelectedStyle(value)} />
                <OutlineSection loading={loading} outline={outline || []}
                    handleUpdateOutline={(index: string, value: Outline) => handleUpdateOutline(index, value)} />
            </div>
            <Button size={'lg'} className='fixed bottom-6
            transform left-1/2 -translate-x-1/2'
                onClick={onGenerateSlider}
                disabled={UpdateDbLoading || loading}
            >
                {UpdateDbLoading && <Loader2Icon className='animate-spin' />}
                Generate Sliders <ArrowRight />

            </Button>

        </div>
    )
}

export default Outline