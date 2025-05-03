import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

export default function ListaFrequencias() {
  const [frequencias, setFrequencias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('frequencias') || '[]');
    setFrequencias(salvas);
  }, []);

  const excluir = (index) => {
    Swal.fire({
      title: 'Excluir chamada?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((res) => {
      if (res.isConfirmed) {
        const novas = [...frequencias];
        novas.splice(index, 1);
        localStorage.setItem('frequencias', JSON.stringify(novas));
        setFrequencias(novas);
        Swal.fire('Removido!', 'Frequência excluída.', 'success');
      }
    });
  };

  const editar = (index) => {
    router.push(`/frequencia/editar?index=${index}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequências Registradas</h1>

      {frequencias.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Nenhuma frequência registrada ainda.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-4">
          {frequencias.map((f, i) => {
            const totalPresentes = f.alunos.filter(a => a.presente).length;
            return (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="mb-2 md:mb-0 space-y-1">
                  <p><strong>Data:</strong> {f.data}</p>
                  <p><strong>Lição:</strong> {f.licao}</p>
                  <p><strong>Turma:</strong> {f.turma}</p>
                  <p><strong>Professor:</strong> {f.professor}</p>
                  <p><strong>Presentes:</strong> {totalPresentes}/{f.alunos.length}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editar(i)}
                    title="Editar"
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
                  >
                    📝 Editar
                  </button>
                  <button
                    onClick={() => excluir(i)}
                    title="Excluir"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
