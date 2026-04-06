"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  // Ocultar Navbar en el estilo clásico (no hay header fijo)
  if (pathname?.startsWith("/classic")) {
    return null;
  }
  const [open, setOpen] = React.useState(false);

  const isActiveTheme = (href: string) => pathname === href;

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-4 md:px-10">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[10px]">
        <Link href="/" className="h-auto w-auto flex flex-row items-center">
          <Image
            src="/NavLogo.png"
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer hover:animate-slowspin"
          />
          <span className="font-bold ml-[10px] hidden md:block text-gray-300">
            WebChain Dev
          </span>
        </Link>

        {/* Menú único con enlaces + desplegable de temas */}
        <div className="relative flex items-center md:mr-20">
          <div className="flex items-center h-auto border border-[#7042f861] bg-[#0300145e] px-[12px] md:px-[16px] py-[8px] rounded-full text-gray-200">
            <a href="#about-me" className="cursor-pointer px-2">
              About me
            </a>
            <a href="#skills" className="cursor-pointer px-2">
              Skills
            </a>
            <a href="#projects" className="cursor-pointer px-2">
              Projects
            </a>
            <span className="mx-2 h-5 w-px bg-[#7042f861]" />

            {/* Botón de desplegable para temas */}
            <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-2 border border-[#7042f861] bg-[#0300145e] px-[16px] py-[8px] rounded-full text-gray-200 hover:border-[#8a5df8] hover:text-purple-200 transition-colors"
            >
              <span className="text-sm">Temas</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
              >
                <path d="M12 15.5a1 1 0 0 1-.7-.3l-5-5a1 1 0 1 1 1.4-1.4l4.3 4.3 4.3-4.3a1 1 0 0 1 1.4 1.4l-5 5a1 1 0 0 1-.7.3Z" />
              </svg>
            </button>
              {/* Panel del desplegable (solo temas) */}
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 min-w-[220px] border border-[#7042f861] bg-[#0b0820]/90 backdrop-blur-md rounded-xl shadow-lg shadow-[#2A0E61]/30 p-2"
                >
                  <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-purple-300/70">Temas</div>
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActiveTheme("/")
                          ? "bg-purple-700/40 text-purple-200 border border-purple-500/40"
                          : "hover:bg-[#1a1438] hover:text-purple-200"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      Space
                    </Link>
                    <Link
                      href="/classic"
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActiveTheme("/classic")
                          ? "bg-purple-700/40 text-purple-200 border border-purple-500/40"
                          : "hover:bg-[#1a1438] hover:text-purple-200"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      Classic
                    </Link>
                    <Link
                      href="/runic"
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActiveTheme("/runic")
                          ? "bg-purple-700/40 text-purple-200 border border-purple-500/40"
                          : "hover:bg-[#1a1438] hover:text-purple-200"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      Runic
                    </Link>
                    <Link
                      href="/cyber"
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActiveTheme("/cyber")
                          ? "bg-purple-700/40 text-purple-200 border border-purple-500/40"
                          : "hover:bg-[#1a1438] hover:text-purple-200"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      Cyber
                    </Link>
                    {/* Selector de temas página removida del dropdown */}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-row gap-5">
          {Socials.map((social) => (
            <Image
              src={social.src}
              alt={social.name}
              key={social.name}
              width={24}
              height={24}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
