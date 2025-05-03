import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function Ranking() {
  const [frequencias, setFrequencias] = useState([]);
  const [filtrarTurma, setFiltrarTurma] = useState('');
  const [filtrarProfessor, setFiltrarProfessor] = useState('');
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('frequencias') || '[]');
    setFrequencias(dados);
  }, []);

  const turmas = [...new Set(frequencias.map((f) => f.turma))];
  const professores = [...new Set(frequencias.map((f) => f.professor))];

  useEffect(() => {
    const filtrados = frequencias.filter(
      (f) =>
        (!filtrarTurma || f.turma === filtrarTurma) &&
        (!filtrarProfessor || f.professor === filtrarProfessor)
    );

    const contagem = {};
    filtrados.forEach((f) => {
      f.alunos.forEach((a) => {
        if (!contagem[a.nome]) contagem[a.nome] = { presente: 0, total: 0 };
        contagem[a.nome].total += 1;
        if (a.presente) contagem[a.nome].presente += 1;
      });
    });

    const arr = Object.entries(contagem)
      .map(([nome, { presente, total }]) => ({
        nome,
        presenca: total ? (presente / total) * 100 : 0,
      }))
      .sort((a, b) => b.presenca - a.presenca);

    setRanking(arr);
  }, [frequencias, filtrarTurma, filtrarProfessor]);

  const exportarPDF = () => {
    if (ranking.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sem dados',
        text: 'Não há registros para exportar.',
      });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ranking de Presença', 20, 20);

    doc.setFontSize(12);
    if (filtrarTurma) doc.text(`Turma: ${filtrarTurma}`, 20, 30);
    if (filtrarProfessor) doc.text(`Professor: ${filtrarProfessor}`, 20, 36);

    ranking.forEach((r, i) => {
      const y = 50 + i * 8;
      doc.text(`${i + 1}. ${r.nome}`, 20, y);
      doc.text(`${r.presenca.toFixed(2)}%`, 140, y, { align: 'right' });
    });

    doc.save('ranking_presenca.pdf');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Ranking de Presença</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
        <div className="flex flex-col md:w-1/3">
          <label className="text-sm font-semibold mb-1">Filtrar por Turma</label>
          <select
            value={filtrarTurma}
            onChange={(e) => setFiltrarTurma(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todas as Turmas</option>
            {turmas.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:w-1/3">
          <label className="text-sm font-semibold mb-1">Filtrar por Professor</label>
          <select
            value={filtrarProfessor}
            onChange={(e) => setFiltrarProfessor(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todos os Professores</option>
            {professores.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportarPDF}
          className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md"
        >
          Exportar PDF
        </button>
      </div>

      {/* Lista de Ranking */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        {ranking.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">
            Nenhum dado disponível.
          </p>
        ) : (
          <ul className="space-y-2">
            {ranking.map((r, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b dark:border-gray-600 pb-2"
              >
                <span>
                  {idx + 1}. {r.nome}
                </span>
                <span>{r.presenca.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Gráfico */}
      {ranking.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-center">Gráfico de Presença</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ranking}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="presenca" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
