import { useState } from 'react';
import Swal from 'sweetalert2';

export default function AlterarSenha() {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const alterar = () => {
    const senhaSalva = localStorage.getItem('senha') || '1234';

    if (atual !== senhaSalva) {
      Swal.fire('Erro', 'Senha atual incorreta.', 'error');
      return;
    }

    if (!nova || nova.length < 4) {
      Swal.fire('Erro', 'A nova senha deve ter pelo menos 4 dígitos.', 'error');
      return;
    }

    if (nova !== confirmar) {
      Swal.fire('Erro', 'As senhas não coincidem.', 'error');
      return;
    }

    localStorage.setItem('senha', nova);
    Swal.fire('Sucesso', 'Senha alterada com sucesso!', 'success');
    setAtual('');
    setNova('');
    setConfirmar('');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Alterar Senha</h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold block">Senha Atual</label>
            <input
              type="password"
              value={atual}
              onChange={(e) => setAtual(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-semibold block">Nova Senha</label>
            <input
              type="password"
              value={nova}
              onChange={(e) => setNova(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-semibold block">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            onClick={alterar}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
