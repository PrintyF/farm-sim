import { ControlPanelComponent } from './control-panel.component';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('ControlPanelComponent', () => {

  describe('Play button', () => {
    it('should render', async () => {
      await render(ControlPanelComponent);
  
      const buttonElement = screen.getByText(/Play/i);
      expect(buttonElement).toBeInTheDocument();
    });
  
    it.each([[true, "Pause"]])('should display Pause or Play when clicked From Play / Pause', async () => {
      await render(ControlPanelComponent);
      const buttonElement = screen.getByText(/Play/i);
      fireEvent.click(buttonElement);
      expect(buttonElement).toHaveTextContent('Pause');
    });

    it('should display Play when clicked from Pause', async () => {
      await render(ControlPanelComponent);
      const buttonElement = screen.getByText(/Play/i);
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);
      expect(buttonElement).toHaveTextContent('Play');
    });
  
  });
});
