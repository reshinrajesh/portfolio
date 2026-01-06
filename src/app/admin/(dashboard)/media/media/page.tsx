'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

interface GalleryImage {
    id: string;
    url: string;
    name: string;
    created_at: string;
}

export default function MediaPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery/images');
            if (res.ok) {
                const data = await res.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Failed to fetch images', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleUpload(e.target.files[0]);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/gallery/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const newImage = await res.json();
            setImages([newImage, ...images]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent accidental clicks
        if (!confirm('Are you sure you want to delete this image?')) return;

        // Optimistic update
        const originalImages = [...images];
        setImages(images.filter(img => img.id !== id));

        try {
            const res = await fetch(`/api/gallery/images?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete image');
            setImages(originalImages); // Revert on failure
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Media Gallery</h1>

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-xl p-12 mb-12 flex flex-col items-center justify-center transition-colors cursor-pointer
                    ${uploading ? 'bg-secondary/50 border-primary' : 'border-neutral-700 hover:border-primary hover:bg-neutral-900/50'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="text-muted-foreground">Uploading image...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-secondary">
                            <Upload className="text-primary" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-foreground">Click or drag image to upload</p>
                            <p className="text-sm text-neutral-500 mt-1">Supports JPG, PNG, WEBP</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-400">Uploaded Images ({images.length})</h2>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-neutral-500" size={32} />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 italic">
                        No images uploaded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((image) => (
                            <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                                {/* Image */}
                                <img
                                    src={image.url}
                                    alt="Gallery upload"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={(e) => handleDelete(image.id, e)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors border border-red-500/50"
                                        title="Delete image"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
