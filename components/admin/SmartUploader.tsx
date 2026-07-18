'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Loader2, 
  Image as ImageIcon, 
  Plus,
  CloudUpload,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';

interface SmartUploaderProps {
  value?: string | string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  maxFiles?: number;
  className?: string;
  accept?: string;
}

interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  preview?: string;
  type: 'image' | 'video' | 'pdf';
}

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  return url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|ogg|m4v)($|\?)/i);
};

const isPdfUrl = (url?: string) => {
  if (!url) return false;
  return url.includes('/raw/upload/') || url.match(/\.pdf($|\?)/i);
};

export function SmartUploader({ 
  value,
  onChange, 
  multiple = false, 
  label = "اسحب أو اضغط للرفع",
  maxFiles = 10,
  className = "",
  accept = "image/*,video/*,application/pdf"
}: SmartUploaderProps) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrls = Array.isArray(value) ? value : (value ? [value] : []);
  const latestUrlsRef = useRef<string[]>(currentUrls);

  useEffect(() => {
    latestUrlsRef.current = Array.isArray(value) ? value : (value ? [value] : []);
  }, [value]);

  const startUpload = async (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const preview = URL.createObjectURL(file);
    let fileType: 'image' | 'video' | 'pdf' = 'image';
    let resourceType = 'image';
    if (file.type.startsWith('video/')) {
      fileType = 'video';
      resourceType = 'video';
    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      fileType = 'pdf';
      resourceType = 'raw';
    }
    
    const newUpload: UploadStatus = {
      id,
      name: file.name,
      progress: 0,
      status: 'uploading',
      preview,
      type: fileType
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      const signRes = await fetch('/api/admin/upload/sign', { method: 'POST' });
      if (!signRes.ok) throw new Error('Failed to get signature');
      const { signature, timestamp, api_key, cloud_name } = await signRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: percentComplete } : u));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          const newUrl = response.secure_url;
          
          setUploads(prev => prev.filter(u => u.id !== id));
          URL.revokeObjectURL(preview);
          
          let newUrls;
          if (multiple) {
            newUrls = [...latestUrlsRef.current, newUrl];
          } else {
            newUrls = [newUrl];
          }
          latestUrlsRef.current = newUrls;
          onChange(newUrls);

        } else {
          setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error' } : u));
          toast(`فشل رفع ${file.name}`, 'error');
        }
      };

      xhr.onerror = () => {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error' } : u));
        toast(`خطأ في الشبكة أثناء رفع ${file.name}`, 'error');
      };

      xhr.send(formData);
    } catch (error) {
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error' } : u));
      toast(`حدث خطأ: ${file.name}`, 'error');
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      toast('يرجى اختيار ملف واحد فقط', 'error');
      startUpload(fileArray[0]);
      return;
    }

    if (!multiple) {
        setUploads([]);
    }

    fileArray.slice(0, maxFiles).forEach(startUpload);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeUrl = (urlToRemove: string) => {
    const newUrls = currentUrls.filter(url => url !== urlToRemove);
    latestUrlsRef.current = newUrls;
    onChange(newUrls);
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const triggerSelect = () => fileInputRef.current?.click();

  if (!multiple) {
    const hasImage = currentUrls.length > 0;
    const activeUpload = uploads[0];

    return (
      <div 
        className={`relative w-full aspect-video md:aspect-[21/9] rounded-[1.5rem] overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-300 group ${className} ${isDragging ? 'border-gold bg-gold/5 scale-[0.99]' : 'hover:border-gold/30'}`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input type="file" hidden ref={fileInputRef} onChange={e => handleFiles(e.target.files)} accept={accept} />
        
        {(hasImage || activeUpload) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {(activeUpload?.type === 'video' || (!activeUpload && isVideoUrl(currentUrls[0]))) ? (
              <video 
                src={activeUpload ? activeUpload.preview : currentUrls[0]} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                loop 
                playsInline
              />
            ) : (activeUpload?.type === 'pdf' || (!activeUpload && isPdfUrl(currentUrls[0]))) ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white/60">
                <div className="mb-2 rounded-xl bg-gold/10 p-3 text-gold">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold truncate max-w-[200px]">
                  {activeUpload ? activeUpload.name : (currentUrls[0].split('/').pop() || 'بروشور PDF')}
                </span>
              </div>
            ) : (
              <img 
                src={activeUpload ? activeUpload.preview : currentUrls[0]} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            )}
            <div className="absolute inset-0 bg-rich-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              {(!activeUpload || activeUpload.status === 'error') && (
                <>
                  <button type="button" onClick={triggerSelect} className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold hover:text-rich-black transition-colors" title="تغيير الملف">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => hasImage ? removeUrl(currentUrls[0]) : removeUpload(activeUpload!.id)} className="w-12 h-12 rounded-xl bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors" title="حذف الملف">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {activeUpload && activeUpload.status === 'uploading' && (
              <div className="absolute inset-0 bg-rich-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-gold transition-all duration-300" style={{ width: `${activeUpload.progress}%` }} />
                </div>
                <span className="text-gold font-bold font-mono text-xs mt-2">{activeUpload.progress}%</span>
              </div>
            )}
            {activeUpload && activeUpload.status === 'error' && (
              <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center backdrop-blur-sm text-white">
                <AlertCircle className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold">فشل الرفع</span>
              </div>
            )}
          </div>
        ) : (
          <div onClick={triggerSelect} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-gold/10 group-hover:scale-110 transition-all duration-500">
               <CloudUpload className={`w-6 h-6 ${isDragging ? 'text-gold' : 'text-white/40 group-hover:text-gold'}`} />
             </div>
             <p className="text-sm font-bold text-white/70">{label}</p>
             <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">الصور، الفيديوهات، ملفات PDF</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 ${className}`}>
      <input type="file" hidden ref={fileInputRef} multiple onChange={e => handleFiles(e.target.files)} accept={accept} />
      
        {currentUrls.map((url, idx) => (
          <div 
            key={url + idx}
            className="relative aspect-square rounded-[1.2rem] overflow-hidden border border-white/5 group bg-white/5"
          >
            {isVideoUrl(url) ? (
              <video src={url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
            ) : isPdfUrl(url) ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/60 p-4 text-center">
                <svg className="w-8 h-8 mb-1 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] truncate max-w-full">
                  {url.split('/').pop() || 'PDF'}
                </span>
              </div>
            ) : (
              <img src={url} alt="Gallery item" className="w-full h-full object-cover" loading="lazy" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button 
              type="button"
              onClick={() => removeUrl(url)}
              className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:scale-110 transition-all shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {uploads.map((upload) => (
          <div 
            key={upload.id}
            className="relative aspect-square rounded-[1.2rem] overflow-hidden border border-white/10 bg-white/5"
          >
            {upload.type === 'video' ? (
              <video src={upload.preview} className="w-full h-full object-cover opacity-50 blur-sm" autoPlay muted loop playsInline />
            ) : upload.type === 'pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/40 p-4 text-center blur-[1px]">
                <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] truncate max-w-full">{upload.name}</span>
              </div>
            ) : (
              <img src={upload.preview} alt={upload.name} className="w-full h-full object-cover opacity-50 blur-sm" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-rich-black/40">
              {upload.status === 'uploading' ? (
                <>
                  <Loader2 className="w-6 h-6 text-gold animate-spin mb-2" />
                  <div className="w-3/4 h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-gold transition-all duration-300" style={{ width: `${upload.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-gold font-bold mt-1 font-mono">{upload.progress}%</span>
                </>
              ) : upload.status === 'error' ? (
                <>
                  <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
                  <button type="button" onClick={() => removeUpload(upload.id)} className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}

      <div 
        onClick={triggerSelect}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`
          aspect-square rounded-[1.2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group
          ${isDragging ? 'border-gold bg-gold/10 scale-[0.98]' : 'border-white/10 bg-white/[0.02] hover:border-gold/30 hover:bg-white/5'}
        `}
      >
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-gold/10 group-hover:scale-110 transition-all duration-500">
           <Plus className={`w-5 h-5 ${isDragging ? 'text-gold' : 'text-white/40 group-hover:text-gold'}`} />
        </div>
        <span className="text-[10px] font-bold text-white/50 group-hover:text-gold/80 transition-colors uppercase tracking-widest text-center px-2 leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
}
