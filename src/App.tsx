import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Truck, CreditCard, Star, FileText, Send, ArrowRight, Instagram, ChevronDown } from 'lucide-react';

// Types
interface Category {
  name: string;
  links: string[];
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPost, setFeaturedPost] = useState<string | null>(null);
  const [featuredTitle, setFeaturedTitle] = useState<string>("POGUE GIRL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSheetData();
  }, []);

  useEffect(() => {
    if (!loading && (categories.length > 0 || featuredPost)) {
      const timer = setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        } else {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.instagram.com/embed.js';
          script.onload = () => {
            window.instgrm?.Embeds.process();
          };
          document.body.appendChild(script);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, categories, featuredPost]);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const reviews = [
    "Muchas gracias, ya tengo mi pedido, está muy bonito los vestidos, muchas gracias.",
    "El otro día, recibí el paquete, muchas gracias, está divino.",
    "Gracias a ustedes por el buen servicio, 100% recomendada la página.",
    "Está super lindo todo.",
    "Me encantó el vestido, me quedó hermoso y gracias por mi regalito.",
    "Ya recibí mi pedido, muchas gracias por el detallito, sin duda seguiré pidiendo más cositas.",
    "Yo recibí mi pedido, muchísimas gracias, todo muy lindo y gracias por el detalle, está hermoso."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const fetchSheetData = async () => {
    try {
      const response = await fetch('https://opensheet.elk.sh/1BgdkuNRPfKdYqG0KdNfBK-hJ0b4hr6qYvVrA-AjBq5o/Hoja%201');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        setLoading(false);
        return;
      }

      const allKeys = Object.keys(data[0]);
      
      const pogueGirlKey = allKeys.find(key => 
        key.toUpperCase().includes('POGUE GIRL') || 
        key.toUpperCase().includes('POGUEGIRL')
      );

      if (pogueGirlKey) {
        setFeaturedTitle(pogueGirlKey.toUpperCase());
        const firstValidLink = data.find(row => 
          row[pogueGirlKey] && typeof row[pogueGirlKey] === 'string' && row[pogueGirlKey].toLowerCase().includes('instagram.com')
        )?.[pogueGirlKey];
        setFeaturedPost(firstValidLink || null);
      } else {
        setFeaturedPost(null);
      }

      const parsedCategories: Category[] = allKeys
        .filter(key => key !== pogueGirlKey)
        .map(key => {
          const links = data
            .map(row => row[key])
            .filter(link => link && typeof link === 'string' && link.toLowerCase().includes('instagram.com'));
          
          return { name: key, links };
        })
        .filter(cat => cat.links.length > 0);

      setCategories(parsedCategories);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la colección en este momento.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <a href="#" className="font-serif text-3xl md:text-4xl tracking-tighter font-light leading-none">POGUESHOP.GT</a>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-sans text-gray-400 mt-1">Ropa y accesorios Guatemala</p>
          </div>
          <nav className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-sans font-bold">
            <button onClick={() => scrollToSection('info')} className="hover:text-gray-400 transition-colors uppercase cursor-pointer">Información</button>
            <button onClick={() => scrollToSection('collection')} className="hover:text-gray-400 transition-colors uppercase cursor-pointer">Colección</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-gray-400 transition-colors uppercase cursor-pointer">Reseñas</button>
          </nav>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </nav>

      {/* Category Navigation Bar */}
      {!loading && categories.length > 1 && (
        <div className="sticky top-20 md:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-center gap-6 md:gap-10 whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => scrollToSection(`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`)}
                className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://raw.githubusercontent.com/VokaHub/pogueshop.gt/649cc2b29186483f581dc6602bb8a2b470e81d7d/src/Captura%20de%20pantalla%202026-05-13%20003116.png" 
            alt="Pogue Editorial Background" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-bold mb-6 block drop-shadow-md">Ropa y accesorios nuevos</span>
            <h1 className="text-[18vw] md:text-[14rem] font-serif mb-8 md:mb-12 tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
              POGUE
            </h1>
            <div className="flex flex-col items-center gap-16">
              <div className="flex items-center gap-12 text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-sans font-black text-white/90 drop-shadow-sm overflow-hidden">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Support Local Business
                </motion.span>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <button 
                  onClick={() => scrollToSection('collection')}
                  className="bg-white text-black px-14 py-5 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-zinc-100 transition-all shadow-2xl active:scale-95 cursor-pointer"
                >
                  Ver Colección
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-20 md:py-32 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16 md:mb-24">
             <h2 className="text-5xl md:text-6xl font-serif tracking-tighter mb-6 text-center uppercase">Servicios & Guía</h2>
             <p className="text-center text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Todo lo que necesitas saber de POGUESHOP.GT</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 md:gap-x-20 md:gap-y-32">
            
            {/* Purchase */}
            <div className="info-block">
              <span className="editorial-header">01 / Pedidos</span>
              <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Cómo comprar tus prendas</h4>
                <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  <p>1. Selecciona tu producto favorito.</p>
                  <p>2. Envía captura por mensaje directo.</p>
                  <p>3. Confirma disponibilidad y envía tus datos.</p>
                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <p className="text-[9px] text-gray-400 normal-case italic">Requerimos teléfono, nombre completo y dirección detallada para procesar tu orden.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="info-block">
              <span className="editorial-header">02 / Envíos</span>
              <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Cobertura nacional</h4>
                <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  <p>• <span className="text-black font-bold">Capital:</span> Siguiente día hábil.</p>
                  <p>• <span className="text-black font-bold">Departamentos:</span> 1-2 días hábiles.</p>
                  <p className="text-gray-400 italic mt-4 text-[9px] uppercase tracking-widest leading-relaxed">Costo de envío varía por ubicación. Envíos programados requieren 50% de anticipo.</p>
                </div>
              </div>
            </div>

            {/* State */}
            <div className="info-block">
              <span className="editorial-header">03 / Calidad</span>
              <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Guía de estados</h4>
                <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  <p>• <span className="text-black font-bold">10 de 10:</span> Segunda mano en buen estado.</p>
                  <p>• <span className="text-black font-bold">Nuevo con etiqueta:</span> No usado, con etiqueta original.</p>
                  <p>• <span className="text-black font-bold">Nuevo sin etiqueta:</span> No usado, sin etiqueta original.</p>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-start gap-4">
                     <FileText className="text-gray-200" size={24} />
                     <p className="text-[9px] text-gray-400 normal-case italic">Cada pieza es seleccionada y sanitizada meticulosamente antes de ser entregada.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="info-block">
               <span className="editorial-header">04 / Pagos</span>
               <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Formas de pago</h4>
                <div className="space-y-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed font-bold">
                  <div className="flex items-center gap-2"><ArrowRight size={10} /> <span>Pago contra entrega</span></div>
                  <div className="flex items-center gap-2"><ArrowRight size={10} /> <span>Transferencia bancaria</span></div>
                  <div className="flex items-center gap-2"><ArrowRight size={10} /> <span>Tarjeta de crédito</span></div>
                  <div className="mt-8 p-6 bg-black text-white">
                    <p className="text-[10px] mb-2 tracking-widest opacity-60">Visa Cuotas</p>
                    <p className="text-sm font-serif italic">De 2 hasta 18 meses disponibles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="info-block">
              <span className="editorial-header">05 / Políticas</span>
              <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Ventas Finales</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  Debido a la naturaleza de nuestras prendas exclusivas y de segunda mano, <span className="text-black font-bold">no realizamos cambios ni devoluciones.</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section id="collection" className="py-20 md:py-32 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline mb-12 md:mb-16 border-b border-gray-100 pb-8 gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-6xl md:text-9xl font-serif tracking-tighter uppercase leading-none">Colección</h2>
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-12 bg-black" />
               <p className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-black font-black">
                 Guatemala — {new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' }).format(new Date())}
               </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-60 gap-8">
            <div className="w-16 h-[1px] bg-gray-100 relative overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="absolute inset-0 bg-gray-400" 
               />
            </div>
            <p className="text-[10px] uppercase tracking-[0.6em] text-gray-300 font-bold animate-pulse">Cargando Archivo</p>
          </div>
        ) : (
          <div className="space-y-32">
            {categories.map((category) => (
              <div 
                key={category.name} 
                id={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="scroll-mt-32"
              >
                <div className="mb-12 md:mb-20">
                  <span className="editorial-tag mb-4 inline-block">Collection</span>
                  <h3 className="text-4xl md:text-7xl font-serif tracking-tighter uppercase mb-4">{category.name}</h3>
                  <div className="h-[1px] w-24 bg-black" />
                </div>
                
                <div className="masonry-grid px-2 md:px-0">
                  {category.links.map((link, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="masonry-item"
                    >
                      <div className="ig-embed-container flex flex-col group bg-transparent">
                        <div className="relative z-0">
                          <blockquote 
                            className="instagram-media" 
                            data-instgrm-permalink={link}
                            data-instgrm-version="14"
                          >
                          </blockquote>
                        </div>
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] uppercase tracking-[0.4em] font-black text-black hover:bg-black hover:text-white transition-all duration-500 mt-6 flex items-center justify-center gap-3 group/btn py-4 px-6 border-b-2 border-black"
                        >
                          Comprar en Instagram <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-2" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Section - Pogue Girl */}
      {featuredPost && (
        <section className="featured-magazine-card bg-zinc-50 py-20 md:py-32 flex flex-col items-center overflow-hidden">
            <div className="max-w-4xl w-full text-center mb-12 md:mb-16 px-6 text-black">
               <span className="editorial-tag mb-6 block w-fit mx-auto">Highlight</span>
               <h2 className="text-4xl md:text-8xl font-serif tracking-tighter mb-2 leading-tight uppercase">{featuredTitle}</h2>
               <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-gray-500">Look Destacado</p>
            </div>
            
            <div className="w-full max-w-2xl px-4 relative flex flex-col items-center">
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 className="bg-transparent overflow-visible w-full max-w-[420px] mx-auto flex flex-col items-center"
               >
                   <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink={featuredPost}
                    data-instgrm-version="14"
                  >
                  </blockquote>
               </motion.div>
            </div>
        </section>
      )}

      {/* Final Sections - Reviews first, then Info */}
      <section id="reviews" className="pt-20 pb-20 md:pt-32 md:pb-32 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            
            {/* Reviews Space */}
            <div className="w-full min-h-[300px] flex flex-col items-center">
               <h3 className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-gray-400 mb-8 md:mb-12">Reseñas</h3>
               <div className="relative w-full flex-1 flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentReviewIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-8 flex flex-col items-center"
                    >
                       <p className="text-2xl md:text-4xl font-serif italic text-gray-700 leading-tight max-w-2xl px-4">
                        "{reviews[currentReviewIndex]}"
                       </p>
                       <div className="flex items-center justify-center gap-6">
                          <div className="h-[1px] w-12 bg-zinc-100" />
                          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-zinc-300 font-bold">Cliente Pogue</p>
                          <div className="h-[1px] w-12 bg-zinc-100" />
                       </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-center gap-2 pt-16 md:pt-20">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentReviewIndex(i)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${i === currentReviewIndex ? 'bg-black w-8' : 'bg-gray-100 w-3 hover:bg-gray-200'}`}
                        aria-label={`Ir a reseña ${i + 1}`}
                      />
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
             <h3 className="font-serif text-3xl font-light tracking-tighter mb-2">POGUESHOP.GT</h3>
             <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">Ropa y accesorios Guatemala</p>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-widest font-sans font-bold text-gray-900">
            <a href="https://www.instagram.com/pogueshop.gt/" className="hover:text-gray-400 transition-colors flex items-center gap-2">
              <Instagram size={14} /> POGUESHOP.GT
            </a>
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-gray-300 font-bold">
            POGUESHOP.GT · CIUDAD DE GUATEMALA
          </div>
        </div>
      </footer>
    </div>
  );
}
