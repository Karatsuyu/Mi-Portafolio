"use client";
import { motion } from "framer-motion";

export default function GamerPage() {
  return (
    <main className="pt-20 relative z-10">
      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        {/* Glitch effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-20 bg-cyan-400 opacity-50 animate-pulse" />
          <div className="absolute top-40 right-20 w-2 h-32 bg-pink-500 opacity-50 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-2 h-16 bg-purple-500 opacity-50 animate-pulse" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <h1 className="gamer-heading text-6xl md:text-8xl mb-8 font-black tracking-wider">
              &gt; PLAYER_ONE
              <span className="block text-4xl md:text-6xl mt-4 animate-pulse">
                :: DEVELOPER ::
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="gamer-text text-xl mb-8 max-w-2xl mx-auto font-mono tracking-wide"
          >
            [SYSTEM_STATUS: ONLINE] Competitive developer specialized in high-performance 
            web applications. Ready to respawn your digital presence with epic code.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="gamer-button text-black px-8 py-4 rounded-lg font-bold tracking-wider">
              [LOAD_PROJECTS]
            </button>
            <button className="border-2 border-cyan-400 gamer-text px-8 py-4 rounded-lg font-bold tracking-wider hover:bg-cyan-400 hover:text-black transition-all">
              [DOWNLOAD_RESUME.EXE]
            </button>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="gamer-heading text-5xl text-center mb-16 font-black tracking-widest"
          >
            &lt;SKILL_TREE/&gt;
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'REACT.JS', level: 95 },
              { name: 'TYPESCRIPT', level: 90 },
              { name: 'NEXT.JS', level: 88 },
              { name: 'NODE.JS', level: 85 },
              { name: 'PYTHON', level: 80 },
              { name: 'POSTGRES', level: 75 },
              { name: 'DOCKER', level: 70 },
              { name: 'AWS_CLOUD', level: 65 }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="gamer-card p-6 text-center rounded-lg relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-pink-500" />
                <h3 className="gamer-text text-sm font-bold tracking-wider mb-2">{skill.name}</h3>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                  />
                </div>
                <span className="gamer-text text-xs">{skill.level}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="gamer-heading text-5xl text-center mb-16 font-black tracking-widest"
          >
            &lt;ACHIEVEMENT_UNLOCKED/&gt;
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { 
                title: '[WEB_APP_BOSS_DEFEATED]', 
                status: 'LEGENDARY', 
                score: '★★★★★',
                difficulty: 'NIGHTMARE'
              },
              { 
                title: '[E-COMMERCE_RAID_COMPLETED]', 
                status: 'EPIC', 
                score: '★★★★☆',
                difficulty: 'HARD'
              },
              { 
                title: '[API_SPEEDRUN_RECORD]', 
                status: 'RARE', 
                score: '★★★☆☆',
                difficulty: 'MEDIUM'
              },
              { 
                title: '[UI_DESIGN_COMBO_x50]', 
                status: 'COMMON', 
                score: '★★☆☆☆',
                difficulty: 'EASY'
              }
            ].map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="gamer-card rounded-lg overflow-hidden relative"
              >
                <div className="rgb-border absolute inset-0 rounded-lg" />
                <div className="relative bg-black m-1 rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl gamer-text animate-pulse">🎮</div>
                    <div className="absolute top-2 right-2 bg-pink-500 text-black text-xs px-2 py-1 rounded font-bold">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="gamer-heading text-lg mb-2 font-bold tracking-wide">{project.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="gamer-text text-sm">SCORE: {project.score}</span>
                      <span className="gamer-text text-sm">DIFF: {project.difficulty}</span>
                    </div>
                    <p className="gamer-text text-sm mb-4 font-mono">
                      Achievement unlocked! Epic web application built with cutting-edge 
                      gaming-inspired development techniques.
                    </p>
                    <button className="gamer-button text-black px-6 py-2 rounded-lg font-bold text-sm tracking-wider">
                      [INSPECT_CODE]
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}