
import React, { useState, useEffect } from 'react';

const verses = [
  { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Jehová es mi pastor; nada me faltará.", ref: "Salmo 23:1" },
  { text: "El nombre de Jehová es torre fuerte; a él correrá el justo, y será levantado.", ref: "Proverbios 18:10" },
  { text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes.", ref: "Josué 1:9" },
  { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.", ref: "Juan 14:27" },
  { text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas.", ref: "Jeremías 33:3" },
  { text: "Mas el Dios de toda gracia, os perfeccione, afirme, fortalezca y establezca.", ref: "1 Pedro 5:10" },
  { text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", ref: "Salmo 119:105" }
];

interface BibleVerseModalProps {
  onClose: () => void;
}

const BibleVerseModal: React.FC<BibleVerseModalProps> = ({ onClose }) => {
  const [selectedVerse, setSelectedVerse] = useState(verses[0]);

  useEffect(() => {
    const random = verses[Math.floor(Math.random() * verses.length)];
    setSelectedVerse(random);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-8 text-center relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl opacity-20">📖</div>
          <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Palabra del Día</h3>
          <p className="text-white text-xl font-serif italic leading-relaxed">
            "{selectedVerse.text}"
          </p>
        </div>
        <div className="p-6 text-center">
          <p className="text-indigo-600 font-bold mb-6">{selectedVerse.ref}</p>
          <button 
            onClick={onClose}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg"
          >
            Amén
          </button>
        </div>
      </div>
    </div>
  );
};

export default BibleVerseModal;
