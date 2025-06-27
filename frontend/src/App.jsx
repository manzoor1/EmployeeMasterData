import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL;
// Ensure you have the API URL set in your .env file as VITE_API_URL
function App() {
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    date_of_birth: '',
    address: '',
    contact_number: '',
    date_of_joining: '',
    bank_name: '',
    account_number: '',
  });

  const [employees, setEmployees] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees/`);
      setEmployees(res.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/employees/add/`, form);
      fetchEmployees();
      setForm({
        employee_id: '',
        full_name: '',
        date_of_birth: '',
        address: '',
        contact_number: '',
        date_of_joining: '',
        bank_name: '',
        account_number: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Master Data Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #1e40af; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .print-date { text-align: right; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Employee Master Data Report</h1>
          <div class="print-date">Generated on: ${format(new Date(), 'PPP')}</div>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th>Date of Joining</th>
                <th>Bank Name</th>
                <th>Account Number</th>
              </tr>
            </thead>
            <tbody>
              ${employees
                .filter(
                  (emp) =>
                    emp.employee_id.toLowerCase().includes(filterTerm.toLowerCase()) ||
                    emp.full_name.toLowerCase().includes(filterTerm.toLowerCase())
                )
                .map(
                  (emp) => `
                <tr>
                  <td>${emp.employee_id}</td>
                  <td>${emp.full_name}</td>
                  <td>${format(new Date(emp.date_of_birth), 'dd/MM/yyyy')}</td>
                  <td>${emp.address}</td>
                  <td>${emp.contact_number}</td>
                  <td>${format(new Date(emp.date_of_joining), 'dd/MM/yyyy')}</td>
                  <td>${emp.bank_name}</td>
                  <td>${emp.account_number}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            Total Employees: ${employees.length}
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Employee Master Data
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md mb-8"
        >
          {[
            ['Employee ID', 'employee_id', 'text'],
            ['Full Name', 'full_name', 'text'],
            ['Date of Birth', 'date_of_birth', 'date'],
            ['Address', 'address', 'text'],
            ['Contact Number', 'contact_number', 'tel'],
            ['Date of Joining', 'date_of_joining', 'date'],
            ['Bank Name', 'bank_name', 'text'],
            ['Account Number', 'account_number', 'text'],
          ].map(([label, name, type]) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          ))}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Filter by Name or ID"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors print:hidden"
            >
              Print
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    'ID',
                    'Name',
                    'Date of Birth',
                    'Address',
                    'Contact',
                    'Joining',
                    'Bank',
                    'Account No',
                  ].map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 p-3 text-left font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees
                  .filter(
                    (emp) =>
                      emp.employee_id.toLowerCase().includes(filterTerm.toLowerCase()) ||
                      emp.full_name.toLowerCase().includes(filterTerm.toLowerCase())
                  )
                  .map((emp, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="border border-gray-300 p-3">{emp.employee_id}</td>
                      <td className="border border-gray-300 p-3">{emp.full_name}</td>
                      <td className="border border-gray-300 p-3">{emp.date_of_birth}</td>
                      <td className="border border-gray-300 p-3">{emp.address}</td>
                      <td className="border border-gray-300 p-3">{emp.contact_number}</td>
                      <td className="border border-gray-300 p-3">{emp.date_of_joining}</td>
                      <td className="border border-gray-300 p-3">{emp.bank_name}</td>
                      <td className="border border-gray-300 p-3">{emp.account_number}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
