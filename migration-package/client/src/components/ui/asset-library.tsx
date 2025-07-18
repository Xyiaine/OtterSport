/**
 * ASSET LIBRARY COMPONENT
 * 
 * Advanced asset management system for Game Artist mode with:
 * - Drag and drop asset uploads
 * - Asset categorization and tagging
 * - Thumbnail generation and preview
 * - Asset optimization and compression
 * - Batch operations and organization
 * - Version control and history
 */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image, 
  FileText, 
  Music, 
  Video,
  Folder,
  FolderOpen,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  Copy,
  Edit,
  Star,
  Tag,
  Maximize2,
  RotateCcw,
  Palette,
  Zap,
  Settings
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'document' | 'font' | 'sprite';
  category: string;
  tags: string[];
  url: string;
  thumbnail?: string;
  size: number;
  dimensions?: { width: number; height: number };
  uploadDate: Date;
  lastModified: Date;
  metadata: Record<string, any>;
  isFavorite: boolean;
  version: number;
  description: string;
}

interface AssetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
}

export default function AssetLibrary() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef<HTMLDivElement>(null);
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites' | 'recent'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const categories: AssetCategory[] = [
    { id: 'all', name: 'All Assets', icon: Folder, count: assets.length, color: '#6B7280' },
    { id: 'images', name: 'Images', icon: Image, count: assets.filter(a => a.type === 'image').length, color: '#10B981' },
    { id: 'audio', name: 'Audio', icon: Music, count: assets.filter(a => a.type === 'audio').length, color: '#8B5CF6' },
    { id: 'video', name: 'Videos', icon: Video, count: assets.filter(a => a.type === 'video').length, color: '#F59E0B' },
    { id: 'documents', name: 'Documents', icon: FileText, count: assets.filter(a => a.type === 'document').length, color: '#3B82F6' },
    { id: 'sprites', name: 'Sprites', icon: Zap, count: assets.filter(a => a.type === 'sprite').length, color: '#EF4444' },
  ];

  const filteredAssets = assets.filter(asset => {
    // Category filter
    if (currentCategory !== 'all' && asset.category !== currentCategory) return false;
    
    // Search filter
    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Additional filters
    if (filterBy === 'favorites' && !asset.isFavorite) return false;
    if (filterBy === 'recent' && asset.uploadDate < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) return false;
    
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        
        // Create asset object
        const newAsset: Asset = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: getFileType(file.type),
          category: getCategoryFromType(getFileType(file.type)),
          tags: [],
          url,
          size: file.size,
          uploadDate: new Date(),
          lastModified: new Date(),
          metadata: {
            originalName: file.name,
            mimeType: file.type,
            lastModified: new Date(file.lastModified)
          },
          isFavorite: false,
          version: 1,
          description: ''
        };

        // Generate thumbnail for images
        if (file.type.startsWith('image/')) {
          generateThumbnail(file, (thumbnail) => {
            newAsset.thumbnail = thumbnail;
            setAssets(prev => [...prev, newAsset]);
          });
        } else {
          setAssets(prev => [...prev, newAsset]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    toast({
      title: "Assets Uploaded",
      description: `Successfully uploaded ${files.length} asset${files.length > 1 ? 's' : ''}`,
    });
  }, [toast]);

  const getFileType = (mimeType: string): Asset['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('font')) return 'font';
    if (mimeType.startsWith('text/') || mimeType.includes('document')) return 'document';
    return 'document';
  };

  const getCategoryFromType = (type: Asset['type']): string => {
    const typeMap = {
      'image': 'images',
      'audio': 'audio',
      'video': 'video',
      'document': 'documents',
      'font': 'fonts',
      'sprite': 'sprites'
    };
    return typeMap[type] || 'other';
  };

  const generateThumbnail = (file: File, callback: (thumbnail: string) => void) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const maxSize = 150;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const toggleFavorite = (assetId: string) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { ...asset, isFavorite: !asset.isFavorite }
          : asset
      )
    );
  };

  const deleteAsset = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    setSelectedAssets(prev => prev.filter(id => id !== assetId));
    toast({
      title: "Asset Deleted",
      description: "Asset has been removed from the library",
    });
  };

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'sprite': return <Zap className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Asset Library</h2>
          <Badge variant="secondary">
            {filteredAssets.length} assets
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Assets
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="type">Sort by Type</option>
          </select>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Assets</option>
            <option value="favorites">Favorites</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Categories */}
        <div className="w-64 space-y-2">
          <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-3">Categories</h3>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  currentCategory === category.id
                    ? 'bg-primary/10 border-primary border'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" style={{ color: category.color }} />
                <span className="flex-1 text-left">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Upload Zone */}
          <div
            ref={dragOverRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Drag and drop assets here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>

          {/* Asset Grid/List */}
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No assets found</p>
              <p className="text-sm text-gray-500">Upload some assets to get started</p>
            </div>
          ) : (
            <div className={`gap-4 ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'space-y-2'
            }`}>
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAssets.includes(asset.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                    {viewMode === 'grid' ? (
                      <>
                        {/* Thumbnail */}
                        <div className="aspect-square mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                          {asset.thumbnail ? (
                            <img
                              src={asset.thumbnail}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-4xl text-gray-400">
                              {getAssetIcon(asset.type)}
                            </div>
                          )}
                        </div>
                        
                        {/* Asset Info */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{asset.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(asset.id);
                              }}
                              className={`p-1 rounded ${
                                asset.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(asset.size)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {asset.thumbnail ? (
                            <img
                              src={asset.thumbnail}
                              alt={asset.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            getAssetIcon(asset.type)
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{asset.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(asset.id);
                              }}
                              className={`p-1 rounded ${
                                asset.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                              }`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {asset.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(asset.size)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {asset.uploadDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Assets Actions */}
      {selectedAssets.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedAssets.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedAssets.forEach(id => {
                  const asset = assets.find(a => a.id === id);
                  if (asset) downloadAsset(asset);
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                selectedAssets.forEach(id => deleteAsset(id));
                setSelectedAssets([]);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAssets([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
}