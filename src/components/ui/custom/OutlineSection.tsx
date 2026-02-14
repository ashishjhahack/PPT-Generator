
import { Skeleton } from '../skeleton';
import type { Outline } from '@/workspace/project/outline';
import { Edit } from 'lucide-react';
import { Button } from '../button';
import EditOutlineDialog from './EditOutlineDialog';


type Props = {
    loading: boolean;
    outline: Outline[];
    handleUpdateOutline: any;
}

const OutlineSection = ({ loading, outline, handleUpdateOutline }: Props) => {
    return (
        <div className='mt-7'>
            <h2 className='font-bold text-xl'>Sliders Outline</h2>
            {loading &&
                <div>{[1, 2, 3, 4].map((item, index) => (<Skeleton key={index} className='h-[60px] w-full rounded-2xl mb-4' />))}</div>
            }

            <div className='mb-24'>
                {outline?.map((item, index) => (
                    <div key={index} className='bg-white p-3 rounded-xl flex gap-6 border-b-4 border-gray-500 mt-3 items-center justify-between px-6'>
                        <div className='flex gap-6 items-center'>
                            <h2 className='font-bold p-5 bg-gray-300 rounded-xl'>{index + 1}.</h2>
                            <div>
                                <h2 className='font-bold'>{item.slidePoint}</h2>
                                <p>{item.outline}</p>
                            </div>
                        </div>
                        <EditOutlineDialog outlineData={item} onUpdate={handleUpdateOutline}>
                            <Button variant={'outline'} size={'icon-lg'}><Edit /></Button>
                        </EditOutlineDialog>
                    </div>
                ))}
            </div>

            
        </div>
    )
}

export default OutlineSection
