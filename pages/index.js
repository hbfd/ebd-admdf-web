import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg text-center max-w-md w-full text-gray-900 dark:text-white">
        <img
          src="/admdf-fundo.png"
          alt="Logo ADMDF"
          className="w-32 md:w-40 mx-auto mb-6 rounded shadow"
        />

        <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400">EBD ADMDF</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sistema de Gestão da Escola Bíblica Dominical.
          <br />
          Registre presença, cadastre alunos e gere relatórios com facilidade.
        </p>

        <Link
          href="/cadastro"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
        >
          Começar Cadastro
        </Link>
      </div>
    </div>
  );
}
