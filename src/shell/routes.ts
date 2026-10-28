/** Caminhos das telas, em português (aparecem na barra de endereço). */
export const ROUTES = {
  home: '/',
  login: '/entrar',
  register: '/criar-conta',
  calendar: '/calendario',
  study: '/estudo',
  essay: '/estudo/redacao',
  exams: '/simulado',
  exam: '/simulado/prova',
  examResult: '/simulado/resultado',
  examHistory: '/simulado/historico',
} as const;

/** Telas abertas sem login. */
export const PUBLIC_ROUTES: string[] = [ROUTES.login, ROUTES.register];

/** Rota de uma matéria. */
export const subjectRoute = (subjectId: string) => `${ROUTES.study}/${subjectId}`;

/** Resultado de um simulado entregue. */
export const examResultRoute = (examId: string) => `${ROUTES.examResult}?id=${examId}`;
