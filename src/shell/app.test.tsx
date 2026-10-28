import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { CalendarPage } from '@screens/calendar';
import { EssayPage } from '@screens/essay';
import { ExamPage } from '@screens/exam';
import { ExamHistoryPage } from '@screens/exam-history';
import { ExamResultPage } from '@screens/exam-result';
import { ExamSetupPage } from '@screens/exam-setup';
import { HomePage } from '@screens/home';
import { NotFoundPage } from '@screens/not-found';
import { StudyPage } from '@screens/study';
import { StudySubjectPage } from '@screens/study-subject';
import { TEST_QUESTIONS } from '@tests/content-fixture';
import { mockApi } from '@tests/mock-api';
import { mockNavigation } from '@tests/next-navigation';
import { renderWithProviders } from '@tests/render-with-providers';
import type { iExam, iExamReview, iExamSession } from '@/types/exam';
import { MainLayout } from './main-layout';
import { ROUTES } from './routes';

const ME = { uuid: 'u1', name: 'Ana Souza', email: 'ana@exemplo.com.br', role: 'student' };
const SESSION = { access_token: 'token', token_type: 'Bearer', expires_in: '60m', refresh_token: 'r', role: 'student' };
const [Q1, Q2] = TEST_QUESTIONS;
const EXAM: iExam = {
  id: '00000000-0000-4000-8000-000000000001',
  mode: 'rapido',
  status: 'in_progress',
  questionIds: [Q1.id, Q2.id],
  answers: {},
  flagged: [],
  currentIndex: 0,
  startedAt: new Date(2026, 9, 26, 10, 0).toISOString(),
  deadlineAt: new Date(2026, 9, 26, 10, 8).toISOString(),
  timeLimit: 480,
};
const strip = (question: (typeof TEST_QUESTIONS)[number]) => ({
  id: question.id,
  materia: question.materia,
  topico: question.topico,
  enunciado: question.enunciado,
  alternativas: question.alternativas,
  dificuldade: question.dificuldade,
});
const EXAM_SESSION: iExamSession = { exam: EXAM, questions: [strip(Q1), strip(Q2)] };
const REVIEW: iExamReview = {
  exam: { ...EXAM, status: 'finished', answers: { [Q1.id]: Q1.correta }, finishedAt: EXAM.deadlineAt },
  result: {
    correct: 1,
    total: 2,
    percent: 50,
    bySubject: [{ subjectId: Q1.materia, correct: 1, total: 2 }],
    byArea: [{ areaId: 'direito', correct: 1, total: 2 }],
    isApproved: true,
    zeroedAreas: [],
  },
  questions: [Q1, Q2].map((question) => ({
    ...strip(question),
    correta: question.correta,
    comentario: question.comentario,
    fonte: question.fonte,
  })),
};

/** API logada com um histórico vazio. */
function mockLoggedApi(extra: Parameters<typeof mockApi>[0] = {}) {
  return mockApi({
    'POST /api/auth/renovar': () => ({ body: SESSION }),
    'GET /api/auth/eu': () => ({ body: ME }),
    'GET /api/progresso': () => ({ body: { doneTopics: [] } }),
    'GET /api/simulados': () => ({ body: { current: null, history: [] } }),
    ...extra,
  });
}

