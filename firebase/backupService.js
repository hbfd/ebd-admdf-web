// firebase/backupService.js
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config';
import Swal from 'sweetalert2';

const storage = getStorage(app);

export async function salvarBackupNaNuvem() {
  try {
    const dados = {
      aluno: JSON.parse(localStorage.getItem('aluno') || '[]'),
      professor: JSON.parse(localStorage.getItem('professor') || '[]'),
      turma: JSON.parse(localStorage.getItem('turma') || '[]'),
      igreja: JSON.parse(localStorage.getItem('igreja') || '[]'),
      frequencias: JSON.parse(localStorage.getItem('frequencias') || '[]'),
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const dataHora = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeArquivo = `backup_${dataHora}.json`;

    // Salva com nome baseado em data
    const refComData = ref(storage, `backups/${nomeArquivo}`);
    await uploadBytes(refComData, blob);

    // Salva também como "backup_mais_recente.json"
    const refMaisRecente = ref(storage, 'backups/backup_mais_recente.json');
    await uploadBytes(refMaisRecente, blob);

    Swal.fire('Sucesso', 'Backup enviado para a nuvem!', 'success');
  } catch (error) {
    console.error(error);
    Swal.fire('Erro', `Falha ao enviar para a nuvem: ${error.message}`, 'error');
  }
}

export async function restaurarBackupDaNuvem() {
  try {
    const caminhoPadrao = 'backups/backup_mais_recente.json';
    const url = await getDownloadURL(ref(storage, caminhoPadrao));
    const res = await fetch(url);
    const dados = await res.json();

    localStorage.setItem('aluno', JSON.stringify(dados.aluno || []));
    localStorage.setItem('professor', JSON.stringify(dados.professor || []));
    localStorage.setItem('turma', JSON.stringify(dados.turma || []));
    localStorage.setItem('igreja', JSON.stringify(dados.igreja || []));
    localStorage.setItem('frequencias', JSON.stringify(dados.frequencias || []));

    Swal.fire('Sucesso', 'Backup restaurado da nuvem!', 'success');
  } catch (error) {
    console.error(error);
    Swal.fire('Erro', `Não foi possível restaurar da nuvem: ${error.message}`, 'error');
  }
}
