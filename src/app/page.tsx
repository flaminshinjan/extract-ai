"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle, Brain, Rocket, Zap, Globe, Layout, Search, Link2, ExternalLink, Filter, MoreHorizontal, AlignLeft, MessageSquare, Table2, List } from "lucide-react";
import { ThemeToggler } from "@/components/theme-toggler";

// Dashboard Preview Component
const DashboardPreview = () => {
  return (
    <div className="bg-card w-full h-full rounded-b-xl overflow-hidden">
      <div className="bg-muted/30 border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">Extract AI</span>
          </div>
          <div className="h-6 w-[1px] bg-border"></div>
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">JD</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 h-[calc(100%-48px)]">
        {/* Sidebar */}
        <div className="col-span-1 border-r border-border bg-background/50 p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-muted-foreground font-medium tracking-wider">Extract</h3>
            <div className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer">
              <Link2 className="h-4 w-4" />
              <span>Extract from URL</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-muted-foreground font-medium tracking-wider">Recent</h3>
            <div className="space-y-1">
              <div className="rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="truncate">How GPT-4 Works Explained</span>
              </div>
              <div className="rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="truncate">2024 AI Research Trends</span>
              </div>
              <div className="rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                <span className="truncate">Next.js App Router Guide</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-3 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Your Content</h1>
              <div className="flex items-center gap-3">
                <div className="flex border rounded-md overflow-hidden">
                  <button className="bg-muted/50 px-2 py-1 border-r">
                    <List className="h-4 w-4" />
                  </button>
                  <button className="px-2 py-1 border-r">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button className="px-2 py-1">
                    <Table2 className="h-4 w-4" />
                  </button>
                </div>
                <button className="p-1.5 rounded-md hover:bg-muted/50">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Extract Card */}
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">How GPT-4 Works Explained</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>openai.com</span>
                      <span>•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm flex items-start gap-2">
                  <AlignLeft className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Summary:</span>
                    <p className="text-muted-foreground mt-1">
                      GPT-4 represents a significant advancement in language model technology, featuring a transformer-based architecture with 1.8 trillion parameters. It demonstrates superior reasoning abilities, reduced hallucinations, and improved performance across diverse domains compared to previous models.
                    </p>
                  </div>
                </div>
                <div className="border-t pt-3 text-sm flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Key Points:</span>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      <li>• Uses a transformer architecture with 1.8T parameters</li>
                      <li>• Trained on diverse datasets to improve understanding</li>
                      <li>• 40% reduction in hallucinations compared to GPT-3.5</li>
                      <li>• Capable of processing both text and image inputs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Extract Card 2 (partial) */}
            <div className="border rounded-xl bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">2024 AI Research Trends</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>research.ai</span>
                      <span>•</span>
                      <span>8 min read</span>
                    </div>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm flex items-start gap-2">
                  <AlignLeft className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Summary:</span>
                    <p className="text-muted-foreground mt-1">
                      Key AI research trends for 2024 include multimodal models, efficiency improvements, trustworthy AI, and domain-specific applications. These developments are driving new capabilities while addressing computational and ethical challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="py-6 px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Extract AI</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggler />
          <Link href="/auth/sign-in" className="text-sm font-medium hover:underline">
            Sign In
          </Link>
          <Link 
            href="/auth/sign-up" 
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm mb-4">
              <span className="text-primary font-medium">Powered by Claude AI</span>
              <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                New
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Extract insights from any URL <br className="hidden md:inline" />
              <span className="text-primary">with AI precision</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Extract AI uses advanced artificial intelligence to analyze, summarize, and 
              extract key information from any content on the web in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/auth/sign-up" 
                className="bg-primary text-primary-foreground rounded-md px-6 py-3 text-base font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="bg-muted text-foreground rounded-md px-6 py-3 text-base font-medium hover:bg-muted/80 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-16 rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="bg-card p-4 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs bg-muted px-2 py-1 rounded flex-1 text-center text-muted-foreground">
                extract-ai.com/content
              </div>
            </div>
            {/* Replace the placeholder with the actual dashboard preview */}
            <div className="h-[500px]">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Transform how you consume web content</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Extract AI does more than just summarize. It intelligently processes content to give you exactly what you need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">AI-Powered Summaries</h3>
              <p className="text-muted-foreground">
                Get concise, accurate summaries of articles, research papers, and web pages using state-of-the-art AI.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Instant Extraction</h3>
              <p className="text-muted-foreground">
                Extract key points, data, and insights from any URL in seconds. No more manual note-taking.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Multiple Views</h3>
              <p className="text-muted-foreground">
                Switch between Notion-like, chat, and table views to interact with your content in different ways.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Universal Compatibility</h3>
              <p className="text-muted-foreground">
                Works with any public URL - news sites, blogs, research papers, documentation, and more.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Smart Search</h3>
              <p className="text-muted-foreground">
                Quickly find the information you need with powerful search across all your extracted content.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Advanced Models</h3>
              <p className="text-muted-foreground">
                Choose between different AI models for the perfect balance of speed, accuracy, and detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved by researchers and readers alike</h2>
            <p className="text-muted-foreground">
              Join thousands of professionals who save time and gain insights with Extract AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="italic text-muted-foreground mb-4">
                "Extract AI has transformed how I consume research papers. What used to take hours now takes minutes, and I don't miss any critical details."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">DR</span>
                </div>
                <div>
                  <p className="font-medium">Dr. Rebecca Chen</p>
                  <p className="text-sm text-muted-foreground">Research Scientist</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="italic text-muted-foreground mb-4">
                "As a journalist, I need to consume a lot of content quickly. Extract AI helps me identify key points from multiple sources in record time."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">MJ</span>
                </div>
                <div>
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm text-muted-foreground">Senior Editor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 md:px-10 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start extracting insights today</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use Extract AI to save time and get more value from online content.
          </p>
          
          <div className="bg-card border border-border rounded-lg p-8 max-w-xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Ready to transform how you read online?</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/sign-up" 
                className="bg-primary text-primary-foreground rounded-md px-6 py-3 text-base font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="bg-muted text-foreground rounded-md px-6 py-3 text-base font-medium hover:bg-muted/80 transition-colors"
              >
                Sign In
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Free plan available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-10 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Extract AI</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Extract AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
