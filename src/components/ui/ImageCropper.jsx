import React, { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { getCroppedImg } from "@/lib/utils";

const ImageCropper = ({
  src,
  isOpen,
  onClose,
  onCropComplete,
  aspect,
  circular,
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(
        centerCrop(
          makeAspectCrop({ unit: "%", width: 100 }, aspect, width, height),
          width,
          height,
        ),
      );
    } else {
      setCrop({ unit: "%", width: 100, height: 100, x: 0, y: 0 });
    }
  };

  const handleConfirm = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const blob = await getCroppedImg(imgRef.current, completedCrop);
        onCropComplete(blob);
        onClose();
      } catch (e) {
        console.error("Error cropping image:", e);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-900 p-0 overflow-hidden">
        <DialogHeader className="p-4 shrink-0">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="p-6 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-950/50 min-h-[300px] max-h-[65vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c, p) => setCompletedCrop(p)}
            aspect={aspect}
            circularCrop={circular}
            className="max-w-full shadow-2xl"
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[60vh] w-auto block"
            />
          </ReactCrop>
        </div>

        <DialogFooter className="p-4 bg-white dark:bg-zinc-900 shrink-0 flex flex-row justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="!w-auto px-6">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="!w-auto px-6">
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
