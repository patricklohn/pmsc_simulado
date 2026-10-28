import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@tests/render-with-providers';
import { RegisterForm } from '.';

describe('RegisterForm', () => {
  it('exige senhas iguais e envia nome, e-mail e senha', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithTheme(<RegisterForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Seu nome'), 'Ana Souza');
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com.br');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-boa-123');
    await userEvent.type(screen.getByLabelText('Confirme a senha'), 'outra-senha');
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }));
    expect(await screen.findByText('As senhas não conferem')).toBeInTheDocument();

    await userEvent.clear(screen.getByLabelText('Confirme a senha'));
    await userEvent.type(screen.getByLabelText('Confirme a senha'), 'senha-boa-123');
    await userEvent.click(screen.getByRole('button', { name: 'Criar cadastro' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana Souza', email: 'ana@exemplo.com.br', password: 'senha-boa-123' })
    );
  });
});
