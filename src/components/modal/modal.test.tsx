import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@tests/render-with-providers';
import { Modal } from '.';

describe('Modal', () => {
  it('abre com título acessível e fecha com Esc e com o X', async () => {
    const onClose = vi.fn();
    renderWithProviders(
      <Modal isOpen title="Cancelar nota" onClose={onClose}>
        conteúdo
      </Modal>
    );

    expect(screen.getByRole('dialog', { name: 'Cancelar nota' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('fechado não renderiza nada', () => {
    renderWithProviders(
      <Modal isOpen={false} title="X" onClose={() => undefined}>
        conteúdo
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
