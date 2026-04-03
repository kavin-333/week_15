"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UploadCloud, Link as LinkIcon, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useProducts";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddEditProductPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImageUrl(file.name); // Mock holding the file name
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    if (e.target.value.startsWith("http")) {
      setImagePreview(e.target.value);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Product saved successfully!");
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {}
      <div className="flex items-center justify-between">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Add New Product</h1>
          <p className="text-muted-foreground">Fill in the details to create a new product in the store.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl px-6 font-medium">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl shadow-lg shadow-[#6C63FF]/30 px-8 font-semibold transition-all">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Publish Product
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5 space-y-8">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4">General Details</h2>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">Product Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product title..."
                className="bg-white/5 border-white/10 rounded-xl h-12 px-4 focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors"
                required
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a comprehensive description of the product..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[160px] resize-y focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors outline-none text-sm placeholder:text-muted-foreground/50 custom-scrollbar"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Price (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 rounded-xl h-12 pl-8 focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Stock Quantity *</Label>
                <Input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="bg-white/5 border-white/10 rounded-xl h-12 px-4 focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val || "")}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 rounded-xl h-12 px-4 focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors data-[state=open]:border-[#6C63FF]/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A2E] border-white/10 rounded-xl">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug} className="hover:bg-white/5 rounded-lg cursor-pointer my-1">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass rounded-3xl p-8 border-white/5">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4 mb-6">Product Media</h2>
            
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-white/20 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-8 text-center cursor-pointer group flex flex-col items-center justify-center min-h-[240px]"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden glass">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageUrl(""); }} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-lg hover:bg-red-500/80 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="h-8 w-8 text-[#6C63FF]" />
                    </div>
                    <p className="font-semibold mb-1">Upload Image</p>
                    <p className="text-xs text-muted-foreground mb-6 max-w-[200px]">Drag and drop your image here, or click to browse files.</p>
                    <Button variant="outline" className="border-[#6C63FF]/30 text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-xl h-10 px-6 font-medium">
                      Select File
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-xs text-muted-foreground uppercase font-semibold">Or provide URL</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-2 block">Image URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={imageUrl}
                    onChange={handleUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="bg-white/5 border-white/10 rounded-xl h-12 pl-10 focus:border-[#6C63FF]/50 focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
