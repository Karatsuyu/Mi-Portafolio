"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  RxDiscordLogo,
  RxGithubLogo,
  RxInstagramLogo,
  RxTwitterLogo,
  RxLinkedinLogo,
} from "react-icons/rx";

import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();
  // Hide the Space footer on Classic routes so content can center properly there.
  if (pathname?.startsWith("/classic")) {
    return null;
  }
  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px] ">
        <div className="w-full flex flex-col items-center justify-center m-auto">
            <div className="w-full h-full flex flex-row items-center justify-around flex-wrap">
                

                <div className="min-w-[200px] h-auto flex flex-col items-center justify-start">
                    <div className="font-bold text-[16px]">Community</div>
                    <a 
                      href="https://github.com/Karatsuyu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <RxGithubLogo />
                        <span className="text-[15px] ml-[6px]">Github</span>    
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <RxLinkedinLogo />
                        <span className="text-[15px] ml-[6px]">LinkedIn</span>    
                    </a>
                </div>
                <div className="min-w-[200px] h-auto flex flex-col items-center justify-start">
                    <div className="font-bold text-[16px]">Social Media</div>
                    <a 
                      href="https://www.instagram.com/tabjulian07/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <RxInstagramLogo />
                        <span className="text-[15px] ml-[6px]">Instagram</span>    
                    </a>
                    <a 
                      href="https://x.com/JulinTabar7259"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <RxTwitterLogo />
                        <span className="text-[15px] ml-[6px]">Twitter</span>    
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <RxLinkedinLogo />
                        <span className="text-[15px] ml-[6px]">LinkedIn</span>    
                    </a>
                </div>
                <div className="min-w-[200px] h-auto flex flex-col items-center justify-start">
                    <div className="font-bold text-[16px]">About</div>
                   <a 
                      href="mailto:julian.estiven.gutierrez@correounivalle.edu.co"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <span className="text-[15px] ml-[6px]">Contact me</span>    
                    </a>
                    <a 
                      href="#about-me"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors"
                    >
                        <span className="text-[15px] ml-[6px]">Learn about me</span>    
                    </a>
                    <a 
                      href="mailto:julian.estiven.gutierrez@correounivalle.edu.co"
                      className="flex flex-row items-center my-[15px] cursor-pointer hover:text-purple-400 transition-colors text-sm"
                    >
                        <span className="text-[13px] ml-[6px]">julian.estiven.gutierrez@correounivalle.edu.co</span>    
                    </a>
                </div>
            </div>

            <div className="mb-[20px] text-[15px] text-center">
                &copy; WebChain Dev 2024 Inc. All rights reserved
            </div>
        </div>
    </div>
  )
}

export default Footer