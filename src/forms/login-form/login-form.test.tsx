import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError } from '@services/api-error';
import { renderWithTheme } from '@tests/render-with-providers';
import { LoginForm } from '.';

describe('LoginForm', () => {
  it('valida o formato antes de enviar', async () => {
    const onSubmit = vi.fn();
    renderWithTheme(<LoginForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe o e-mail')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('mostra a mensagem da API (ex.: cadastro aguardando liberação)', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError(403, 'USER_PENDING', 'Seu cadastro está aguardando liberação.'));
    renderWithTheme(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com.br');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-qualquer');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('aguardando liberação');
  });
});
