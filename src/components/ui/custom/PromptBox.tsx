import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowUp, Loader2Icon, PlusIcon } from 'lucide-react'
import {v4 as uuidv4} from 'uuid';
import { firebaseDb } from '../../../../config/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const PromptBox = () => {
    const [userInput, setUserInput] = useState<string>();
    const [noOfSliders, setNoOfSliders] = useState<string>('4 to 8');
    const {user} = useUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const CreateAndSaveProject = async () => {
        // save the project to firebase and deduct credits
        const projectId = uuidv4();
        setLoading(true);

        await setDoc(doc(firebaseDb, "projects", projectId), {
            projectId: projectId,
            userInputPrompt: userInput,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: Date.now(),
            noOfSliders: noOfSliders,
        })
        setLoading(false);    // stop loading after saving project
        navigate('/workspace/project/' + projectId + '/outline');
    }
    return (
        <div className='w-full flex items-center justify-center mt-28'>
            <div className='flex flex-col items-center justify-center space-y-4'>
                <h2 className='font-bold text-4xl'>Describe your topic, we'll design the <span className='text-primary'>PPT</span> slides!</h2>
                <p className='text-xl text-gray-500'>Your design will be saved as new project</p>
                <InputGroup>
                    <InputGroupTextarea onChange={(e) => setUserInput(e.target.value)}  className='min-h-36 border-4' placeholder='Enter what kind of slider do you want to create' />
                    <InputGroupAddon align={'block-end'}>
                        {/* <InputGroupButton>
                            <PlusIcon />
                        </InputGroupButton> */}
                        <Select defaultValue={noOfSliders} onValueChange={(value) => setNoOfSliders(value)}>
                            <SelectTrigger className="w-[180px] border-2 border-gray-400">
                                <SelectValue placeholder="No. Of Slider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4 to 8">4-8 Sliders</SelectItem>
                                <SelectItem value="8 to 12">8-12 Sliders</SelectItem>
                                <SelectItem value="12 to 16">12-16 Sliders</SelectItem>
                                <SelectItem value="16 to 20">16-20 Sliders</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputGroupButton onClick={() => CreateAndSaveProject()} disabled={!userInput} variant={'default'} className='rounded-full ml-auto' size={'icon-sm'}>
                            {loading ? <Loader2Icon className='animate-spin' /> : <ArrowUp />}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}

export default PromptBox
