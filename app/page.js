"use client"

import { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseSummary from '../components/ExpenseSummary';

const API_BASE_URL = 'http://localhost:8080';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleCreateOrUpdate = async (expense) => {
    try {
      const url = currentExpense 
        ? `${API_BASE_URL}/api/expenses/${currentExpense.id}` 
        : `${API_BASE_URL}/api/expenses`;
      
      const method = currentExpense ? 'PUT' : 'POST';
      
      // Format the date to ISO string for the backend
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
      <ExpenseForm 
        expense={currentExpense} 
        onSubmit={handleCreateOrUpdate} 
        onCancel={() => setCurrentExpense(null)}
      />
      <ExpenseList 
        expenses={expenses} 
        onEdit={setCurrentExpense} 
        onDelete={handleDelete} 
      />
      <ExpenseSummary expenses={expenses} />
    </div>
  );
}
