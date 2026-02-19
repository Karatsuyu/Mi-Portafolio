import type { Metadata } from "next";
import "./styles/globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gamer Portfolio - Cyberpunk Theme",
  description: "RGB neon cyberpunk gaming aesthetic portfolio with futuristic vibes",
};

export default function GamerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Gamer Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md rgb-border border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="gamer-heading text-2xl">
              &lt;GAMER/&gt;
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="gamer-text hover:text-pink-400 transition-colors text-sm tracking-wider">
                [SPACE]
              </Link>
              <Link href="/classic" className="gamer-text hover:text-pink-400 transition-colors text-sm tracking-wider">
                [CLASSIC]
              </Link>
              <Link href="/runic" className="gamer-text hover:text-pink-400 transition-colors text-sm tracking-wider">
                [RUNIC]
              </Link>
              <Link href="/gamer" className="text-pink-400 font-bold text-sm tracking-wider">
                [GAMER]
              </Link>
              <Link href="/themes" className="gamer-text hover:text-pink-400 transition-colors text-sm tracking-wider">
                [THEMES]
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>
      
      {children}
      
      {/* Gamer Footer */}
      <footer className="bg-black border-t border-cyan-400 py-12 mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="gamer-text text-sm tracking-wider">
            &gt;&gt; GAME OVER &lt;&lt; INSERT COIN TO CONTINUE &gt;&gt;
          </p>
        </div>
      </footer>
      
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}