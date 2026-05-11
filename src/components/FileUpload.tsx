'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image as ImageIcon, Video, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { validateFile, formatFileSize, FileCategory } from '@/lib/storage/validation'
import { uploadFile } from '@/lib/storage/upload'
import { useAuth } from '@/contexts/AuthContext'

interface FileWithPreview extends File {
  preview?: string
  id: string
}

interface FileUploadProps {
  category: FileCategory
  onUploadComplete?: (url: string, fileName: string) => void
  maxFiles?: number
  className?: string
}

export function FileUpload({ 
  category, 
  onUploadComplete,
  maxFiles = 10,
  className 
}: FileUploadProps) {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [files])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: FileWithPreview[] = []
    
    for (const file of newFiles) {
      const validation = validateFile(file, category)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        continue
      }

      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        preview: file.type.startsWith('image/') 
          ? URL.createObjectURL(file) 
          : undefined
      })

      validFiles.push(fileWithPreview)
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const uploadFiles = async () => {
    if (!user) {
      setError('You must be logged in to upload files')
      return
    }

    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      for (const file of files) {
        const result = await uploadFile(
          file,
          user.id,
          category,
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.id]: progress.percentage
            }))
          }
        )

        if (!result.success) {
          setError(result.error || 'Upload failed')
          continue
        }

        if (result.url && result.fileName) {
          onUploadComplete?.(result.url, result.fileName)
        }

        // Remove successfully uploaded file
        removeFile(file.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8" />
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          'relative border-2 border-dashed transition-all duration-300 group overflow-hidden',
          dragActive 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/20',
          uploading && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="p-10 text-center relative z-10">
          <div className={cn(
            "mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
            dragActive ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-700"
          )}>
            <Upload className={cn("h-8 w-8", dragActive && "animate-bounce")} />
          </div>
          
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">
              Drop {category.toLowerCase()} files here or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-blue-400 hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Supports {getCategoryDescription(category)}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Badge variant="outline" className="bg-slate-800/50 border-white/5 text-slate-400">
                Max {maxFiles} {maxFiles === 1 ? 'file' : 'files'}
              </Badge>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple={maxFiles > 1}
            accept={getAcceptString(category)}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Selected Files ({files.length}/{maxFiles})
            </h3>
            <Button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-4 py-2 transition-all hover:scale-105"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Now
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {files.map((file) => (
              <Card key={file.id} className="p-4 bg-slate-900/60 border-white/5 backdrop-blur-md rounded-2xl group transition-all hover:bg-slate-900/80">
                <div className="flex items-center gap-4">
                  {/* Preview/Icon */}
                  <div className="shrink-0 relative">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-14 w-14 object-cover rounded-xl border border-white/10"
                      />
                    ) : (
                      <div className="h-14 w-14 flex items-center justify-center bg-slate-800 rounded-xl text-slate-400 border border-white/10">
                        {getFileIcon(file)}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-slate-900/60 rounded-xl flex items-center justify-center">
                        <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {file.type.split('/')[1] || 'FILE'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {formatFileSize(file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {uploadProgress[file.id] !== undefined && (
                      <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                          style={{ width: `${uploadProgress[file.id]}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors"
                    onClick={() => removeFile(file.id)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getCategoryDescription(category: FileCategory): string {
  switch (category) {
    case 'IMAGE':
      return 'JPG, PNG, GIF, WebP up to 10MB'
    case 'VIDEO':
      return 'MP4, WebM, OGG up to 100MB'
    case 'DOCUMENT':
      return 'PDF, DOC, DOCX, XLS, XLSX up to 50MB'
    case 'AVATAR':
      return 'JPG, PNG, WebP up to 5MB'
    default:
      return 'Various file types'
  }
}

function getAcceptString(category: FileCategory): string {
  switch (category) {
    case 'IMAGE':
    case 'AVATAR':
      return 'image/*'
    case 'VIDEO':
      return 'video/*'
    case 'DOCUMENT':
      return '.pdf,.doc,.docx,.xls,.xlsx,.txt'
    default:
      return '*/*'
  }
}

