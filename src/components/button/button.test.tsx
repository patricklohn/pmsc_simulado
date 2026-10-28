import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/render-with-providers';
import { Button, IconButton } from '.';

describe('Button', () => {
  it('dispara o clique', async () => {
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Salvar</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('carregando: fica desabilitado e mostra o spinner', () => {
    renderWithProviders(<Button isLoading>Salvar</Button>);

    expect(screen.getByRole('button', { name: /Salvar/ })).toBeDisabled();
    expect(screen.getByRole('status', { name: 'Carregando' })).toBeInTheDocument();
  });

  it('IconButton tem nome acessível', () => {
    renderWithProviders(
      <IconButton aria-label="Fechar">
        <span />
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });
});
