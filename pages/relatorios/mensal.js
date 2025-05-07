import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const gerarPDF = async () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const logo = await carregarLogo();

    doc.addImage(logo, 'JPEG', 10, 10, 25, 25);
    doc.setFontSize(16);
    doc.text('Relatório de Presença por Mês', 150, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Turma: ${turma || '-'} | Mês: ${mes.padStart(2, '0')}/${ano}`, 150, 28, { align: 'center' });

    autoTable(doc, {
      startY: 40,
      head: [['Aluno', 'Presenças', 'Chamadas', '% Presença']],
      body: contagem.map(a => [a.nome, a.presencas, totalChamadas, `${a.porcentagem}%`]),
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    const nomeArquivo = `mensal_${turma}_${mes.padStart(2, '0')}-${ano}.pdf`;
    doc.save(nomeArquivo);
  };

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
              <>
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
                <button
                  onClick={gerarPDF}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Gerar PDF
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