describe('app', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date(2026, 9, 26, 10, 0) });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('início cumprimenta o usuário e mostra a contagem regressiva', async () => {
    mockLoggedApi();
    renderWithProviders(<HomePage />);

    expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Simulado Prova no formato/ })).toHaveAttribute('href', ROUTES.exams);
  });

  it('menu marca a seção atual e tem o sair', async () => {
    mockLoggedApi();
    renderWithProviders(<MainLayout>conteúdo</MainLayout>, { route: '/estudo/direito-penal' });

    const bottom = screen.getByRole('navigation', { name: 'Navegação' });
    expect(within(bottom).getByRole('link', { name: 'Estudo' })).toHaveAttribute('aria-current', 'page');
    expect(within(bottom).getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current');
    expect(screen.getAllByRole('button', { name: 'Sair' }).length).toBeGreaterThan(0);
  });

  it('calendário marca as inscrições como em andamento', async () => {
    mockLoggedApi();
    renderWithProviders(<CalendarPage />);

    expect(await screen.findByRole('heading', { name: 'Calendário e edital' })).toBeInTheDocument();
    expect(screen.getAllByText('Em andamento').length).toBeGreaterThan(0);
  });

  it('marcar tópico como estudado chama a API', async () => {
    const api = mockLoggedApi({ 'POST /api/progresso': () => ({ body: { ok: true } }) });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<StudySubjectPage />, { params: { materia: 'informatica' } });

    await user.click((await screen.findAllByRole('checkbox', { name: 'Marcar como estudado', hidden: true }))[0]);

    await waitFor(() =>
      expect(api).toHaveBeenCalledWith(
        expect.stringContaining('/api/progresso'),
        expect.objectContaining({ method: 'POST' })
      )
    );
  });

  it('simulado: começar, responder, entregar e ver a nota', async () => {
    let isFinished = false;
    const api = mockLoggedApi({
      'POST /api/simulados': () => ({ status: 201, body: EXAM_SESSION }),
      [`GET /api/simulados/${EXAM.id}`]: () => ({ body: isFinished ? REVIEW : EXAM_SESSION }),
      [`PATCH /api/simulados/${EXAM.id}`]: () => ({ body: { saved: true } }),
      [`POST /api/simulados/${EXAM.id}/entregar`]: () => {
        isFinished = true;
        return { body: REVIEW };
      },
    });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const setup = renderWithProviders(<ExamSetupPage />, { route: ROUTES.exams });

    await user.click(screen.getByRole('button', { name: 'Começar simulado rápido' }));
    await waitFor(() => expect(mockNavigation.push).toHaveBeenCalledWith(`${ROUTES.exam}?id=${EXAM.id}`));
    setup.unmount();

    const exam = renderWithProviders(<ExamPage />, { route: `${ROUTES.exam}?id=${EXAM.id}` });
    const group = await screen.findByRole('radiogroup', { name: 'Alternativas da questão 1' });
    const options = within(group).getAllByRole('radio');
    await user.click(options[0]);
    expect(options[0]).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('button', { name: 'Entregar prova' }));
    await user.click(screen.getByRole('button', { name: 'Entregar e ver nota' }));
    await waitFor(() => expect(mockNavigation.replace).toHaveBeenCalledWith(`${ROUTES.examResult}?id=${EXAM.id}`));
    const finishCall = api.mock.calls.find(([url]) => String(url).endsWith('/entregar'));
    expect(JSON.parse(String(finishCall?.[1]?.body)).answers).toEqual({ [Q1.id]: 'A' });
    exam.unmount();

    renderWithProviders(<ExamResultPage />, { route: `${ROUTES.examResult}?id=${EXAM.id}` });
    expect(await screen.findByRole('heading', { name: 'Resultado do simulado' })).toBeInTheDocument();
    expect(screen.getByText('Aprovado na objetiva')).toBeInTheDocument();
  });

  it.each([
    ['estudo', () => <StudyPage />, 'Grade de estudos', {}],
    ['matéria', () => <StudySubjectPage />, 'Direito Constitucional', { materia: 'direito-constitucional' }],
    ['redação', () => <EssayPage />, 'Redação', {}],
    ['histórico vazio', () => <ExamHistoryPage />, 'Histórico', {}],
    ['prova vazia', () => <ExamPage />, 'Nenhum simulado em andamento', {}],
    ['404', () => <NotFoundPage />, 'Página não encontrada', {}],
  ] as [string, () => ReactElement, string, Record<string, string>][])(
    'tela %s abre sem erro',
    async (_, ui, heading, params) => {
      mockLoggedApi({ 'GET /api/simulados/ultimo': () => ({ body: null }) });
      renderWithProviders(ui(), { params });
      expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
    }
  );
});
