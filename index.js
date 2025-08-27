import React from 'react'
import { motion } from 'framer-motion'
import { Cloud, Shield, Rocket, Mail } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-925 to-slate-900 text-slate-100">
      <header className="p-6 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-400" />
          AYOMIKUN PAIR
        </h1>
        <nav className="flex gap-6 text-sm">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
      </header>

      <main className="px-6 py-20 max-w-4xl mx-auto text-center">
        <motion.h2 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-4xl md:text-6xl font-bold">
          Host • Talk • Drive — unified
        </motion.h2>
        <p className="mt-6 text-lg text-slate-300">
          AYOMIKUN PAIR is your all‑in‑one platform for hosting, built‑in chat, and a secure cloud drive.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="#contact" className="px-6 py-3 bg-indigo-500 rounded-xl hover:bg-indigo-600">Get Started</a>
          <a href="#features" className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20">Learn More</a>
        </div>
      </main>

      <section id="features" className="px-6 py-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-center gap-2"><Cloud className="w-4 h-4"/> Global CDN</li>
          <li className="flex items-center gap-2"><Shield className="w-4 h-4"/> Enterprise Security</li>
        </ul>
      </section>

      <section id="contact" className="px-6 py-16 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-6">Contact</h3>
        <p className="text-slate-300 mb-4">For questions, reach out at:</p>
        <a href="mailto:ayomikunolorunferanmi@gmail.com" className="inline-flex items-center gap-2 text-indigo-400 hover:underline">
          <Mail className="w-5 h-5"/> ayomikunolorunferanmi@gmail.com
        </a>
      </section>

      <footer className="py-10 border-t border-white/10 text-center text-slate-400">
        © {new Date().getFullYear()} AYOMIKUN PAIR • Owned by AYOMIKUN techies
      </footer>
    </div>
  )
}
