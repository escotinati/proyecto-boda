import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Clock, MapPin, Bus, Heart, ChevronDown, X } from 'lucide-react';

// --- ANIMACIONES BASE ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }
};

// --- COMPONENTE: SECCIÓN FAQ ---
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿HAY UN CÓDIGO DE VESTIMENTA?",
      answer: "Queremos que te sientas especial. El dress code es Formal/Cóctel. Recomendamos calzado cómodo para los momentos en el viñedo."
    },
    {
      question: "¿CÓMO LLEGO AL LUGAR?",
      answer: "La ceremonia y la celebración serán en el Restaurante Eneko (Larrabetzu). Facilitaremos servicio de autobús desde Getxo y Zumarraga."
    },
    {
      question: "¿PUEDO IR CON NIÑOS?",
      answer: "Para que todos los invitados puedan disfrutar al máximo, hemos optado por una celebración solo para adultos. ¡Gracias por vuestra comprensión!"
    },
    {
      question: "¿DIETA ESPECIAL O INTOLERANCIAS?",
      answer: "Por supuesto. En el formulario de abajo podrás indicarnos cualquier necesidad especial para que el equipo de cocina lo tenga previsto."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-white px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16">
          <motion.h2 {...fadeInUp} className="text-5xl md:text-6xl serif italic">Info Útil</motion.h2>
          <motion.div {...fadeInUp} className="w-12 h-px bg-slate-200 mx-auto mt-6" />
        </header>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div key={index} {...fadeInUp} className="py-2">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center py-6 text-left hover:opacity-60 transition-opacity"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-800">{faq.question}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-slate-500 serif italic text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE PRINCIPAL ---
const WeddingPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', email: '',
    asiste: '', intolerancias: '', otraIntolerancia: '',
    bus: '', parada: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Efecto Parallax para el Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // 1. Efecto Zoom: La imagen empieza grande (1.2) y vuelve a su tamaño original (1)
  const scale = useTransform(scrollY, [0, 800], [1.2, 1]);

  // 2. Efecto Parallax: La imagen se desplaza más lento que el scroll
  const y = useTransform(scrollY, [0, 800], [0, 200]);

  // 3. Efecto Opacity: La imagen se oscurece ligeramente al final del scroll
  const opacity = useTransform(scrollY, [0, 600], [1, 0.4]);

  // Cuenta atrás (18 de Julio 2026, 18:30)
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const timer = setInterval(() => {
      const weddingDate = new Date("2026-07-18T18:30:00").getTime();
      const now = new Date().getTime();
      const diff = weddingDate - now;
      if (diff > 0) {
        setTimeLeft({
          días: Math.floor(diff / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
          min: Math.floor((diff / 1000 / 60) % 60),
          seg: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Envío a Google Sheets
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptURL = "https://script.google.com/macros/s/AKfycbw8H4OXRq2xBpOGvGHyquzd9W_UP2xq-0YEOJpTTutUzCRCRzRFfZlfhussSEWWtNIt/exec"; // REEMPLAZA CON TU URL

    try {
      const params = new URLSearchParams();
      Object.keys(formData).forEach(key => params.append(key, formData[key]));

      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        body: params
      });

      alert(`¡Gracias ${formData.nombre}! Tu respuesta ha sido enviada.`);
      setIsSubmitted(true);
      // Opcional: limpiar form
    } catch (error) {
      alert("Hubo un error al enviar. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 selection:bg-slate-100">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="inicio" smooth className="serif text-2xl cursor-pointer tracking-tighter">y&a</Link>
          <div className="hidden md:flex space-x-10">
            {['Info', 'FAQ', 'Asistencia'].map((item) => (
              <Link
                key={item}
                to={item.toLowerCase()}
                spy={true}
                smooth={true}
                offset={-80}
                className="text-[10px] uppercase tracking-[0.3em] font-bold cursor-pointer hover:opacity-50 transition-opacity"
                activeClass="text-slate-400"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80')` }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <div className="relative z-10 text-center text-white px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}
            className="text-7xl md:text-9xl serif italic mb-6"
          >
            Yulia & Álvaro
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1.5 }}
            className="text-sm md:text-base tracking-[0.6em] uppercase font-light mb-16"
          >
            18 · 07 · 2026
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex justify-center gap-8 md:gap-16 border-t border-white/20 pt-10"
          >
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl md:text-5xl font-light mb-2">{String(value).padStart(2, '0')}</span>
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section id="info" className="py-40 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl serif italic mb-6">La Celebración</h2>
            <div className="w-16 h-px bg-slate-200 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-24">
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="flex items-center gap-4 text-slate-300">
                <Clock size={24} strokeWidth={1} />
                <span className="text-[10px] tracking-[0.3em] font-bold uppercase">El Momento</span>
              </div>
              <h3 className="text-4xl serif italic">Ceremonia a las 18:30</h3>
              <p className="text-lg text-slate-500 leading-relaxed serif italic">
                Nos encontraremos en los viñedos del <span className="text-slate-900 font-medium">Restaurante Eneko</span>.
                Un entorno donde la naturaleza y la paz de Larrabetzu serán testigos de nuestro "sí".
              </p>
              <div className="pt-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-900 border-b border-slate-900 w-fit cursor-pointer">
                Ver ubicación <MapPin size={14} />
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="space-y-8">
              <div className="flex items-center gap-4 text-slate-300">
                <Bus size={24} strokeWidth={1} />
                <span className="text-[10px] tracking-[0.3em] font-bold uppercase">El Traslado</span>
              </div>
              <h3 className="text-4xl serif italic">Servicio de Autobús</h3>
              <p className="text-lg text-slate-500 leading-relaxed serif italic">
                Queremos que disfrutéis de la fiesta sin preocupaciones. Dispondréis de autobuses con salida y regreso desde <span className="text-slate-900 font-medium">Getxo</span> y <span className="text-slate-900 font-medium">Zumarraga</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* ASISTENCIA SECTION */}
      <section id="asistencia" className="py-40 bg-slate-50 px-6">
        <div className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              // --- VISTA 1: EL FORMULARIO ---
              <motion.div
                key="form-confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-10 md:p-16 shadow-sm border border-slate-100 rounded-sm"
              >
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl serif italic mb-4">Confirmación</h2>
                  <p className="text-[10px] tracking-[0.3em] text-slate-400 uppercase">Rogamos confirmación antes del 1 de Junio</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-2">
                    <input type="text" placeholder="NOMBRE" required className="input-field" onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                    <input type="text" placeholder="APELLIDOS" required className="input-field" onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} />
                    <input type="email" placeholder="EMAIL" required className="input-field" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <div className="space-y-6">
                    <p className="text-[9px] tracking-[0.3em] font-bold text-slate-400 text-center uppercase">¿Podrás acompañarnos?</p>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setFormData({ ...formData, asiste: 'si' })}
                        className={`flex-1 selector-btn ${formData.asiste === 'si' ? 'selector-btn-active' : ''}`}>SÍ, ASISTIRÉ</button>
                      <button type="button" onClick={() => setFormData({ ...formData, asiste: 'no' })}
                        className={`flex-1 selector-btn ${formData.asiste === 'no' ? 'selector-btn-active' : ''}`}>NO PUEDO</button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.asiste === 'si' && (
                      <motion.div
                        key="extra-fields"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-12 pt-6 overflow-hidden"
                      >
                        <div className="space-y-6">
                          <p className="text-[9px] tracking-[0.3em] font-bold text-slate-400 text-center uppercase">¿Alguna intolerancia?</p>
                          <div className="flex gap-4 max-w-xs mx-auto">
                            <button type="button" onClick={() => setFormData({ ...formData, intolerancias: 'si' })} className={`flex-1 selector-btn ${formData.intolerancias === 'si' ? 'selector-btn-active' : ''}`}>SÍ</button>
                            <button type="button" onClick={() => setFormData({ ...formData, intolerancias: 'no' })} className={`flex-1 selector-btn ${formData.intolerancias === 'no' ? 'selector-btn-active' : ''}`}>NO</button>
                          </div>
                          {formData.intolerancias === 'si' && (
                            <input type="text" placeholder="¿CUÁL?" className="input-field text-center italic serif" onChange={(e) => setFormData({ ...formData, otraIntolerancia: e.target.value })} />
                          )}
                        </div>

                        <div className="space-y-6">
                          <p className="text-[9px] tracking-[0.3em] font-bold text-slate-400 text-center uppercase">¿Necesitarás autobús?</p>
                          <div className="flex gap-4 max-w-xs mx-auto">
                            <button type="button" onClick={() => setFormData({ ...formData, bus: 'si' })} className={`flex-1 selector-btn ${formData.bus === 'si' ? 'selector-btn-active' : ''}`}>SÍ</button>
                            <button type="button" onClick={() => setFormData({ ...formData, bus: 'no' })} className={`flex-1 selector-btn ${formData.bus === 'no' ? 'selector-btn-active' : ''}`}>NO</button>
                          </div>
                          {formData.bus === 'si' && (
                            <div className="flex gap-3 pt-2">
                              {['Getxo', 'Zumarraga'].map(p => (
                                <button key={p} type="button" onClick={() => setFormData({ ...formData, parada: p })}
                                  className={`flex-1 selector-btn ${formData.parada === p ? 'selector-btn-active' : ''}`}>{p.toUpperCase()}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={isSubmitting || !formData.asiste} className="w-full bg-black text-white py-6 text-[10px] tracking-[0.4em] font-bold uppercase hover:bg-slate-800 transition-colors disabled:opacity-20 mt-8">
                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR RESPUESTA'}
                  </button>
                </form>
              </motion.div>
            ) : (
              // --- VISTA 2: EL AGRADECIMIENTO ---
              <motion.div
                key="thanks-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white p-16 md:p-24 shadow-sm border border-slate-100 rounded-sm text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mb-8 flex justify-center text-slate-200"
                >
                  <Heart size={64} strokeWidth={1} fill="currentColor" className="text-slate-50" />
                </motion.div>

                <h2 className="text-4xl md:text-5xl serif italic mb-6">¡Gracias, {formData.nombre}!</h2>
                <p className="text-lg text-slate-500 serif italic leading-relaxed mb-10">
                  {formData.asiste === 'si'
                    ? "Tu respuesta ha sido registrada. Nos hace muchísima ilusión compartir este día contigo."
                    : "Sentimos mucho que no puedas venir, pero te tendremos muy presente en nuestro día."}
                </p>

                <div className="w-12 h-px bg-slate-200 mx-auto mb-10" />

                {/* <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[9px] tracking-[0.3em] text-slate-400 uppercase hover:text-black transition-colors"
                >
                  Modificar respuesta
                </button> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-50 bg-white">
        <p className="serif italic text-2xl mb-4">Yulia & Álvaro</p>
        <p className="text-[9px] tracking-[0.5em] text-slate-300 uppercase">18 · 07 · 2026 — Larrabetzu</p>
      </footer>
    </div>
  );
};

export default WeddingPage;