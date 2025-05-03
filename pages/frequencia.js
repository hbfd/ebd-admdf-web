import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Frequencia() {
  const [turmas, setTurmas] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [professorSelecionado, setProfessorSelecionado] = useState('');
  const [presencas, setPresencas] = useState({});
  const [data, setData] = useState('');
  const [licao, setLicao] = useState('');

  useEffect(() => {
    const turmasSalvas = JSON.parse(localStorage.getItem('turmas') || '[]');
    const pessoasSalvas = JSON.parse(localStorage.getItem('pessoas') || '[]');
    setTurmas(turmasSalvas);
    setPessoas(pessoasSalvas);
  }, []);

  const alunosDaTurma = pessoas.filter(p => p.funcao === 'Aluno' && p.turma === turmaSelecionada);
  const professoresDaTurma = pessoas.filter(p => p.funcao === 'Professor' && p.turma === turmaSelecionada);

  const marcarPresenca = (nome) => {
    setPresencas(prev => ({ ...prev, [nome]: !prev[nome] }));
  };

  const salvarChamada = () => {
    if (!data || !licao || !turmaSelecionada || !professorSelecionado) {
      Swal.fire('Erro', 'Preencha todos os campos.', 'error');
      return;
    }

    const chamada = {
      data,
      licao,
      turma: turmaSelecionada,
      professor: professorSelecionado,
      alunos: alunosDaTurma.map(a => ({
        nome: a.nome,
        presente: presencas[a.nome] || false
      }))
    };

    const chamadasSalvas = JSON.parse(localStorage.getItem('frequencias') || '[]');
    chamadasSalvas.push(chamada);
    localStorage.setItem('frequencias', JSON.stringify(chamadasSalvas));

    Swal.fire('Sucesso', 'Frequência registrada com sucesso!', 'success');

    setPresencas({});
    setTurmaSelecionada('');
    setProfessorSelecionado('');
    setData('');
    setLicao('');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Registrar Frequência</h1>

      <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded shadow-md">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-200">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-200">Lição</label>
            <input
              type="number"
              min="1"
              value={licao}
              onChange={(e) => setLicao(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
              placeholder="Nº da Lição"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-200">Turma</label>
            <select
              value={turmaSelecionada}
              onChange={(e) => {
                setTurmaSelecionada(e.target.value);
                setProfessorSelecionado('');
                setPresencas({});
              }}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione a Turma</option>
              {turmas.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-200">Professor do Dia</label>
            <select
              value={professorSelecionado}
              onChange={(e) => setProfessorSelecionado(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Selecione o Professor</option>
              {professoresDaTurma.map((p, i) => (
                <option key={i} value={p.nome}>{p.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {turmaSelecionada && alunosDaTurma.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Alunos da Turma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alunosDaTurma.map((a, i) => (
                <label key={i} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded">
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
            onClick={salvarChamada}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md"
          >
            Salvar Frequência
          </button>
        </div>
      </div>
    </div>
  );
}
