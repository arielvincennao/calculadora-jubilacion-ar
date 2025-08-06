import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  const steps = [
    {
      number: '1',
      title: 'Registrate o iniciá sesión',
      description: 'Accedé con tu cuenta para guardar tus datos y consultar tus cálculos en cualquier momento.'
    },
    {
      number: '2',
      title: 'Completá tus datos',
      description: 'Ingresá tu edad, años de aporte, ingresos y otros datos relevantes para calcular tu jubilación.'
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
        <section id="inicio" className="min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Calculá tu jubilación en Argentina
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
                Ingresá tus años de aporte e ingresos para obtener una estimación precisa del monto jubilatorio.
              </p>
              <Link href="/auth/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
                Comenzar a calcular
              </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cómo funciona Section */}
        <section id="como-funciona" className="min-h-screen flex items-center bg-white dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Cómo funciona
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Sólo necesitás seguir estos simples pasos para conocer lo que te corresponde
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              {/* Línea vertical */}
              <div className="absolute left-6 top-0 h-full w-1 bg-blue-500 dark:bg-blue-400 z-0" />

              {steps.map((step, index) => (
                <div key={index} className="relative pl-16 mb-12">
                  {/* Círculo con número */}
                  <div className="absolute left-0 top-0 w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full font-bold text-lg z-10 shadow">
                    {step.number}
                  </div>

                  {/* Contenido */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
        <section id="ventajas" className="min-h-screen flex items-center bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
                  className="flex items-start p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <svg
                    className="h-6 w-6 text-green-500 mr-4 mt-0.5 flex-shrink-0"
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
                  <span className="text-lg text-gray-700 dark:text-gray-200">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/auth/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 inline-flex items-center">
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
        <section id="informacion" className="min-h-screen flex items-center bg-white dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
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
                className="group flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center mr-6">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Sitio oficial de ANSES
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Accedé a la información oficial sobre trámites y beneficios
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://www.argentina.gob.ar/normativa/recurso/16102/texact/htm"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center mr-6">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Leyes previsionales actuales
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Consultá la normativa vigente sobre el sistema jubilatorio
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a
                href="https://www.anses.gob.ar/consultas/aportes-jubilatorios"
                className="group flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center mr-6">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Guía sobre tipos de aportes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Conocé los diferentes regímenes de aportes y cómo te afectan
                  </p>
                </div>
                <svg className="ml-auto w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
