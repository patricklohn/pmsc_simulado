import { Alert } from '@components/alert';
import { Card } from '@components/card';
import { useContent } from '@contexts/content';
import { BulletList, Groups, Table, TafHeader } from './styles';

/** Tabelas de pontuação do TAF (Anexo V). */
export function TafTab() {
  const { taf } = useContent().notice;
  return (
    <>
      <Alert tone="warning">
        Em cada teste, a pontuação mínima (25 pontos) já aprova; abaixo dela o candidato é eliminado. Local: {taf.local}
        .
      </Alert>
      <Card $padding={4} style={{ margin: '16px 0' }}>
        <BulletList>
          {taf.observacoes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </BulletList>
      </Card>
      <Groups>
        {taf.testes.map((test) => {
          const hasMale = test.tabela.some((row) => row.masculino);
          const hasFemale = test.tabela.some((row) => row.feminino);
          return (
            <Card key={test.id}>
              <TafHeader>
                <strong>{test.nome}</strong>
                <small>{test.publico}</small>
                <p>{test.descricao}</p>
              </TafHeader>
              <Table>
                <thead>
                  <tr>
                    {hasMale && <th scope="col">Masculino ({test.unidade})</th>}
                    {hasFemale && <th scope="col">Feminino ({test.unidade})</th>}
                    <th scope="col">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {test.tabela.map((row) => (
                    <tr key={`${row.masculino}-${row.feminino}-${row.pontos}`}>
                      {hasMale && <td>{row.masculino}</td>}
                      {hasFemale && <td>{row.feminino}</td>}
                      <td>{row.pontos}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          );
        })}
      </Groups>
    </>
  );
}
