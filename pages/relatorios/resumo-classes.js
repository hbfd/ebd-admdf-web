import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

export default function ResumoClasses() {
  const [frequencias, setFrequencias] = useState([]);
  const [filtrarTurma, setFiltrarTurma] = useState('');
  const [filtrarProfessor, setFiltrarProfessor] = useState('');
  const [filtrarData, setFiltrarData] = useState('');
  const [resumo, setResumo] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('frequencias') || '[]');
    setFrequencias(dados);
  }, []);

  const turmas = [...new Set(frequencias.map((f) => f.turma))];
  const professores = [...new Set(frequencias.map((f) => f.professor))];

  useEffect(() => {
    const filtradas = frequencias.filter((f) => {
      return (
        (!filtrarData || f.data === filtrarData) &&
        (!filtrarTurma || f.turma === filtrarTurma) &&
        (!filtrarProfessor || f.professor === filtrarProfessor)
      );
    });

    const resumoTemp = filtradas.map((f) => {
      const presencasPorAluno = f.alunos.reduce((acc, aluno) => {
        if (!acc[aluno.nome]) {
          acc[aluno.nome] = { presente: 0, total: 0 };
        }
        acc[aluno.nome].total += 1;
        if (aluno.presente) acc[aluno.nome].presente += 1;
        return acc;
      }, {});

      return {
        turma: f.turma,
        professor: f.professor,
        data: f.data,
        presencasPorAluno,
      };
    });

    setResumo(resumoTemp);
  }, [frequencias, filtrarTurma, filtrarProfessor, filtrarData]);

  const carregarLogo = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = '/admdf.jpg';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  const exportarPDF = async () => {
    if (resumo.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sem dados',
        text: 'Nenhuma frequência encontrada com os filtros aplicados.',
      });
      return;
    }

    const doc = new jsPDF({ orientation: 'portrait' });
    const logo = await carregarLogo();

    doc.addImage(logo, 'JPEG', 10, 10, 25, 25);
    doc.setFontSize(16);
    doc.text('Resumo de Classes', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(
      `Turma: ${filtrarTurma || 'Todas'} | Professor: ${filtrarProfessor || 'Todos'} | Data: ${filtrarData || 'Todas'}`,
      105,
      28,
      { align: 'center' }
    );

    let y = 40;

    resumo.forEach((r, idx) => {
      doc.setFontSize(12);
      doc.text(`Turma: ${r.turma}`, 14, y);
      doc.text(`Professor: ${r.professor}`, 70, y);
      doc.text(`Data: ${r.data}`, 140, y);
      y += 6;

      Object.entries(r.presencasPorAluno).forEach(([aluno, { presente, total }]) => {
        const porcentagem = ((presente / total) * 100).toFixed(2);
        doc.text(`${aluno}: ${porcentagem}%`, 20, y);
        y += 5;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 10;
      if (y > 270 && idx < resumo.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    const [yyyy, mm, dd] = (filtrarData || new Date().toISOString().slice(0, 10)).split('-');
    const nomeArquivo = `resumo_${filtrarTurma || 'geral'}_${dd}-${mm}-${yyyy}.pdf`;

    doc.save(nomeArquivo);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumo de Classes</h1>

      <div className="flex justify-between mb-6 gap-4 flex-wrap">
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-semibold mb-1">Filtrar por Turma</label>
          <select
            value={filtrarTurma}
            onChange={(e) => setFiltrarTurma(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todas as Turmas</option>
            {turmas.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-semibold mb-1">Filtrar por Professor</label>
          <select
            value={filtrarProfessor}
            onChange={(e) => setFiltrarProfessor(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Todos os Professores</option>
            {professores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-semibold mb-1">Filtrar por Data</label>
          <input
            type="date"
            value={filtrarData}
            onChange={(e) => setFiltrarData(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Sumário</h2>
        <p><strong>Total de Registros:</strong> {resumo.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        {resumo.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">Nenhuma frequência encontrada.</p>
        ) : (
          resumo.map((r, i) => (
            <div key={i} className="mb-6 p-4 bg-white dark:bg-gray-700 rounded shadow">
              <p><strong>Turma:</strong> {r.turma}</p>
              <p><strong>Professor:</strong> {r.professor}</p>
              <p><strong>Data:</strong> {r.data}</p>

              <ul className="list-disc ml-5 mt-2">
                {Object.entries(r.presencasPorAluno).map(([aluno, { presente, total }], idx) => (
                  <li key={idx}>
                    {aluno} - {(presente / total * 100).toFixed(2)}% de presença
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={exportarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md"
        >
          Exportar para PDF
        </button>
      </div>
    </div>
  );
}
