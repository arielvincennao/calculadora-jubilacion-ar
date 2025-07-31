export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Verificando tu perfil...
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Estamos cargando tu información de usuario
        </p>
      </div>
    </div>
  );
} 