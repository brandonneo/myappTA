import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockData = [
  {
    postId: 1,
    id: 1,
    name: 'id labore ex et quam laborum',
    email: 'Eliseo@gardner.biz',
    body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium'
  },
  {
    postId: 1,
    id: 2,
    name: 'quo vero reiciendis velit similique earum',
    email: 'Jayne_Kuhic@sydney.com',
    body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et'
  },
  {
    postId: 1,
    id: 3,
    name: 'odio adipisci rerum aut animi',
    email: 'Nikita@garfield.biz',
    body: 'quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione'
  }
];

test('displays data after file upload', async () => {
  mockedAxios.post.mockResolvedValueOnce({ data: mockData });

  render(<App />);

  // Simulate file upload
  fireEvent.change(screen.getByLabelText(/upload csv file/i), {
    target: { files: [new File(['dummy content'], 'data.csv')] }
  });

  // Click the upload button
  fireEvent.click(screen.getByRole('button', { name: /upload/i }));

  // Wait for data to be displayed
  await waitFor(() => {
    // Check if data is displayed in the table
    expect(screen.getByText(/id labore ex et quam laborum/i)).toBeInTheDocument();
    expect(screen.getByText(/quo vero reiciendis velit similique earum/i)).toBeInTheDocument();
    expect(screen.getByText(/odio adipisci rerum aut animi/i)).toBeInTheDocument();
  });

  // Additional assertions to check table data
  expect(screen.getByText(/Eliseo@gardner.biz/i)).toBeInTheDocument();
  expect(screen.getByText(/Jayne_Kuhic@sydney.com/i)).toBeInTheDocument();
  expect(screen.getByText(/Nikita@garfield.biz/i)).toBeInTheDocument();

  // Check for "No data available" when no data is present
  expect(screen.queryByText(/No data available/i)).toBeNull();
});
