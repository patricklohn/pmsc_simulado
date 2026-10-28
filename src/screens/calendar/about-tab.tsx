import { LuBanknote, LuBuilding2, LuReceipt, LuUsers } from 'react-icons/lu';
import { Card } from '@components/card';
import { Section } from '@components/section';
import { Stat } from '@components/stat';
import { useContent } from '@contexts/content';
import { formatMoney } from '@utils/format-money';
import { BulletList, Chips, InfoGrid, Phase, PhaseList, StatGrid, Table } from './styles';

/** Resumo do edital: números, prova, fases, requisitos e cidades. */
export function AboutTab() {
  const { notice: NOTICE, areaNames, areaOfSubject, subjectName } = useContent();
  const { provaObjetiva, redacao, notaFinal } = NOTICE;

  return (
    <>
      <StatGrid>
        <Stat label="Vagas" value={NOTICE.vagas} icon={<LuUsers />} />
        <Stat
          label="Remuneração inicial"
          value={formatMoney(NOTICE.remuneracao)}
          hint={`+ ${formatMoney(NOTICE.auxilioAlimentacao)} de auxílio-alimentação`}
          icon={<LuBanknote />}
          tone="secondary"
        />
        <Stat label="Taxa de inscrição" value={formatMoney(NOTICE.taxa)} icon={<LuReceipt />} tone="warning" />
        <Stat
          label="Banca"
          value={NOTICE.banca}
          hint={NOTICE.siteBanca.replace('https://', '')}
          icon={<LuBuilding2 />}
        />
      </StatGrid>

      <Section title="Prova objetiva">
        <Card>
          <Table>
            <thead>
              <tr>
                <th scope="col">Área</th>
                <th scope="col">Matéria</th>
                <th scope="col">Questões</th>
              </tr>
            </thead>
            <tbody>
              {provaObjetiva.distribuicao.map((item) => (
                <tr key={item.materia}>
                  <td>{areaNames[areaOfSubject[item.materia]]}</td>
                  <td>{subjectName(item.materia)}</td>
                  <td>{item.questoes}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total (1 ponto por questão, 5 alternativas)</td>
                <td>{provaObjetiva.totalQuestoes}</td>
              </tr>
            </tfoot>
          </Table>
        </Card>
        <InfoGrid>
          <Card>
            <strong>Para passar</strong>
            <p>{provaObjetiva.criterioAprovacao}</p>
            <p>{provaObjetiva.observacao}</p>
          </Card>
          <Card>
            <strong>Redação</strong>
            <p>
              {redacao.tipo}, vale {redacao.pontos} pontos e precisa de no mínimo {redacao.minimo}. Fórmula:{' '}
              {redacao.formula}.
            </p>
            <p>{redacao.corrigidaAte}</p>
          </Card>
          <Card>
            <strong>Nota final</strong>
            <p>{notaFinal.formula}</p>
            <p>{notaFinal.descricao}</p>
          </Card>
        </InfoGrid>
      </Section>

      <Section title="Fases do concurso">
        <PhaseList>
          {NOTICE.fases.map((phase) => (
            <Phase key={phase.titulo}>
              <span>{phase.fase}</span>
              <div>
                <strong>{phase.titulo}</strong>
                <small>{phase.carater}</small>
                <p>{phase.descricao}</p>
              </div>
            </Phase>
          ))}
        </PhaseList>
      </Section>

      <Section title="Requisitos para o cargo">
        <Card>
          <BulletList>
            {NOTICE.requisitos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </BulletList>
        </Card>
      </Section>

      <Section title="Sobre as vagas">
        <Card>
          <BulletList>
            <li>Escolaridade: {NOTICE.escolaridade}.</li>
            <li>Validade do concurso: {NOTICE.validade}.</li>
            {NOTICE.observacoesVagas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </BulletList>
        </Card>
      </Section>

      <Section title="Cidades de prova">
        <Chips>
          {NOTICE.cidadesProva.map((city) => (
            <li key={city}>{city}</li>
          ))}
        </Chips>
      </Section>
    </>
  );
}
