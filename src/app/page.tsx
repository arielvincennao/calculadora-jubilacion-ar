'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Link from 'next/link';

export default function Home() {
  useSmoothScroll();
  
  const steps = [
    {
      number: '1',
      title: 'Registrate o iniciá sesión',
      description: 'Accedé con tu cuenta para guardar tus datos y consultar tus cálculos en cualquier momento.'
    },
    {
      number: '2',
      title: 'Completá tus datos',
      description: 'Ingresá los datos relevantes para calcular tu jubilación.'
    },
    {
      number: '3',
      title: 'Obtené el valor',
      description: 'Conocé el monto que debes recibir según la normativa previsional vigente.'
    },
    {
      number: '4',
      title: 'Guardá tu información',
      description: 'Almacená tu cálculo para futuras consultas y seguí tu progreso previsional.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section id="inicio" className="min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 dark:from-blue-800 dark:via-blue-700 dark:to-blue-900">
            <div className="absolute top-20 left-10 w-32 h-32 opacity-10 animate-float hero-svg">
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="50" r="20" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute top-40 right-20 w-24 h-24 opacity-10 animate-float hero-svg" style={{animationDelay: '1s'}}>
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <polygon points="50,10 90,90 10,90" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute bottom-40 left-20 w-28 h-28 opacity-10 animate-rotate hero-svg" style={{animationDelay: '2s'}}>
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <rect x="20" y="20" width="60" height="60" rx="10" fill="currentColor"/>
              </svg>
            </div>
            <div className="absolute bottom-20 right-10 w-20 h-20 opacity-10 animate-pulse-glow hero-svg" style={{animationDelay: '3s'}}>
              <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
                <ellipse cx="50" cy="50" rx="40" ry="20" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Patrón de puntos */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
              </svg>
            </div>
            
            {/* Líneas diagonales */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="diagonal" width="100" height="100" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="100" x2="100" y2="0" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diagonal)"/>
              </svg>
            </div>
            
            {/* Círculos */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 animate-pulse">
              <svg viewBox="0 0 200 200" fill="none" className="text-white">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              </svg>
            </div>
            
            {/* Ondas */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
              <svg viewBox="0 0 1200 120" fill="currentColor" className="text-white">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"/>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.71,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"/>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"/>
              </svg>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Contenido izquierdo - Texto y botón */}
              <div className="lg:col-span-1 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 lg:mb-6 drop-shadow-lg">
                  Calculá tu jubilación en Argentina
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-blue-50 mb-8 lg:mb-10 drop-shadow-md px-4 lg:px-0">
                  Ingresá tus años de aporte e ingresos para obtener una estimación precisa del monto jubilatorio.
                </p>
                <Link href="/auth/login">
                  <button className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">
                    Comenzar a calcular
                  </button>
                </Link>
                
                {/* Flecha de scroll */}
                <div className="mt-8 lg:mt-12 animate-bounce">
                  <div className="flex flex-col items-center lg:items-end">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 transform rotate-45 border-b-2 border-r-2 border-white opacity-80 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Panel derecho - Imágenes en diagonal */}
              <div className="lg:col-span-1 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
                {/* Panel 1 - Arriba */}
                <div className="relative transform -rotate-6 translate-y-8 scale-75 lg:scale-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl animate-glow-pulse"></div>
                  <img 
                    src="/images/panel1.png" 
                    alt="Panel de cálculo" 
                    className="relative w-170 h-auto rounded-2xl shadow-2xl animate-float-slow panel-image"
                    style={{animationDelay: '0s'}}
                  />
                </div>

                {/* Panel 2 - Abajo */}
                <div className="absolute right-0 bottom-0 transform rotate-6 translate-y-16 scale-75 lg:scale-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-xl animate-glow-pulse" style={{animationDelay: '1s'}}></div>
                  <img 
                    src="/images/panel2.png" 
                    alt="Panel de resultados" 
                    className="relative w-115 h-auto rounded-2xl shadow-2xl animate-float-fast panel-image"
                    style={{animationDelay: '1s'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona Section */}
        <section id="como-funciona" className="min-h-screen flex items-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 relative overflow-hidden border-t-4 border-blue-100 dark:border-blue-900 scroll-active section-fade-in">
          {/* Fondo */}
          <div className="absolute inset-0 opacity-8">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circles" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="2" fill="currentColor" className="text-blue-600"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circles)"/>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                Cómo funciona
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Sólo necesitás seguir estos simples pasos para conocer lo que te corresponde
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              {/* Línea vertical  */}
              <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 z-0 rounded-full shadow-lg" />

              {steps.map((step, index) => (
                <div key={index} className="relative pl-16 mb-12 group">
                  {/* Círculo */}
                  <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 text-white rounded-full font-bold text-lg z-10 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                    {step.number}
                  </div>

                  {/* Contenido */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ventajas Section */}
        <section id="ventajas" className="min-h-screen flex items-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 relative overflow-hidden border-t-4 border-blue-200 dark:border-blue-800 scroll-active section-fade-in">
          {/* Fondo */}
          <div className="absolute inset-0 opacity-6">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons" width="50" height="50" patternUnits="userSpaceOnUse">
                  <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-600"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)"/>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                Por qué usar nuestra calculadora
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                La herramienta más confiable para estimar tu jubilación en Argentina
              </p>
            </div>

            <div className="max-w-2xl mx-auto grid gap-6">
              {[
                "Basado en normativa previsional argentina actualizada",
                "Fácil de usar y accesible desde cualquier dispositivo",
                "Beneficio de guardar tus datos privados para futuras consultas",
                "Cálculos rápidos y estimaciones precisas"
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-start p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-600"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/auth/login">
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center shadow-lg hover:shadow-xl">
                  Calcular mi jubilación
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Información Adicional Section */}
        <section id="informacion" className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16 relative overflow-hidden border-t-4 border-blue-200 dark:border-blue-800 scroll-active section-fade-in">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 opacity-9">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-blue-600"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                Información adicional
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Recursos útiles sobre el sistema previsional argentino
              </p>
            </div>

            <div className="max-w-2xl mx-auto grid gap-6">
              <a
                href="https://www.argentina.gob.ar/anses"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 shadow-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Sitio oficial de ANSES
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Accedé a la información oficial sobre trámites y beneficios
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://www.argentina.gob.ar/normativa/recurso/16102/texact/htm"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 shadow-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Leyes previsionales actuales
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Consultá la normativa vigente sobre el sistema jubilatorio
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://www.anses.gob.ar/consultas/aportes-jubilatorios"
                className="group flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 shadow-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Guía sobre tipos de aportes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Conocé los diferentes regímenes de aportes y cómo te afectan
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
