import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function Login() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [modoCriar, setModoCriar] = useState(false);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('usuarios') || '[]');
    setUsuarios(salvos);
    if (salvos.length === 0) setModoCriar(true);
  }, []);

  const salvarUsuarios = (lista) => {
    localStorage.setItem('usuarios', JSON.stringify(lista));
    setUsuarios(lista);
  };

  const criarUsuario = () => {
    if (!usuario.trim() || senha.length < 4) {
      Swal.fire('Erro', 'Informe nome e uma senha com no mínimo 4 caracteres.', 'error');
      return;
    }

    const jaExiste = usuarios.some((u) => u.usuario === usuario);
    if (jaExiste) {
      Swal.fire('Erro', 'Nome de usuário já existe.', 'error');
      return;
    }

    const novo = [...usuarios, { usuario, senha }];
    salvarUsuarios(novo);
    localStorage.setItem('usuarioLogado', usuario);
    Swal.fire('Sucesso', 'Usuário criado com sucesso!', 'success').then(() => {
      router.push('/');
    });
  };

  const fazerLogin = () => {
    const encontrado = usuarios.find((u) => u.usuario === usuario && u.senha === senha);
    if (!encontrado) {
      Swal.fire('Erro', 'Usuário ou senha incorretos.', 'error');
      return;
    }
    localStorage.setItem('usuarioLogado', usuario);
    Swal.fire('Bem-vindo', `${usuario}`, 'success').then(() => {
      router.push('/');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-sm w-full text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {modoCriar ? 'Criar Usuário' : 'Login'}
        </h1>

        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Usuário"
          className="w-full border rounded p-2 mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          className="w-full border rounded p-2 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={modoCriar ? criarUsuario : fazerLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {modoCriar ? 'Criar e Entrar' : 'Entrar'}
        </button>

        {!modoCriar && (
          <div className="mt-4 text-sm text-center">
            <button
              onClick={() => setModoCriar(true)}
              className="text-blue-500 hover:underline"
            >
              Criar novo usuário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
