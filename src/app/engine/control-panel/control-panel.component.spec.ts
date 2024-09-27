import { ControlPanelComponent } from './control-panel.component';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('ControlPanelComponent', () => {
  
  beforeEach( async () => {
    await render(ControlPanelComponent);
  });
  
  beforeEach(async () => {
    jest.useFakeTimers();
  })
  
  describe('Play button', () => {
    it('should render a button with play', async () => {
      const buttonElement = screen.getByText(/Play/i);
      expect(buttonElement).toBeInTheDocument();
    });
    
    it.each([[true, "Pause"]])('should display Pause or Play when clicked From Play / Pause', async () => {
      const buttonElement = screen.getByText(/Play/i);
      fireEvent.click(buttonElement);
      expect(buttonElement).toHaveTextContent('Pause');
    });
    
    it('should display Play when clicked from Pause', async () => {
      const buttonElement = screen.getByText(/Play/i);
      fireEvent.click(buttonElement);
      fireEvent.click(buttonElement);
      expect(buttonElement).toHaveTextContent('Play');
    });
    
  });
  
  describe('timeline', () => {
    it('should render a slider', async () => {
      const buttonElement = screen.getByRole('slider');
      
      expect(buttonElement).toBeInTheDocument();
    });
    
    it('should slide when play is pressed', async () => {
      const playButton =  screen.getByRole('button', { name: /Play/i });
      const slider = screen.getByRole('slider');
      
      fireEvent.click(playButton);
      jest.advanceTimersByTime(10000);
      fireEvent.click(playButton);
      expect(slider.getAttribute('ng-reflect-model')).toBeCloseTo(10, 1);
    });
  })
});
