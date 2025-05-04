import Link from 'next/link';

export default function RelatoriosIndex() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link href="/relatorios/frequencia-nominal">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Frequência</h2>
            <p>Veja a lista de presença de cada chamada.</p>
          </div>
        </Link>

        <Link href="/relatorios/ranking">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Ranking de Presença</h2>
            <p>Ordenação dos alunos por percentual de presença.</p>
          </div>
        </Link>

        <Link href="/relatorios/aniversariantes">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Aniversariantes</h2>
            <p>Lista de aniversariantes do mês.</p>
          </div>
        </Link>

        <Link href="/relatorios/resumo-classes">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Resumo de Classes</h2>
            <p>Resumo de presenças por aluno em cada turma.</p>
          </div>
        </Link>

        <Link href="/relatorios/mensal">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2">Presença por Mês</h2>
            <p>Total de presenças por aluno em um mês específico.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
