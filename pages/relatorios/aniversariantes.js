import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

export default function Aniversariantes() {
  const [alunos, setAlunos] = useState([]);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [listaAniversariantes, setListaAniversariantes] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('aluno') || '[]');
    setAlunos(dados);
  }, []);

  useEffect(() => {
    const [ano, mm] = mes.split('-').map(Number);
    const filtrados = alunos.filter((a) => {
      const dt = new Date(a.dataNascimento);
      return dt.getMonth() + 1 === mm;
    });
    setListaAniversariantes(filtrados);
  }, [mes, alunos]);

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
    if (listaAniversariantes.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Nenhum aniversariante',
        text: 'Não há aniversariantes para este mês.',
      });
      return;
    }

    const doc = new jsPDF();
    const logo = await carregarLogo();

    doc.addImage(logo, 'JPEG', 10, 10, 25, 25);
    doc.setFontSize(16);
    doc.text('Relatório de Aniversariantes', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    const [ano, mm] = mes.split('-');
    doc.text(`Mês: ${mm}/${ano}`, 105, 28, { align: 'center' });

    doc.setFontSize(12);
    listaAniversariantes.forEach((a, i) => {
      const dt = new Date(a.dataNascimento).toLocaleDateString();
      doc.text(`${i + 1}. ${a.nome} — ${dt}`, 20, 40 + i * 8);
    });

    const dataHoje = new Date();
    const dia = String(dataHoje.getDate()).padStart(2, '0');
    const mesAtual = String(dataHoje.getMonth() + 1).padStart(2, '0');
    const anoAtual = dataHoje.getFullYear();
    const nomeArquivo = `aniversariantes_${dia}-${mesAtual}-${anoAtual}.pdf`;

    doc.save(nomeArquivo);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Aniversariantes do Mês</h1>

      <div className="flex justify-center mb-6">
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold mb-1">Selecione o Mês</label>
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-6 max-w-md mx-auto text-center">
        <p><strong>Total de Aniversariantes:</strong> {listaAniversariantes.length}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-2xl mx-auto">
        {listaAniversariantes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">Nenhum aniversariante neste mês.</p>
        ) : (
          <ul className="list-decimal list-inside space-y-2">
            {listaAniversariantes.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span>{a.nome}</span>
                <span>{new Date(a.dataNascimento).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
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
