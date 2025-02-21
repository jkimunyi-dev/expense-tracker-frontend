"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseSummary from '../components/ExpenseSummary';
import Link from 'next/link';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated, loading]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.expenses.getAll();
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message);
      if (error.status === 401) {
        logout();
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (expense) => {
    try {
      if (currentExpense) {
        await api.expenses.update(currentExpense.id, {
          ...expense,
          date: new Date(expense.date).toISOString()
        });
      } else {
        await api.expenses.create({
          ...expense,
          date: new Date(expense.date).toISOString()
        });
      }
      await fetchExpenses();
      setCurrentExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      setError(error.message);
      if (error.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.expenses.delete(id);
      await fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.message);
      if (error.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      <ExpenseForm 
        expense={currentExpense} 
        onSubmit={handleCreateOrUpdate} 
        onCancel={() => setCurrentExpense(null)}
      />
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <ExpenseList 
            expenses={expenses} 
            onEdit={setCurrentExpense} 
            onDelete={handleDelete} 
          />
          <ExpenseSummary expenses={expenses} />
        </>
      )}
    </div>
  );
}
