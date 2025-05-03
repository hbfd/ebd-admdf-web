// File: pages/_app.js
import Head from 'next/head';
import '../styles/globals.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Layout({ children }) {
  const router = useRouter();
  const [tema, setTema] = useState('claro');

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') || 'claro';
    setTema(temaSalvo);
    document.documentElement.classList.toggle('dark', temaSalvo === 'escuro');
  }, []);

  const alternarTema = () => {
    const novo = tema === 'claro' ? 'escuro' : 'claro';
    setTema(novo);
    localStorage.setItem('tema', novo);
    document.documentElement.classList.toggle('dark', novo === 'escuro');
  };

  const logout = () => {
    localStorage.removeItem('usuarioLogado');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4 space-y-2">
        <h2 className="text-2xl font-bold mb-6 text-center">EBD ADMDF</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="hover:bg-blue-600 p-2 rounded">Home</Link>
          <Link href="/cadastro" className="hover:bg-blue-600 p-2 rounded">Cadastro</Link>
          <Link href="/frequencia" className="hover:bg-blue-600 p-2 rounded">Frequência</Link>
          <Link href="/frequencia/lista" className="hover:bg-blue-600 p-2 rounded">Gerenciar Frequências</Link>
          <Link href="/relatorios" className="hover:bg-blue-600 p-2 rounded">Relatórios</Link>
          <Link href="/backup" className="hover:bg-blue-600 p-2 rounded">Backup</Link>
          <button onClick={alternarTema} className="hover:bg-blue-600 p-2 rounded text-left">
            🌓 Tema ({tema === 'escuro' ? 'Escuro' : 'Claro'})
          </button>
          <button onClick={logout} className="hover:bg-red-600 p-2 rounded text-left font-semibold">
            🚪 Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 transition-all">
        <Head>
          <title>EBD ADMDF</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icon-192.png" />
        </Head>
        {children}
      </main>
    </div>
  );
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const usuario = localStorage.getItem('usuarioLogado');
    if (!usuario && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router.pathname]);

  return <Layout><Component {...pageProps} /></Layout>;
}
