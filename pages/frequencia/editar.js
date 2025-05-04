import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function EditarFrequencia() {
  const router = useRouter();
  const [index, setIndex] = useState(null);
  const [frequencia, setFrequencia] = useState(null);
  const [presencas, setPresencas] = useState({});
  const [turmas, setTurmas] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;

    const idx = parseInt(router.query.index);
    const todas = JSON.parse(localStorage.getItem('frequencias') || '[]');
    const selecionada = todas[idx];

    if (!selecionada) {
      Swal.fire('Erro', 'Frequência não encontrada.', 'error');
      router.push('/frequencia/lista');
      return;
    }

    setIndex(idx);
    setFrequencia({
      ...selecionada,
      biblias: selecionada.biblias || '',
      revistas: selecionada.revistas || '',
      visitantes: selecionada.visitantes || '',
      ofertas: selecionada.ofertas || '',
    });

    const marcadas = {};
    selecionada.alunos.forEach(a => {
      marcadas[a.nome] = a.presente;
    });
    setPresencas(marcadas);

    const turmasSalvas = JSON.parse(localStorage.getItem('turmas') || '[]');
    const pessoasSalvas = JSON.parse(localStorage.getItem('pessoas') || '[]');
    setTurmas(turmasSalvas);
    setPessoas(pessoasSalvas);
  }, [router.isReady]);

  const alunosDaTurma = pessoas.filter(p => p.funcao === 'Aluno' && p.turma === frequencia?.turma);
  const professoresDaTurma = pessoas.filter(p => p.funcao === 'Professor' && p.turma === frequencia?.turma);

  const marcarPresenca = (nome) => {
    setPresencas(prev => ({ ...prev, [nome]: !prev[nome] }));
  };

  const salvarEdicao = () => {
    if (!frequencia.data || !frequencia.licao || !frequencia.turma || !frequencia.professor) {
      Swal.fire('Erro', 'Preencha todos os campos.', 'error');
      return;
    }

    const atualizado = {
      ...frequencia,
      alunos: alunosDaTurma.map(a => ({
        nome: a.nome,
        presente: presencas[a.nome] || false
      }))
    };

    const todas = JSON.parse(localStorage.getItem('frequencias') || '[]');
    todas[index] = atualizado;
    localStorage.setItem('frequencias', JSON.stringify(todas));

    Swal.fire('Sucesso', 'Frequência atualizada!', 'success').then(() =>
      router.push('/frequencia/lista')
    );
  };

  if (!frequencia) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Frequência</h1>

      <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold block mb-1">Data</label>
            <input
              type="date"
              value={frequencia.data}
              onChange={(e) => setFrequencia({ ...frequencia, data: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Lição</label>
            <input
              type="number"
              min="1"
              value={frequencia.licao}
              onChange={(e) => setFrequencia({ ...frequencia, licao: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nº da Lição"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Turma</label>
            <select
              value={frequencia.turma}
              onChange={(e) =>
                setFrequencia({
                  ...frequencia,
                  turma: e.target.value,
                  professor: '',
                })
              }
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione a Turma</option>
              {turmas.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Professor do Dia</label>
            <select
              value={frequencia.professor}
              onChange={(e) => setFrequencia({ ...frequencia, professor: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Selecione o Professor</option>
              {professoresDaTurma.map((p, i) => (
                <option key={i} value={p.nome}>{p.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold block mb-1">Bíblias</label>
            <input
              type="number"
              value={frequencia.biblias}
              onChange={(e) => setFrequencia({ ...frequencia, biblias: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Qtd. Bíblias"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Revistas</label>
            <input
              type="number"
              value={frequencia.revistas}
              onChange={(e) => setFrequencia({ ...frequencia, revistas: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Qtd. Revistas"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Visitantes</label>
            <input
              type="number"
              value={frequencia.visitantes}
              onChange={(e) => setFrequencia({ ...frequencia, visitantes: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Qtd. Visitantes"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Ofertas (R$)</label>
            <input
              type="number"
              step="0.01"
              value={frequencia.ofertas}
              onChange={(e) => setFrequencia({ ...frequencia, ofertas: e.target.value })}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Valor das Ofertas"
            />
          </div>
        </div>

        {frequencia.turma && alunosDaTurma.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Alunos da Turma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alunosDaTurma.map((a, i) => (
                <label key={i} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={presencas[a.nome] || false}
                    onChange={() => marcarPresenca(a.nome)}
                  />
                  {a.nome}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={salvarEdicao}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
