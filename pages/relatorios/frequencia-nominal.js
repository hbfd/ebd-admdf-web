import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FrequenciaNominal() {
  const [frequencias, setFrequencias] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [turmas, setTurmas] = useState([]);

  const [turma, setTurma] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [licaoFiltro, setLicaoFiltro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    setFrequencias(JSON.parse(localStorage.getItem('frequencias') || '[]'));
    setPessoas(JSON.parse(localStorage.getItem('pessoas') || '[]'));
    setTurmas(JSON.parse(localStorage.getItem('turmas') || '[]'));
  }, []);

  const chamadasFiltradas = frequencias
    .filter(f => turma ? f.turma === turma : true)
    .filter(f => {
      const data = new Date(f.data + 'T00:00:00');
      if (dataInicio && data < new Date(dataInicio)) return false;
      if (dataFim && data > new Date(dataFim)) return false;
      return true;
    })
    .filter(f => licaoFiltro ? String(f.licao) === String(licaoFiltro) : true);

  const registros = [];
  chamadasFiltradas.forEach(f => {
    f.alunos.forEach(a => {
      if (
        filtroStatus === 'presentes' && !a.presente ||
        filtroStatus === 'ausentes' && a.presente
      ) return;

      registros.push({
        data: f.data,
        licao: f.licao,
        aluno: a.nome,
        presente: a.presente,
        professor: f.professor,
        biblias: f.biblias,
        revistas: f.revistas,
        visitantes: f.visitantes,
        ofertas: f.ofertas,
      });
    });
  });

  registros.sort((a, b) => a.licao - b.licao || a.data.localeCompare(b.data) || a.aluno.localeCompare(b.aluno));

  const agrupados = {};
  registros.forEach(r => {
    const chave = `Lição ${r.licao} – Professor: ${r.professor || 'Desconhecido'}`;
    if (!agrupados[chave]) {
      agrupados[chave] = {
        alunos: [],
        data: r.data,
        biblias: r.biblias || 0,
        revistas: r.revistas || 0,
        visitantes: r.visitantes || 0,
        ofertas: r.ofertas || 0,
      };
    }
    agrupados[chave].alunos.push(r);
  });

  const formatarData = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

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
    doc.text(`Relatório de Frequência`, 150, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Turma: ${turma || 'Todas'} | ${dataInicio || 'início'} até ${dataFim || 'hoje'}${licaoFiltro ? ` | Lição ${licaoFiltro}` : ''}`, 150, 28, { align: 'center' });

    let y = 40;
    Object.entries(agrupados).forEach(([titulo, grupo]) => {
      autoTable(doc, {
        startY: y,
        head: [[titulo]],
        theme: 'plain',
        styles: { fontStyle: 'bold', halign: 'left' },
        margin: { left: 14 },
      });

      doc.setFontSize(10);
      doc.text(`Bíblias: ${grupo.biblias || 0} | Revistas: ${grupo.revistas || 0} | Visitantes: ${grupo.visitantes || 0} | Ofertas: R$ ${Number(grupo.ofertas || 0).toFixed(2)}`, 14, doc.lastAutoTable.finalY + 5);

      autoTable(doc, {
        head: [['Data', 'Aluno', 'Status']],
        body: (grupo.alunos || []).map(r => [
          formatarData(r.data),
          r.aluno,
          r.presente ? 'Presente' : 'Ausente',
        ]),
        styles: { fontSize: 10 },
        startY: doc.lastAutoTable.finalY + 10,
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`frequencia_${turma || 'geral'}.pdf`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Relatório de Frequência</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-5xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={turma} onChange={e => setTurma(e.target.value)}>
            <option value="">Turma</option>
            {turmas.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>

          <input className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
          <input className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />

          <input className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="number" placeholder="Lição" value={licaoFiltro} onChange={e => setLicaoFiltro(e.target.value)} />

          <select className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="presentes">Somente Presentes</option>
            <option value="ausentes">Somente Ausentes</option>
          </select>
        </div>

        {Object.keys(agrupados).length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300 mt-6">Nenhum registro encontrado com os filtros aplicados.</p>
        ) : (
          Object.entries(agrupados).map(([chave, grupo], idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold mt-6">{chave}</h3>
              <p className="text-sm mb-2">Bíblias: {grupo.biblias || 0} | Revistas: {grupo.revistas || 0} | Visitantes: {grupo.visitantes || 0} | Ofertas: R$ {Number(grupo.ofertas || 0).toFixed(2)}</p>
              <table className="w-full border mt-2 text-sm dark:border-gray-700">
                <thead>
                  <tr className="bg-blue-100 dark:bg-blue-900 dark:text-white">
                    <th className="p-2 border">Data</th>
                    <th className="p-2 border">Aluno</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(grupo.alunos || []).map((r, i) => (
                    <tr key={i} className="text-center">
                      <td className="p-1 border dark:border-gray-700">{formatarData(r.data)}</td>
                      <td className="p-1 border dark:border-gray-700">{r.aluno}</td>
                      <td className="p-1 border dark:border-gray-700">{r.presente ? 'Presente' : 'Ausente'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        {Object.keys(agrupados).length > 0 && (
          <div className="text-center">
            <button onClick={gerarPDF} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow">
              Gerar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
