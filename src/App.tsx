import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Truck, CreditCard, Star, FileText, Send, ArrowRight, Instagram, ChevronDown } from 'lucide-react';

// Types
interface Product {
  instagram: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredGirlPosts, setFeaturedGirlPosts] = useState<string[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && (products.length > 0 || featuredGirlPosts.length > 0)) {
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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, products, featuredGirlPosts, currentFeaturedIndex]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://opensheet.elk.sh/1BgdkuNRPfKdYqG0KdNfBK-hJ0b4hr6qYvVrA-AjBq5o/Hoja%201');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      
      // Products from Column A
      const productList = data.filter((item: any) => item.instagram).map((item: any) => ({
        instagram: item.instagram
      }));
      setProducts(productList);

      // Featured posts from Column B
      const otherKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'instagram') : [];
      const featuredList: string[] = [];
      
      if (otherKeys.length > 0) {
        const columnBKey = otherKeys[0];
        data.forEach((item: any) => {
          const val = item[columnBKey];
          if (typeof val === 'string' && val.includes('instagram.com')) {
            featuredList.push(val);
          }
        });
      }
      setFeaturedGirlPosts(featuredList);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la colección en este momento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <a href="#" className="font-serif text-3xl md:text-4xl tracking-tighter font-light leading-none">POGUESHOP.GT</a>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-sans text-gray-400 mt-1">Ropa y accesorios Guatemala</p>
          </div>
          <nav className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-sans font-bold">
            <a href="#info" className="hover:text-gray-400 transition-colors">Información</a>
            <a href="#collection" className="hover:text-gray-400 transition-colors">Colección</a>
            <a href="#reviews" className="hover:text-gray-400 transition-colors">Reseñas</a>
          </nav>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" 
            alt="Pogue Shop GT" 
            className="w-full h-full object-cover grayscale brightness-105"
          />
        </div>
        
        <div className="relative z-20 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block mix-blend-difference">Ropa y accesorios nuevos</span>
            <h1 className="text-[18vw] md:text-[15rem] font-serif mb-12 tracking-tighter leading-[0.85] mix-blend-difference">
              POGUE
            </h1>
            <div className="flex flex-col items-center gap-12">
              <div className="flex items-center gap-8 text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-sans font-bold text-white/70 mix-blend-difference overflow-hidden">
                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Support Local Business
                </motion.span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <a 
                  href="#collection" 
                  className="bg-white text-black px-14 py-5 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-zinc-100 transition-all shadow-2xl active:scale-95"
                >
                  Ver Colección
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section - Editorial Cards */}
      <section id="info" className="py-20 md:py-32 bg-white">
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
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Estado de prendas</h4>
                <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  <p>• <span className="text-black font-bold">10/10:</span> Condición impecable.</p>
                  <p>• <span className="text-black font-bold">Nuevas:</span> Con o sin etiquetas originales.</p>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-start gap-4">
                     <FileText className="text-gray-200" size={24} />
                     <p className="text-[9px] text-gray-400 normal-case italic">Toda prenda es rigurosamente seleccionada, lavada y sanitizada previo a la venta.</p>
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
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter uppercase">Colección</h2>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">Shop GT Archive</span>
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
          <div className="masonry-grid px-2 md:px-0">
            {products.map((product, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="masonry-item"
              >
                <div className="ig-embed-container flex flex-col shadow-sm border border-gray-50 group">
                  {/* Shop Button Overlay - Visible on Mobile, Hover on Desktop */}
                  <a 
                    href={product.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 z-30 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 bg-black text-white p-3.5 rounded-full shadow-xl hover:bg-zinc-800 active:scale-95"
                    aria-label="Ver en Instagram"
                  >
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
 
                  {/* Floating 'Shop' Label */}
                  <div className="absolute top-4 left-4 z-30 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                     <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] bg-white text-black px-4 py-2 rounded-full font-bold shadow-sm border border-gray-100">Shop Item</span>
                  </div>
 
                  {/* Pinterest-style Frame for IG Embed */}
                  <div className="relative z-0">
                    <blockquote 
                      className="instagram-media" 
                      data-instgrm-permalink={product.instagram}
                      data-instgrm-version="14"
                    >
                      <a href={product.instagram}></a>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Section - Pogue Girl of the Week Carousel */}
      {featuredGirlPosts.length > 0 && (
        <section className="featured-magazine-card bg-zinc-50 py-16 md:py-32 flex flex-col items-center overflow-hidden">
            <div className="max-w-4xl w-full text-center mb-12 md:mb-24 px-4 text-black">
               <span className="editorial-tag mb-6">Exclusive Highlight</span>
               <h2 className="text-4xl md:text-8xl font-serif tracking-tighter leading-tight md:leading-none uppercase">POGUE GIRL OF THE WEEK</h2>
            </div>
            
            <div className="w-full max-w-2xl px-6 relative">
               <div className="flex items-center justify-center gap-4 mb-8 md:absolute md:-left-20 md:top-1/2 md:translate-y-1/2 md:flex-col md:mb-0 z-40">
                  <button 
                    onClick={() => setCurrentFeaturedIndex(prev => (prev === 0 ? featuredGirlPosts.length - 1 : prev - 1))}
                    className="p-3 bg-white hover:bg-black hover:text-white transition-all rounded-full shadow-lg active:scale-90"
                    aria-label="Anterior"
                  >
                    <ArrowRight className="rotate-180 w-5 h-5" />
                  </button>
                  <div className="flex md:flex-col gap-2">
                    {featuredGirlPosts.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentFeaturedIndex ? 'bg-black w-4 md:w-1.5 md:h-4' : 'bg-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentFeaturedIndex(prev => (prev === featuredGirlPosts.length - 1 ? 0 : prev + 1))}
                    className="p-3 bg-white hover:bg-black hover:text-white transition-all rounded-full shadow-lg active:scale-90"
                    aria-label="Siguiente"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
               </div>

               <motion.div 
                 key={currentFeaturedIndex}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 className="bg-white p-2 md:p-4 shadow-3xl border border-gray-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden"
               >
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink={featuredGirlPosts[currentFeaturedIndex]}
                    data-instgrm-version="14"
                  >
                    <a href={featuredGirlPosts[currentFeaturedIndex]}></a>
                  </blockquote>
               </motion.div>
            </div>
        </section>
      )}

      {/* Final Sections */}
      <section id="reviews" className="pt-8 pb-16 md:pt-16 md:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
            
            {/* Left side empty for editorial balance */}
            <div className="hidden lg:block"></div>

            {/* Reviews Space */}
            <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-20 lg:pt-0 lg:pl-20">
               <h3 className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-gray-400 mb-8 md:mb-12">Reseñas</h3>
               <div className="space-y-12">
                  <div className="space-y-4">
                     <p className="text-lg md:text-xl font-serif italic text-gray-700 leading-snug">"¡Súper recomendado! La ropa llegó súper limpia y el estado era tal cual lo describieron."</p>
                     <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Cliente Pogue</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-lg md:text-xl font-serif italic text-gray-700 leading-snug">"Excelente servicio al cliente y el envío fue súper rápido a mi departamento."</p>
                     <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Cliente Pogue</p>
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
