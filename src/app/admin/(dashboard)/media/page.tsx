'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X, Trash2, Image as ImageIcon, Loader2, FolderPlus, Folder, ChevronLeft } from 'lucide-react';

interface GalleryImage {
    id: string;
    url: string;
    name: string;
    created_at: string;
    album_id: string | null;
}

interface Album {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
}

export default function MediaPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [activeTab, setActiveTab] = useState<'photos' | 'albums'>('photos');
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create Album State
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchImages(), fetchAlbums()]);
        setLoading(false);
    };

    const fetchImages = async () => {
        try {
            // If inside an album, filter by it. If "All Photos" (selectedAlbum null), fetch all.
            // Actually, for "All Photos" tab we want all. For "Albums" tab -> inside album we want filtered.
            // Let's handle filtering in the view or fetch based on view.
            const url = selectedAlbum
                ? `/api/gallery/images?album_id=${selectedAlbum.id}`
                : '/api/gallery/images';

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Failed to fetch images', error);
        }
    };

    const fetchAlbums = async () => {
        try {
            const res = await fetch('/api/gallery/albums');
            if (res.ok) {
                const data = await res.json();
                setAlbums(data);
            }
        } catch (error) {
            console.error('Failed to fetch albums', error);
        }
    };

    // Refetch images when selected album changes
    useEffect(() => {
        if (activeTab === 'albums' && selectedAlbum) {
            fetchImages();
        } else if (activeTab === 'photos') {
            setSelectedAlbum(null); // Reset selection when switching to all photos
            fetchImages();
        } else if (activeTab === 'albums' && !selectedAlbum) {
            // Just viewing list of albums, no images to fetch
            setImages([]);
        }
    }, [selectedAlbum, activeTab]);


    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (selectedAlbum) {
            formData.append('album_id', selectedAlbum.id);
        }

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
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this image?')) return;

        const originalImages = [...images];
        setImages(images.filter(img => img.id !== id));

        try {
            const res = await fetch(`/api/gallery/images?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Delete failed');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete image');
            setImages(originalImages);
        }
    };

    const handleCreateAlbum = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAlbumTitle.trim()) return;

        try {
            const res = await fetch('/api/gallery/albums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newAlbumTitle })
            });

            if (!res.ok) throw new Error('Failed to create album');

            const newAlbum = await res.json();
            setAlbums([newAlbum, ...albums]);
            setNewAlbumTitle('');
            setIsCreatingAlbum(false);
        } catch (error) {
            console.error('Create album error:', error);
            alert('Failed to create album');
        }
    };

    const handleDeleteAlbum = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this album? Images inside will be preserved but unassigned.')) return;

        const originalAlbums = [...albums];
        setAlbums(albums.filter(a => a.id !== id));

        try {
            const res = await fetch(`/api/gallery/albums?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete album');
        } catch (error) {
            console.error('Delete album error:', error);
            setAlbums(originalAlbums);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        {selectedAlbum ? (
                            <>
                                <button
                                    onClick={() => setSelectedAlbum(null)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                {selectedAlbum.title}
                            </>
                        ) : 'Media Gallery'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {selectedAlbum ? 'Manage images in this album' : 'Manage your photos and albums'}
                    </p>
                </div>

                {!selectedAlbum && (
                    <div className="flex bg-secondary/50 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'photos' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:text-primary'}`}
                        >
                            All Photos
                        </button>
                        <button
                            onClick={() => setActiveTab('albums')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'albums' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:text-primary'}`}
                        >
                            Albums
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            {activeTab === 'albums' && !selectedAlbum ? (
                // Album List View
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Albums</h2>
                        <button
                            onClick={() => setIsCreatingAlbum(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium"
                        >
                            <FolderPlus size={18} />
                            Create Album
                        </button>
                    </div>

                    {isCreatingAlbum && (
                        <form onSubmit={handleCreateAlbum} className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-end animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-sm font-medium">Album Title</label>
                                <input
                                    type="text"
                                    value={newAlbumTitle}
                                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                                    placeholder="Summer Vacation 2024"
                                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    type="submit"
                                    disabled={!newAlbumTitle.trim()}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingAlbum(false)}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {albums.map(album => (
                            <div
                                key={album.id}
                                onClick={() => setSelectedAlbum(album)}
                                className="group p-6 bg-card border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.01]"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Folder size={24} />
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteAlbum(album.id, e)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold mb-1">{album.title}</h3>
                                <p className="text-sm text-muted-foreground">Created {new Date(album.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Photo Grid View (All Photos OR Single Album)
                <div className="space-y-8 animate-in fade-in">
                    {/* Upload Area */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors cursor-pointer
                            ${uploading ? 'bg-secondary/50 border-primary' : 'border-neutral-700 hover:border-primary hover:bg-neutral-900/50'}`}
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
                                <p className="text-muted-foreground">Uploading to {selectedAlbum ? selectedAlbum.title : 'Gallery'}...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-secondary">
                                    <Upload className="text-primary" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-foreground">
                                        Upload to {selectedAlbum ? <span className="text-primary">{selectedAlbum.title}</span> : 'Gallery'}
                                    </p>
                                    <p className="text-sm text-neutral-500 mt-1">Supports JPG, PNG, WEBP</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Gallery Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-400">
                                {selectedAlbum ? 'Album Photos' : 'Recent Uploads'} ({images.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="animate-spin text-neutral-500" size={32} />
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-12 text-neutral-500 italic">
                                No images found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {images.map((image) => (
                                    <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
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
            )}
        </div>
    );
}
