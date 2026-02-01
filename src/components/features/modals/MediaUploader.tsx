import React, { useRef } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { X, Plus, FileText } from "lucide-react"

interface SelectedFile {
    id: string
    file: File
}

interface MediaUploaderProps {
    selectedFiles: SelectedFile[]
    setSelectedFiles: React.Dispatch<React.SetStateAction<SelectedFile[]>>
    customThumbnails: Record<string, File>
    setCustomThumbnails: React.Dispatch<React.SetStateAction<Record<string, File>>>
}

interface SortableMediaItemProps {
    id: string
    file: File
    index: number
    total: number
    onRemove: (id: string) => void
    onAddThumbnail: () => void
    customThumbnail?: File
}

const SortableMediaItem: React.FC<SortableMediaItemProps> = ({
    id,
    file,
    index,
    total,
    onRemove,
    onAddThumbnail,
    customThumbnail,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-100 shadow-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-800 ${total === 3 && index === 0 ? "row-span-2" : ""
                } ${isDragging ? "ring-2 ring-violet-500 shadow-xl" : ""}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="size-full cursor-grab active:cursor-grabbing"
            >
                {file.type.startsWith("image/") ? (
                    <img
                        src={URL.createObjectURL(file)}
                        className="size-full pointer-events-none object-cover"
                        alt=""
                    />
                ) : (
                    <div className="pointer-events-none flex size-full flex-col items-center justify-center gap-2 text-zinc-500">
                        {file.type.startsWith("video/") ? (
                            <>
                                {customThumbnail ? (
                                    <img
                                        src={URL.createObjectURL(customThumbnail)}
                                        className="size-full opacity-60 object-cover"
                                        alt="Custom thumbnail"
                                    />
                                ) : (
                                    <div className="flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
                                        <Plus size={20} className="text-zinc-400" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <FileText size={24} />
                                <span className="max-w-[100px] truncate px-2 text-[10px] font-bold">
                                    {file.name}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {file.type.startsWith("video/") && (
                <button
                    type="button"
                    onClick={onAddThumbnail}
                    className="absolute inset-x-0 bottom-0 z-10 bg-black/60 py-2 text-[10px] font-bold text-white backdrop-blur-md transition-colors hover:bg-black/80"
                >
                    {customThumbnail ? "Change Cover" : "Add Cover"}
                </button>
            )}

            <button
                type="button"
                onClick={() => onRemove(id)}
                className="absolute right-2 top-2 z-20 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-rose-500"
            >
                <X size={14} strokeWidth={2.5} />
            </button>
        </div>
    )
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
    selectedFiles,
    setSelectedFiles,
    customThumbnails,
    setCustomThumbnails,
}) => {
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const [activeThumbnailId, setActiveThumbnailId] = React.useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setSelectedFiles((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const removeFile = (id: string) => {
        setSelectedFiles((prev) => prev.filter((item) => item.id !== id))
        const newThumbs = { ...customThumbnails }
        delete newThumbs[id]
        setCustomThumbnails(newThumbs)
    }

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && activeThumbnailId !== null) {
            setCustomThumbnails((prev) => ({
                ...prev,
                [activeThumbnailId]: file,
            }))
        }
        setActiveThumbnailId(null)
    }

    if (selectedFiles.length === 0) return null

    return (
        <div className="mb-4 animate-in fade-in zoom-in-95 duration-200">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={selectedFiles.map((i) => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div
                        className={`grid gap-2 overflow-hidden rounded-2xl border border-zinc-100 shadow-sm dark:border-zinc-800 ${selectedFiles.length === 1
                            ? "grid-cols-1"
                            : "aspect-[16/9] grid-cols-2"
                            }`}
                    >
                        {selectedFiles.map((item, idx) => (
                            <SortableMediaItem
                                key={item.id}
                                id={item.id}
                                file={item.file}
                                index={idx}
                                total={selectedFiles.length}
                                onRemove={removeFile}
                                customThumbnail={customThumbnails[item.id]}
                                onAddThumbnail={() => {
                                    setActiveThumbnailId(item.id)
                                    thumbnailInputRef.current?.click()
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <input
                type="file"
                ref={thumbnailInputRef}
                onChange={handleThumbnailSelect}
                className="hidden"
                accept="image/*"
            />
        </div>
    )
}

export default MediaUploader
