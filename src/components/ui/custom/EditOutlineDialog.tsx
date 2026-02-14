import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Button } from '../button'
import { DialogClose } from '@radix-ui/react-dialog'

const EditOutlineDialog = ({ children, outlineData, onUpdate }: any) => {
    const [localData, setLocalData] = useState(outlineData);
    const [openDialog, setOpenDialog] = useState(false);


    const handleChange = (key: string, value: string) => {
        setLocalData({
            ...localData,
            [key]: value
        })
    }

    const handleUpdate = () => {
        onUpdate(outlineData?.slideNo, localData);
        setOpenDialog(false);
    }
    return (
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='cursor-pointer'>Edit Slider Outline</DialogTitle>
                    <DialogDescription>
                        <div>
                            <label htmlFor="">Slider Title</label>
                            <Input placeholder='Slider title' value={localData.slidePoint} onChange={(e) => handleChange('slidePoint', e.target.value)} />
                            <div className='mt-3'>
                                <label htmlFor="">Outline</label>
                                <Textarea placeholder='Outline' value={localData.outline} onChange={(e) => handleChange('outline', e.target.value)} />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button className='cursor-pointer' variant={'outline'}>Close</Button>
                    </DialogClose>
                    <Button onClick={handleUpdate} className='cursor-pointer'>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditOutlineDialog
