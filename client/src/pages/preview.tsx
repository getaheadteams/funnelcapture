import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, RefreshCw, Lock, Share, Camera, Smartphone, Monitor, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import stripeMockImage from "@assets/generated_images/modern_saas_landing_page_mobile_screenshot.png";

export default function Preview() {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile");
  
  // Parse URL param
  const queryParams = new URLSearchParams(window.location.search);
  const targetUrl = queryParams.get("url") || "";
  const displayUrl = targetUrl ? targetUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : "stripe.com";

  // Check if we should use the high-fidelity mock
  const isStripe = displayUrl.includes("stripe.com");

  useEffect(() => {
    // Check if we should use the high-fidelity mock
    if (displayUrl.includes("stripe.com") && activeTab === 'mobile') {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [targetUrl, activeTab]);

  if (!targetUrl && !isStripe) {
    setLocation("/");
    return null;
  }

  const handleBack = () => {
    setLocation("/");
  };

  const handleCapture = () => {
    toast({
      title: "Screenshot Captured!",
      description: "Image saved to your Photos library.",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-2 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2 hover:bg-slate-50">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </Button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <Lock className="w-3 h-3" /> Secure
            </div>
            <h1 className="font-bold text-lg text-slate-900">{displayUrl.split('/')[0]}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setLoading(true)} className="-mr-2 hover:bg-slate-50">
            <RefreshCw className={`w-5 h-5 text-slate-900 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Tabs defaultValue="mobile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-11 bg-slate-100 p-1 rounded-xl grid grid-cols-2">
            <TabsTrigger 
              value="mobile" 
              className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </TabsTrigger>
            <TabsTrigger 
              value="desktop" 
              className="rounded-lg font-medium text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-200/50">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center flex-col gap-4"
            >
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Loading {displayUrl}...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-full h-full overflow-y-auto ${activeTab === 'desktop' ? 'overflow-x-auto' : ''}`}
            >
              <div className={`bg-white min-h-full transition-all duration-300 origin-top-left
                ${activeTab === 'desktop' ? 'w-[1024px] scale-[0.4] sm:scale-[0.5] md:scale-[0.7] lg:scale-100 origin-top-left' : 'w-full'}
              `}>
                
                {activeTab === 'mobile' && isStripe ? (
                   // Use the generated image for the Stripe mobile mock to look perfect
                   <img 
                     src={stripeMockImage} 
                     alt="Mobile Preview" 
                     className="w-full h-auto object-cover"
                   />
                ) : (
                  // Fallback to iframe for desktop or other URLs
                  <div className="relative w-full h-full bg-white">
                    <iframe 
                      src={targetUrl} 
                      className="w-full h-[200vh] border-none"
                      title="Preview"
                      sandbox="allow-scripts allow-same-origin"
                      style={{ pointerEvents: activeTab === 'mobile' ? 'none' : 'auto' }} 
                      onLoad={() => setLoading(false)}
                      onError={() => setLoading(false)}
                    />
                    
                    {/* Security/CORS Warning Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none bg-slate-50/50 backdrop-blur-[1px]">
                      <div className="bg-white/90 p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs pointer-events-auto">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Security Protection</h3>
                        <p className="text-sm text-slate-500 mb-4">
                          Some websites (like Google or Facebook) prevent themselves from being loaded inside other apps for security.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-lg"
                          onClick={() => window.open(targetUrl, '_blank')}
                        >
                          Open in Browser
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-slate-100 p-4 pb-8 sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-slate-200 hover:bg-slate-50 shrink-0 text-slate-700">
            <Share className="w-6 h-6" />
          </Button>
          <Button 
            onClick={handleCapture}
            className="flex-1 h-14 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all bg-primary hover:bg-blue-600 text-white"
          >
            <Camera className="w-5 h-5 mr-2" />
            Capture Full Page
          </Button>
        </div>
      </div>
    </div>
  );
}
