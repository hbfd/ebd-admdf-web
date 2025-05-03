// File: pages/cadastro.js

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('Aluno');
  const [turma, setTurma] = useState('');
  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState('');
  const [pessoas, setPessoas] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const turmasSalvas = JSON.parse(localStorage.getItem('turmas') || '[]');
    const pessoasSalvas = JSON.parse(localStorage.getItem('pessoas') || '[]');
    setTurmas(turmasSalvas);
    setPessoas(pessoasSalvas);
  }, []);

  const cadastrarTurma = () => {
    if (!novaTurma.trim()) {
      Swal.fire('Erro', 'Informe o nome da turma.', 'error');
      return;
    }
    const novas = [...turmas, novaTurma];
    setTurmas(novas);
    localStorage.setItem('turmas', JSON.stringify(novas));
    setNovaTurma('');
    Swal.fire('Sucesso', 'Turma adicionada!', 'success');
  };

  const salvarPessoa = () => {
    if (!nome.trim() || !funcao || !turma) {
      Swal.fire('Erro', 'Preencha todos os campos.', 'error');
      return;
    }

    const atualizadas = [...pessoas];

    if (editando !== null) {
      atualizadas[editando] = { nome, funcao, turma };
      Swal.fire('Sucesso', 'Cadastro atualizado!', 'success');
    } else {
      atualizadas.push({ nome, funcao, turma });
      Swal.fire('Sucesso', `${funcao} cadastrado(a)!`, 'success');
    }

    setPessoas(atualizadas);
    localStorage.setItem('pessoas', JSON.stringify(atualizadas));

    setNome('');
    setFuncao('Aluno');
    setTurma('');
    setEditando(null);
  };

  const editar = (index) => {
    const pessoa = pessoas[index];
    setNome(pessoa.nome);
    setFuncao(pessoa.funcao);
    setTurma(pessoa.turma);
    setEditando(index);
  };

  const excluir = (index) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sim, excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        const atualizadas = pessoas.filter((_, i) => i !== index);
        setPessoas(atualizadas);
        localStorage.setItem('pessoas', JSON.stringify(atualizadas));
        Swal.fire('Excluído!', 'O cadastro foi removido.', 'success');
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Cadastro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Cadastro de Aluno/Professor */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {editando !== null ? 'Editar Cadastro' : 'Cadastrar Aluno/Professor'}
          </h2>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Digite o nome"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Função</label>
            <select
              value={funcao}
              onChange={(e) => setFuncao(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Aluno">Aluno</option>
              <option value="Professor">Professor</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Turma</label>
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione a Turma</option>
              {turmas.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            onClick={salvarPessoa}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md w-full"
          >
            {editando !== null ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>

        {/* Cadastro de Turma */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Cadastrar Turma</h2>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nome da Turma</label>
            <input
              type="text"
              value={novaTurma}
              onChange={(e) => setNovaTurma(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Digite o nome da turma"
            />
          </div>

          <button
            onClick={cadastrarTurma}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow-md w-full"
          >
            Adicionar Turma
          </button>
        </div>
      </div>

      {/* Lista de Alunos/Professores */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Cadastrados</h2>

        {pessoas.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhum cadastro ainda.</p>
        ) : (
          <table className="w-full border dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Nome</th>
                <th className="p-2">Função</th>
                <th className="p-2">Turma</th>
                <th className="p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p, i) => (
                <tr key={i} className="border-t dark:border-gray-700">
                  <td className="p-2">{p.nome}</td>
                  <td className="p-2">{p.funcao}</td>
                  <td className="p-2">{p.turma}</td>
                  <td className="p-2 space-x-2 flex gap-2">
                    <button
                      onClick={() => editar(i)}
                      title="Editar"
                      className="p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full text-white shadow"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => excluir(i)}
                      title="Excluir"
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
