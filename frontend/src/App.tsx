import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setData(response.data);
        setCurrentPage(1); // Reset to the first page after upload
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      (value as string).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h1>CSV Upload and Data List</h1>
      <Form>
        <Form.Group controlId="formFile">
          <Form.Label>Upload CSV File</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button onClick={uploadFile} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Form>

      <Form.Group className="mt-3">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).filter(key => key !== 'postId').map(key => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={index}>
                {Object.entries(item).filter(([key]) => key !== 'postId').map(([_, value], idx) => <td key={idx}>{value as string | number}</td>)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0] || {}).length}>No data available</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default App;
