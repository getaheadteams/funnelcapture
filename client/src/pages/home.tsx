import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Settings, Link as LinkIcon, Download, Globe, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();

  const handleLoadPage = () => {
    if (url) {
      // Basic URL validation/fix
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith("http")) {
        cleanUrl = "https://" + cleanUrl;
      }
      // Encode URL for safe passing
      setLocation(`/preview?url=${encodeURIComponent(cleanUrl)}`);
    }
  };

  const recentCaptures = [
    { domain: "dribbble.com/shots", time: "2 minutes ago", icon: "bg-purple-100 text-purple-600" },
    { domain: "nytimes.com", time: "Yesterday", icon: "bg-orange-100 text-orange-600" },
    { domain: "shopify.com/pricing", time: "3 days ago", icon: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="flex flex-col h-full p-6 pt-12 space-y-8 bg-gray-50/50 min-h-screen">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Screenshot</h1>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-500">
          <Settings className="w-6 h-6" />
        </Button>
      </header>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Enter a website URL</h2>
          <p className="text-slate-500 leading-relaxed">
            Paste the link of the page you want to capture. We'll generate a full-page screenshot for you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Website Address</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com" 
                className="pl-12 h-14 bg-white border-slate-200 shadow-sm rounded-xl text-base focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-md">
                <LinkIcon className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLoadPage}
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
          >
            <Download className="w-5 h-5 mr-2" />
            Load Page
          </Button>
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-lg font-bold text-slate-900">Recent Captures</h3>
          <button className="text-primary font-semibold text-sm hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          {recentCaptures.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item.domain}
            >
              <Card className="p-4 flex items-center gap-4 rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.icon}`}>
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{item.domain}</h4>
                  <p className="text-sm text-slate-400">{item.time}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
