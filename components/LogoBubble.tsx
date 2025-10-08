"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoBubble() {
  return (
    <motion.div
      className="relative rounded-[40%] bg-black/30 backdrop-blur-xl shadow-[0_0_60px_rgba(10,132,255,0.35)]"
      style={{ width: 300, height: 160 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
    >
      <Image
        src="/logo.png"
        alt="Q4 Logo"
        fill
        className="object-contain rounded-[40%]"
        priority
      />
    </motion.div>
  );
}

