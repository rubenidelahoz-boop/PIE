import emailjs from '@emailjs/browser';

interface EnviarParams {
  destinatario:     string;
  establecimiento:  string;
  balanceDocente:   number;
  balanceAsistente: number;
  totalEstudiantes: number;
}

export async function enviarCorreoPIE(params: EnviarParams) {
  const { destinatario, establecimiento, balanceDocente, balanceAsistente, totalEstudiantes } = params;

  const signo = (n: number) => n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1);

  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      to_email:          destinatario,
      establecimiento,
      balance_docente:   `${signo(balanceDocente)} h`,
      balance_asistente: `${signo(balanceAsistente)} h`,
      total_estudiantes: totalEstudiantes,
      estado_docente:    balanceDocente   >= 0 ? '✅ Cumple normativa' : '⚠️ Déficit de horas',
      estado_asistente:  balanceAsistente >= 0 ? '✅ Cumple normativa' : '⚠️ Déficit de horas',
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}
