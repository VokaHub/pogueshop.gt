import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Instagram, ExternalLink, FileText } from 'lucide-react';
import { ConfidenceBoostModal, GiftEnvelopeSection } from './components/ConfidenceBoost';

const CANVA_CATALOG_URL =
  'https://www.canva.com/design/DAFksVBgmTQ/p1wF8SRLChhHPoWshv4WgQ/view?utm_content=DAFksVBgmTQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h95ea2dfb26&fbclid=PARlRTSAUMgytwZG9mAmZkaWQWUODMMF8UhKkmW3tA2xcTlQJvLQhqrGV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABp8juMNt6AHo1yVpJOl0auJHS5PXnobOUV6kdNjrQfpt8WqJQGtK55IlM0THO_aem_-2hEaG_CBwETwGX8Re7_qQ';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/pogueshop.gt/';

export default function App() {
  const [isConfidenceBoostOpen, setIsConfidenceBoostOpen] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Subtle Parallax effect on Hero background image
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 800], [0, 140]);
  const reviews = [
    'Muchas gracias, ya tengo mi pedido, está muy bonito los vestidos, muchas gracias.',
    'El otro día, recibí el paquete, muchas gracias, está divino.',
    'Gracias a ustedes por el buen servicio, 100% recomendada la página.',
    'Está super lindo todo.',
    'Me encantó el vestido, me quedó hermoso y gracias por mi regalito.',
    'Ya recibí mi pedido, muchas gracias por el detallito, sin duda seguiré pidiendo más cositas.',
    'Yo recibí mi pedido, muchísimas gracias, todo muy lindo y gracias por el detalle, está hermoso.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
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
            <a href="#" className="font-serif text-3xl md:text-4xl tracking-tighter font-light leading-none">
              POGUESHOP.GT
            </a>
            <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-sans text-gray-400 mt-1">
              Ropa y accesorios Guatemala
            </p>
          </div>
          <nav className="hidden lg:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-sans font-bold">
            <button
              onClick={() => scrollToSection('info')}
              className="hover:text-gray-400 transition-colors uppercase cursor-pointer"
            >
              Información
            </button>
            <a
              href={CANVA_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors uppercase cursor-pointer flex items-center gap-1.5"
            >
              Colección <ExternalLink size={11} className="opacity-60" />
            </a>
            <button
              onClick={() => scrollToSection('reviews')}
              className="hover:text-gray-400 transition-colors uppercase cursor-pointer"
            >
              Reseñas
            </button>
          </nav>
          <div className="flex items-center gap-6">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-400 transition-colors"
              aria-label="Instagram POGUESHOP.GT"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen flex items-center justify-center overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <motion.img
            style={{ y: heroBgY, scale: 1.08 }}
            src="https://raw.githubusercontent.com/VokaHub/pogueshop.gt/649cc2b29186483f581dc6602bb8a2b470e81d7d/src/Captura%20de%20pantalla%202026-05-13%20003116.png"
            alt="Pogue Editorial Background"
            className="w-full h-full object-cover object-center will-change-transform"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[18vw] md:text-[14rem] font-serif mb-6 md:mb-8 tracking-tighter leading-[0.85] text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">
              POGUE
            </h1>
            <div className="flex flex-col items-center gap-8 md:gap-10">
              <div className="flex items-center text-[10px] md:text-[11px] uppercase tracking-[0.45em] font-sans font-bold text-white/90 drop-shadow-sm overflow-hidden">
                <motion.span
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Your favorite local business
                </motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col items-center gap-3 justify-center"
              >
                {/* Ver Catálogo - Sleek, refined proportion */}
                <a
                  href={CANVA_CATALOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-white text-black px-8 py-3.5 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-zinc-100 transition-all shadow-xl active:scale-95 cursor-pointer text-center"
                >
                  Ver Catálogo <ExternalLink size={12} />
                </a>

                {/* Cómo Realizar un Pedido - Scrolls to Servicios & Guía (#info) */}
                <a
                  href="#info"
                  className="inline-flex items-center justify-center gap-2 border border-white/45 text-white/90 hover:bg-white hover:text-black px-7 py-3 text-[10px] uppercase tracking-[0.25em] font-bold transition-all active:scale-95 cursor-pointer text-center"
                >
                  Cómo Realizar un Pedido <ArrowRight size={12} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mini Gift Envelope Section - Before Servicios & Guía */}
      <GiftEnvelopeSection onOpen={() => setIsConfidenceBoostOpen(true)} />

      {/* Info Section - Servicios & Guía */}
      <section id="info" className="py-20 md:py-32 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16 md:mb-24">
            <h2 className="text-5xl md:text-6xl font-serif tracking-tighter mb-6 text-center uppercase">
              Servicios & Guía
            </h2>
            <p className="text-center text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold">
              Todo lo que necesitas saber de POGUESHOP.GT
            </p>
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
                    <p className="text-[9px] text-gray-400 normal-case italic">
                      Requerimos teléfono, nombre completo y dirección detallada para procesar tu orden.
                    </p>
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
                  <p>
                    • <span className="text-black font-bold">Capital:</span> Siguiente día hábil.
                  </p>
                  <p>
                    • <span className="text-black font-bold">Departamentos:</span> 1-2 días hábiles.
                  </p>
                  <p className="text-gray-400 italic mt-4 text-[9px] uppercase tracking-widest leading-relaxed">
                    Costo de envío varía por ubicación. Envíos programados requieren 50% de anticipo.
                  </p>
                </div>
              </div>
            </div>

            {/* State */}
            <div className="info-block">
              <span className="editorial-header">03 / Calidad</span>
              <div className="space-y-6">
                <h4 className="text-2xl font-serif italic text-gray-900 leading-tight">Guía de estados</h4>
                <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 leading-relaxed">
                  <p>
                    • <span className="text-black font-bold">10 de 10:</span> Segunda mano en buen estado.
                  </p>
                  <p>
                    • <span className="text-black font-bold">Nuevo con etiqueta:</span> No usado, con etiqueta original.
                  </p>
                  <p>
                    • <span className="text-black font-bold">Nuevo sin etiqueta:</span> No usado, sin etiqueta original.
                  </p>
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-start gap-4">
                    <FileText className="text-gray-200" size={24} />
                    <p className="text-[9px] text-gray-400 normal-case italic">
                      Cada pieza es seleccionada y sanitizada meticulosamente antes de ser entregada.
                    </p>
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
                  <div className="flex items-center gap-2">
                    <ArrowRight size={10} /> <span>Pago contra entrega</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={10} /> <span>Transferencia bancaria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={10} /> <span>Tarjeta de crédito</span>
                  </div>
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
                  Debido a la naturaleza de nuestras prendas exclusivas y de segunda mano,{' '}
                  <span className="text-black font-bold">no realizamos cambios ni devoluciones.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="pt-20 pb-20 md:pt-32 md:pb-32 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Reviews Space */}
            <div className="w-full min-h-[300px] flex flex-col items-center">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-gray-400 mb-8 md:mb-12">
                Reseñas
              </h3>
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
                      <p className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-zinc-300 font-bold">
                        Cliente Pogue
                      </p>
                      <div className="h-[1px] w-12 bg-zinc-100" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-2 pt-16 md:pt-20">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentReviewIndex(i)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        i === currentReviewIndex ? 'bg-black w-8' : 'bg-gray-100 w-3 hover:bg-gray-200'
                      }`}
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
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold">
              Ropa y accesorios Guatemala
            </p>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-widest font-sans font-bold text-gray-900">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors flex items-center gap-2"
            >
              <Instagram size={14} /> POGUESHOP.GT
            </a>
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-gray-300 font-bold">
            POGUESHOP.GT · CIUDAD DE GUATEMALA
          </div>
        </div>
      </footer>

      {/* Confidence Boost Interactive Experience */}
      <ConfidenceBoostModal
        isOpen={isConfidenceBoostOpen}
        onClose={() => setIsConfidenceBoostOpen(false)}
        canvaCatalogUrl={CANVA_CATALOG_URL}
      />
    </div>
  );
}
