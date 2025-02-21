"use client"

import { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseSummary from '../components/ExpenseSummary';

// Add the API base URL
const API_BASE_URL = 'http://54.226.1.246:3001';

export default function Home() {
  const [expenses, setExpenses] = useState([]);  // Initialize as empty array
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data || []); // Ensure we always set an array
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message);
      setExpenses([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (expense) => {
    try {
      const url = currentExpense 
        ? `${API_BASE_URL}/api/expenses/${currentExpense.id}` 
        : `${API_BASE_URL}/api/expenses`;
      
      const method = currentExpense ? 'PUT' : 'POST';
      
      const formattedExpense = {
        ...expense,
        date: new Date(expense.date).toISOString()
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedExpense),
      });

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      fetchExpenses();
      setCurrentExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      <ExpenseForm 
        expense={currentExpense} 
        onSubmit={handleCreateOrUpdate} 
        onCancel={() => setCurrentExpense(null)}
      />
      {isLoading ? (
        <div className="text-center py-4">Loading expenses...</div>
      ) : (
        <ExpenseList 
          expenses={expenses} 
          onEdit={setCurrentExpense} 
          onDelete={handleDelete} 
        />
      )}
      <ExpenseSummary expenses={expenses} />
    </div>
  );
}
