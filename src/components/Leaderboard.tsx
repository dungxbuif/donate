'use client';

import { Donor } from '@/lib/data';
import { useEffect, useRef, useState } from 'react';

interface LeaderboardProps {
   donors: Donor[];
   totalAmount: number;
}

export default function Leaderboard({ donors, totalAmount }: LeaderboardProps) {
   const totalDisplayRef = useRef<HTMLDivElement>(null);
   const fireworksContainerRef = useRef<HTMLDivElement>(null);
   const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   useEffect(() => {
      if (totalDisplayRef.current) {
         animateValue(totalDisplayRef.current, 0, totalAmount, 2000);
      }

      // Start animations
      const cleanupFireworks = startFireworksShow();
      const cleanupSparkles = startSparkles();
      const cleanupEmojiRain = startEmojiRain();
      const cleanupClickEffects = addClickEffects();

      return () => {
         cleanupFireworks();
         cleanupSparkles();
         cleanupEmojiRain();
         cleanupClickEffects();
      };
   }, [totalAmount]);

   // Prevent body scroll when modal is open
   useEffect(() => {
      if (isModalOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = '';
      }

      return () => {
         document.body.style.overflow = '';
      };
   }, [isModalOpen]);

   const handleRefresh = () => {
      showPartyMode();
      setTimeout(() => {
         window.location.reload();
      }, 1000);
   };

   const handleRowClick = (donor: Donor) => {
      setSelectedDonor(donor);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedDonor(null);
   };

   // Close modal on Escape key
   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isModalOpen) {
            closeModal();
         }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
   }, [isModalOpen]);

   const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleString('vi-VN', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
      });
   };

   return (
      <>
         <div
            className="fireworks-container"
            id="fireworksContainer"
            ref={fireworksContainerRef}
         ></div>

         <div className="royal-corner royal-top-left">⚜️</div>
         <div className="royal-corner royal-top-right">⚜️</div>
         <div className="royal-corner royal-bottom-left">⚜️</div>
         <div className="royal-corner royal-bottom-right">⚜️</div>

         <div className="royal-ornament royal-left">🏛️</div>
         <div className="royal-ornament royal-right">🏛️</div>

         <main>
            <div className="floating-emoji">💰</div>
            <div className="floating-emoji">🎊</div>
            <div className="floating-emoji">✨</div>
            <div className="floating-emoji">🚀</div>
            <div className="floating-emoji">🎯</div>
            <div className="floating-emoji">🏆</div>

            <div id="header">
               <h1>💎 Donation Ranking</h1>
               <div className="header-actions">
                  <div className="qr-section">
                     <img
                        src="/donate-qr.png"
                        alt="Donate QR Code"
                        className="donate-qr"
                        title="Scan to donate"
                     />
                     <span className="qr-label">💰 Scan to Donate</span>
                  </div>
                  <button
                     className="continue"
                     onClick={handleRefresh}
                     style={{ animation: 'float 3s ease-in-out infinite' }}
                  >
                     <i className="ph ph-arrow-clockwise"></i>
                  </button>
               </div>
            </div>

            <div id="leaderboard">
               <div className="ribbon"></div>

               <div id="total-container">
                  <div className="total-label">Total Donations</div>
                  <div className="total-amount" ref={totalDisplayRef}>
                     0 VND
                  </div>
               </div>

               <table id="donationTable">
                  <thead>
                     <tr>
                        <td className="number">Rank</td>
                        <td className="name">Name</td>
                        <td className="points">Donation</td>
                     </tr>
                  </thead>
                  <tbody>
                     {donors.map((donation, index) => {
                        let rowClass = '';
                        let badge = null;
                        let namePrefix = null;
                        let medal = null;

                        if (index === 0) {
                           rowClass = 'top-donor-row';
                           badge = (
                              <span className="rank-badge badge-gold">
                                 Champion
                              </span>
                           );
                           namePrefix = <span className="crown-icon">👑</span>;
                           medal = (
                              <img
                                 className="gold-medal"
                                 src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                                 alt="gold medal"
                              />
                           );
                        } else if (index === 1) {
                           badge = (
                              <span className="rank-badge badge-silver">
                                 2nd Place
                              </span>
                           );
                        } else if (index === 2) {
                           badge = (
                              <span className="rank-badge badge-bronze">
                                 3rd Place
                              </span>
                           );
                        }

                        return (
                           <tr
                              key={index}
                              className={`${rowClass} donor-row`}
                              style={{
                                 animationDelay: `${(index + 1) * 0.1}s`,
                                 cursor: 'pointer',
                              }}
                              onClick={() => handleRowClick(donation)}
                              title="Click to view transaction history"
                           >
                              <td className="number">{index + 1}</td>
                              <td className="name">
                                 <div className="name-content">
                                    <img
                                       src={
                                          donation.Avatar ||
                                          `https://api.dicebear.com/9.x/avataaars/svg?seed=${donation.UserName}`
                                       }
                                       alt="avatar"
                                       className="donor-avatar"
                                    />
                                    {namePrefix}
                                    {donation.UserName}
                                    {badge}
                                 </div>
                              </td>
                              <td className="points">
                                 <div className="points-content">
                                    {donation.Amount} VND
                                    {medal}
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </main>

         {/* Transaction History Modal */}
         {isModalOpen && selectedDonor && (
            <div className="modal-overlay" onClick={closeModal}>
               <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="modal-header">
                     <div className="modal-user-info">
                        <img
                           src={
                              selectedDonor.Avatar ||
                              `https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedDonor.UserName}`
                           }
                           alt="avatar"
                           className="modal-avatar"
                        />
                        <div>
                           <h2>{selectedDonor.UserName}</h2>
                           <p className="total-donated">
                              Total: {selectedDonor.Amount} VND
                           </p>
                        </div>
                     </div>
                     <button className="modal-close" onClick={closeModal}>
                        ×
                     </button>
                  </div>

                  <div className="modal-body">
                     <h3>
                        💰 Transaction History (
                        {selectedDonor.transactions.length} transactions)
                     </h3>
                     <div className="transactions-list">
                        {selectedDonor.transactions.map((transaction, idx) => (
                           <div key={idx} className="transaction-item">
                              <div className="transaction-header">
                                 <span className="transaction-amount">
                                    {new Intl.NumberFormat('vi-VN').format(
                                       transaction.amount
                                    )}{' '}
                                    VND
                                 </span>
                                 <span className="transaction-time">
                                    {formatDate(transaction.timestamp)}
                                 </span>
                              </div>
                              {transaction.message && (
                                 <div className="transaction-message">
                                    💬 {transaction.message}
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

// Animation Helper Functions

function animateValue(
   obj: HTMLElement,
   start: number,
   end: number,
   duration: number
) {
   let startTimestamp: number | null = null;
   const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      obj.innerHTML = new Intl.NumberFormat('vi-VN').format(current) + ' VND';
      if (progress < 1) {
         window.requestAnimationFrame(step);
      }
   };
   window.requestAnimationFrame(step);
}

function startFireworksShow() {
   const intervalId1 = setInterval(() => {
      if (Math.random() < 0.7) {
         createFirework();
      }
   }, 2000);

   const intervalId2 = setInterval(() => {
      if (Math.random() < 0.3) {
         for (let i = 0; i < 3; i++) {
            setTimeout(() => createFirework(), i * 500);
         }
      }
   }, 8000);

   return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
   };
}

function createFirework() {
   const container = document.getElementById('fireworksContainer');
   if (!container) return;

   const colors = ['🎆', '🎇', '✨', '🌟', '💫', '⭐', '🌠', '💥', '🎊'];

   const firework = document.createElement('div');
   firework.className = 'firework';
   firework.innerHTML = colors[Math.floor(Math.random() * colors.length)];
   firework.style.left = Math.random() * 100 + '%';
   firework.style.bottom = '0px';
   firework.style.fontSize = Math.random() * 1.5 + 2 + 'rem';
   firework.style.animationDuration = Math.random() * 2 + 4 + 's';
   firework.style.animationDelay = Math.random() * 2 + 's';

   container.appendChild(firework);

   setTimeout(() => {
      createFireworkExplosion(firework.offsetLeft, firework.offsetTop);
   }, 3000);

   setTimeout(() => {
      if (firework.parentNode) {
         firework.parentNode.removeChild(firework);
      }
   }, 8000);
}

function createFireworkExplosion(x: number, y: number) {
   const container = document.getElementById('fireworksContainer');
   if (!container) return;

   const particles = ['✨', '💫', '⭐', '🌟', '💥'];

   const explosion = document.createElement('div');
   explosion.className = 'firework-explode';
   explosion.innerHTML = '💥';
   explosion.style.left = x + 'px';
   explosion.style.top = y + 'px';
   container.appendChild(explosion);

   for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.innerHTML =
         particles[Math.floor(Math.random() * particles.length)];
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';

      const angle = (i * 30 * Math.PI) / 180;
      const distance = 100 + Math.random() * 50;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      particle.style.animationDelay = Math.random() * 0.5 + 's';

      container.appendChild(particle);

      setTimeout(() => {
         if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
         }
      }, 3000);
   }

   setTimeout(() => {
      if (explosion.parentNode) {
         explosion.parentNode.removeChild(explosion);
      }
   }, 2000);
}

function startSparkles() {
   const createSparkles = () => {
      const sparkleCount = 30;
      for (let i = 0; i < sparkleCount; i++) {
         setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkle 3s ease-in-out forwards';
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 3000);
         }, i * 100);
      }
   };

   const timeoutId = setTimeout(createSparkles, 1000);
   const intervalId = setInterval(createSparkles, 10000);

   return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
   };
}

function startEmojiRain() {
   const intervalId = setInterval(() => {
      if (Math.random() < 0.3) {
         const rainEmojis = ['💰', '💎', '🌟', '✨', '🎯', '🚀', '🎊', '🏆'];
         const emoji = document.createElement('div');
         emoji.innerHTML =
            rainEmojis[Math.floor(Math.random() * rainEmojis.length)];
         emoji.style.position = 'fixed';
         emoji.style.left = Math.random() * window.innerWidth + 'px';
         emoji.style.top = '-30px';
         emoji.style.fontSize = Math.random() * 15 + 15 + 'px';
         emoji.style.pointerEvents = 'none';
         emoji.style.zIndex = '999';
         emoji.style.animation = `confetti ${
            Math.random() * 4 + 3
         }s linear forwards`;

         document.body.appendChild(emoji);

         setTimeout(() => emoji.remove(), 7000);
      }
   }, 2000);

   return () => clearInterval(intervalId);
}

function addClickEffects() {
   const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');
      if (row && !row.querySelector('.number')) return;

      const explosion = document.createElement('div');
      explosion.innerHTML = '💥✨🎊';
      explosion.style.position = 'absolute';
      explosion.style.left = e.pageX + 'px';
      explosion.style.top = e.pageY + 'px';
      explosion.style.fontSize = '2rem';
      explosion.style.pointerEvents = 'none';
      explosion.style.zIndex = '1000';
      explosion.style.animation = 'bounce 1s ease-out';

      document.body.appendChild(explosion);

      setTimeout(() => explosion.remove(), 1000);
   };

   document.addEventListener('click', handler);
   return () => document.removeEventListener('click', handler);
}

function showPartyMode() {
   const main = document.querySelector('main');
   if (main) main.style.animation = 'wobble 2s ease-in-out';

   createConfetti();

   document.body.style.animation = 'party 2s ease infinite';

   setTimeout(() => {
      if (main) main.style.animation = '';
      document.body.style.animation = '';
   }, 4000);
}

function createConfetti() {
   const colors = [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#feca57',
      '#ff9ff3',
      '#54a0ff',
   ];
   const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎁', '🏆', '💰', '💎'];

   for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.innerHTML =
         Math.random() > 0.5
            ? emojis[Math.floor(Math.random() * emojis.length)]
            : '•';
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-20px';
      confetti.style.fontSize = Math.random() * 20 + 10 + 'px';
      confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1001';
      confetti.style.animation = `confetti ${
         Math.random() * 3 + 2
      }s ease-out forwards`;

      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
   }
}
