"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { checkoutSchema, CheckoutFormData } from "@/lib/schemas";
import { ArrowLeft, Check, Lock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => setMounted(true), []);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinueToReview = () => {
    setErrors({});
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "Failed to initiate checkout");
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 bg-white/5 rounded w-32 animate-pulse" />
      </div>
    );
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Link href="/products">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] rounded-xl text-white font-medium px-8 h-12">
            Return to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  const fieldGroups = [
    {
      title: "Contact Information",
      fields: [
        { name: "firstName" as const, label: "First Name", type: "text", half: true },
        { name: "lastName" as const, label: "Last Name", type: "text", half: true },
        { name: "email" as const, label: "Email Address", type: "email", half: false },
        { name: "phone" as const, label: "Phone Number", type: "tel", half: false },
      ],
    },
    {
      title: "Shipping details",
      fields: [
        { name: "address" as const, label: "Street Address", type: "text", half: false },
        { name: "city" as const, label: "City", type: "text", half: true },
        { name: "state" as const, label: "State / Province", type: "text", half: true },
        { name: "zipCode" as const, label: "ZIP / Postal Code", type: "text", half: true },
        { name: "country" as const, label: "Country", type: "text", half: true },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
      </div>

      {}
      <div className="flex items-center justify-center mb-12 max-w-3xl mx-auto">
        <div className="flex items-center w-full relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6C63FF] rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          />

          <div className="relative flex justify-between w-full">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#6C63FF] text-white shadow-[0_0_15px_rgba(108,99,255,0.5)] z-10 transition-colors duration-500`}>
                <Check className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-white absolute -bottom-6">Shipping</span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-500 ${step === 2 ? 'bg-[#6C63FF] text-white shadow-[0_0_15px_rgba(108,99,255,0.5)]' : 'bg-[#1A1A2E] text-muted-foreground border-2 border-white/20'}`}>
                {step === 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className={`text-xs font-semibold absolute -bottom-6 ${step === 2 ? 'text-white' : 'text-muted-foreground'}`}>Review</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 bg-[#1A1A2E] text-muted-foreground border-2 border-white/20 transition-colors duration-500`}>
                3
              </div>
              <span className="text-xs font-semibold text-muted-foreground absolute -bottom-6">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 mt-16">
        
        {}
        <div className="lg:col-span-2">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {fieldGroups.map((group) => (
                <div key={group.title} className="glass rounded-3xl p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    {group.title === "Shipping details" ? <MapPin className="h-5 w-5 text-[#6C63FF]" /> : null}
                    {group.title}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {group.fields.map((field) => (
                      <div
                        key={field.name}
                        className={field.half ? "" : "sm:col-span-2"}
                      >
                        <Label
                          htmlFor={field.name}
                          className="text-sm font-medium text-muted-foreground mb-2 block ml-1"
                        >
                          {field.label}
                        </Label>
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          value={formData[field.name]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className={`bg-white/5 border-white/10 rounded-xl h-12 px-4 transition-all hover:bg-white/10 ${
                            errors[field.name]
                              ? "border-red-500/50 focus:border-red-500 focus:bg-white/10"
                              : "focus:border-[#6C63FF]/50 focus:bg-white/10"
                          }`}
                        />
                        {errors[field.name] && (
                          <p className="text-xs text-red-400 mt-1.5 ml-1">
                            {errors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleContinueToReview}
                className="w-full sm:w-auto sm:float-right bg-[#6C63FF] hover:bg-[#5A52E0] text-white rounded-xl h-12 px-8 text-base font-semibold shadow-lg shadow-[#6C63FF]/30 transition-all duration-300"
              >
                Continue to Review
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#6C63FF]" />
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Review Shipping Details</h2>
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-[#6C63FF] hover:text-white hover:bg-[#6C63FF] rounded-lg h-8 px-3 text-sm transition-colors">
                    Edit
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="text-muted-foreground mb-1 uppercase tracking-wider text-xs">Contact</h3>
                    <p className="font-medium text-white">{formData.firstName} {formData.lastName}</p>
                    <p className="text-muted-foreground">{formData.email}</p>
                    <p className="text-muted-foreground">{formData.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-muted-foreground mb-1 uppercase tracking-wider text-xs">Deliver To</h3>
                    <p className="font-medium text-white">{formData.address}</p>
                    <p className="text-muted-foreground">{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p className="text-muted-foreground">{formData.country}</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 sm:p-8 text-center text-muted-foreground">
                <Search className="h-10 w-10 mx-auto text-white/20 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Please verify your order details.</h3>
                <p>Ensure your items and shipping address are correct before placing the order.</p>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="lg:col-span-1">
          <div className="glass rounded-3xl p-6 lg:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-[#111122]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      Qty: {item.quantity} × <span className="text-[#6C63FF]">${item.price.toFixed(2)}</span>
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0 self-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="bg-white/10 my-6" />

            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-400 font-semibold text-xs tracking-wider uppercase bg-emerald-400/10 px-2 py-0.5 rounded-md">Free</span>
                  ) : (
                    <span className="text-white">${shipping.toFixed(2)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="bg-white/10 my-6" />

            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="block text-xl font-bold text-white">Total</span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#FF6584]">
                ${orderTotal.toFixed(2)}
              </span>
            </div>

            {step === 2 && (
              <Button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-[#FF6584] hover:bg-[#E5567A] text-white rounded-xl h-14 text-lg font-bold shadow-lg shadow-[#FF6584]/30 transition-all duration-300 disabled:opacity-50 group hover:-translate-y-1"
                id="place-order-button"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Complete Order
                  </span>
                )}
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Secure and encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
