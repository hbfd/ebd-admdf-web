import { useEffect, useState } from 'react';

export default function RelatorioMensal() {
  const [frequencias, setFrequencias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  const [turma, setTurma] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    const f = JSON.parse(localStorage.getItem('frequencias') || '[]');
    const t = JSON.parse(localStorage.getItem('turmas') || '[]');
    const p = JSON.parse(localStorage.getItem('pessoas') || '[]');
    setFrequencias(f);
    setTurmas(t);
    setPessoas(p);
  }, []);

  const alunosDaTurma = pessoas.filter(p => p.funcao === 'Aluno' && p.turma === turma);

  const chamadasNoMes = frequencias.filter(f => {
    const data = new Date(f.data);
    return (
      f.turma === turma &&
      data.getMonth() + 1 === Number(mes) &&
      data.getFullYear() === Number(ano)
    );
  });

  const totalChamadas = chamadasNoMes.length;

  const contagem = alunosDaTurma.map((aluno) => {
    const presencas = chamadasNoMes.filter(f =>
      f.alunos.find(a => a.nome === aluno.nome && a.presente)
    ).length;

    return {
      nome: aluno.nome,
      presencas,
      porcentagem: totalChamadas > 0 ? Math.round((presencas / totalChamadas) * 100) : 0
    };
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Relatório de Presença por Mês</h1>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={turma}
            onChange={e => setTurma(e.target.value)}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t, i) => <option key={i}>{t}</option>)}
          </select>

          <select
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={mes}
            onChange={e => setMes(e.target.value)}
          >
            <option value="">Mês</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Ano"
            className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={ano}
            onChange={e => setAno(e.target.value)}
          />
        </div>

        {turma && mes && ano && (
          <div className="mt-6">
            <p className="mb-2 font-semibold">
              Chamadas registradas no mês: {totalChamadas}
            </p>
            {contagem.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300">Nenhum aluno encontrado para essa turma.</p>
            ) : (
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-800 text-black dark:text-white">
                    <th className="p-2 border dark:border-gray-600">Aluno</th>
                    <th className="p-2 border dark:border-gray-600">Presenças</th>
                    <th className="p-2 border dark:border-gray-600">Chamadas</th>
                    <th className="p-2 border dark:border-gray-600">% Presença</th>
                  </tr>
                </thead>
                <tbody>
                  {contagem.map((a, i) => (
                    <tr key={i} className="text-center">
                      <td className="p-2 border dark:border-gray-600">{a.nome}</td>
                      <td className="p-2 border dark:border-gray-600">{a.presencas}</td>
                      <td className="p-2 border dark:border-gray-600">{totalChamadas}</td>
                      <td className="p-2 border dark:border-gray-600">{a.porcentagem}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
