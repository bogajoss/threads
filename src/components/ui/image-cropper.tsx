import React, { useState, useRef } from "react"
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { getCroppedImg } from "@/lib/utils"

interface ImageCropperProps {
    src: string
    isOpen: boolean
    onClose: () => void
    onCropComplete: (blob: Blob) => void
    aspect?: number
    circular?: boolean
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    src,
    isOpen,
    onClose,
    onCropComplete,
    aspect,
    circular,
}) => {
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        if (aspect) {
            setCrop(
                centerCrop(
                    makeAspectCrop({ unit: "%", width: 100 }, aspect, width, height),
                    width,
                    height
                )
            )
        } else {
            setCrop({ unit: "%", width: 100, height: 100, x: 0, y: 0 })
        }
    }

    const handleConfirm = async () => {
        if (completedCrop && imgRef.current) {
            try {
                const blob = await getCroppedImg(imgRef.current, completedCrop)
                onCropComplete(blob)
                onClose()
            } catch (e) {
                console.error("Error cropping image:", e)
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="overflow-hidden bg-white p-0 sm:max-w-2xl dark:bg-zinc-900">
                <DialogHeader className="shrink-0 p-4">
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className="flex max-h-[65vh] min-h-[300px] items-center justify-center overflow-auto bg-zinc-100/50 p-6 dark:bg-zinc-950/50">
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        circularCrop={circular}
                        className="max-w-full shadow-2xl"
                    >
                        <img
                            ref={imgRef}
                            src={src}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            className="block max-h-[60vh] w-auto"
                        />
                    </ReactCrop>
                </div>

                <DialogFooter className="flex shrink-0 flex-row justify-end gap-2 bg-white p-4 dark:bg-zinc-900">
                    <Button variant="outline" onClick={onClose} className="!w-auto px-6">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="!w-auto px-6">
                        Apply Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ImageCropper
