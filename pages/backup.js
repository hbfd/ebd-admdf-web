// pages/backup.js
import Swal from 'sweetalert2';

export default function Backup() {
  const fazerBackup = () => {
    const dados = {
      aluno: JSON.parse(localStorage.getItem('aluno') || '[]'),
      professor: JSON.parse(localStorage.getItem('professor') || '[]'),
      turma: JSON.parse(localStorage.getItem('turma') || '[]'),
      igreja: JSON.parse(localStorage.getItem('igreja') || '[]'),
      frequencias: JSON.parse(localStorage.getItem('frequencias') || '[]'),
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_ebd_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Backup Exportado!',
      text: 'O arquivo foi salvo com sucesso.',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const restaurarBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result);

        localStorage.setItem('aluno', JSON.stringify(dados.aluno || []));
        localStorage.setItem('professor', JSON.stringify(dados.professor || []));
        localStorage.setItem('turma', JSON.stringify(dados.turma || []));
        localStorage.setItem('igreja', JSON.stringify(dados.igreja || []));
        localStorage.setItem('frequencias', JSON.stringify(dados.frequencias || []));

        Swal.fire({
          icon: 'success',
          title: 'Backup Restaurado!',
          text: 'Os dados foram importados com sucesso.',
          timer: 2000,
          showConfirmButton: false,
        });

        event.target.value = ''; // permite reusar o mesmo arquivo
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Arquivo inválido ou corrompido.',
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center space-y-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Backup de Dados</h1>

      <button
        onClick={fazerBackup}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md"
      >
        Exportar Backup
      </button>

      <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-md">
        Importar Backup
        <input
          type="file"
          accept=".json"
          onChange={restaurarBackup}
          className="hidden"
        />
      </label>
    </div>
  );
}
