import {render, screen} from '@testing-library/react';
import TaskItem from '../src/components/TaskItem.jsx';

describe('TaskItem Component', () => {
  it('renders task data', () => {
    render(<TaskItem task={{title: 'Test Task', completed: false}} />);

    expect(screen.getByText('Test Task')).toBeDefined();
    expect(screen.getByText('Status: Pending')).toBeDefined();
  });
});
